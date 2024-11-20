import path from "node:path"
import fs from "fs-extra"
import fg from "fast-glob"
import * as sass from "sass"
import { renderer } from "./_lib/renderer.js"


const $_page = "./_page"
const $_layout = "./_layout"
const $_site = "./_site"
const $_asset = "./_asset"
const $global = {
  site: {
    title: "어즐 블로그",
  },
  layout: "page",
  permalink: "/page/{{ name | remove_label }}/",
  filepath: `${$_site}/{{ name | remove_label }}.html`, 
  content: "",
}

const pagesMap = {}
const permalinksMap = {}

fs.removeSync(`${$_site}/`)

console.log(`==> SPA 웹사이트 빌드 시작`)

/**
 * 
 * Step 1) markdown 렌더링 후 pagesMap 오브젝트 생성
 * 
 * pagesMap 은 카테고리 페이지 등에서, 
 * 해당 카테고리에 속한 포스팅들 정보를 읽을 수 있도록
 * 사전에 미리 만들어놓는 오브젝트
 * 
 * pageMap = {
 *  dir: [
 *    {permalink, title, content, updated, ... },
 *    ...
 *  ],
 *  ...
 * }
 * 
 */
{
  // 전체 markdown 템플릿 순회
  const mdGlob = fg.globSync(`${$_page}/*.md`)
  for (let mdFile of mdGlob) {
    let vars = {}

    // 파일경로 분해 결과 -> vars 업데이트
    let {dir, name} = path.parse(mdFile)
    dir = dir.replace($_page, "") || "/"
    Object.assign(vars, {dir, name})

    // $global 렌더링 -> vars 업데이트
    Object.assign(vars, JSON.parse(renderer.liquid(JSON.stringify($global), vars)))

    // markdown 을 프론트매터와 콘텐츠로 분해
    let {frontmatter, content} = renderer.separate(fs.readFileSync(mdFile, "utf-8").trim())

    // 프론트매터 렌더링 -> vars 업데이트
    Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars)))

    // 콘텐츠 렌러딩 -> vars 업데이트
    content = renderer.md(content).trim()
    Object.assign(vars, {content})

    // pagesMap 오브젝트 업데이트
    pagesMap[dir] ??= []
    pagesMap[dir].push(vars)
  }
  
  console.log(`==> 전체 ${mdGlob.length} 개 웹페이지 소스 확인, markdown 렌더링 완료`)
}


/**
 * 
 * Step 2) 각 웹페이지 빌드 및 저장
 * 
 * pagesMap 오브젝트를 순회, pagesMap 오브젝트 정보 활용, layout 체이닝 통해
 * html 페이지 빌드하고 저장
 * 
 * 웹사이트가 permalink 에 따라, 매칭이 되는 html 페이지를 로드할 수 있도록
 * 매칭테이블에 해당하는 permalinksMap 오브젝트 생성하고 json 형식으로 저장
 * 
 * permalinksMap = {
 *  permalink: filepath,
 *  ...
 * }
 */
{
  // pagesMap 순회
  for (let [dir, pages] of Object.entries(pagesMap)) {
    for (let page of pages) {
      while (true) {
        // page 에서 layout 분리
        let {layout, ...vars} = page

        // layout 이 있다면 계속,
        // 없다면 렌더링 결과물 저장, permalinksMap 오브젝트 업데이트
        if (layout !== undefined) {
          // liquid 를 프론트매터와 콘텐츠로 분해
          let {frontmatter, content} = renderer.separate(fs.readFileSync(`${$_layout}/${layout}.liquid`, "utf-8").trim())

          // 프론트매터 렌더링 -> vars 업데이트
          Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars)))

          // 콘텐츠 렌더딩(pagesMap 정보 포함) -> vars 업데이트
          content = renderer.liquid(content, {...vars, pagesMap}).trim()
          Object.assign(vars, {content})

          // page 업데이트 하고 layout 체이닝 계속
          page = vars
        } else {
          // 현재까지 렌더링 결과 저장, permalinksMap 업데이트
          fs.outputFileSync(vars.filepath, vars.content)
          permalinksMap[vars.permalink] = vars.filepath.replace($_site, "")

          // layout 체이닝 종료
          break
        }
      }
    }
  }

  // permalinksMap 오브젝트, JSON 으로 변환 후 저장
  fs.outputJSONSync(`${$_site}/permalinksMap.json`, permalinksMap)

  console.log(`==> 웹페이지별 html 빌드 완료`)
}

/**
 * 
 * Step 3) Index.html / 404.html 빌드, 기타 리소스 복사
 * 
 * 메인 css, js 파일 이름은 main.css(main.scss 를 변환), main.js 로 고정,
 * 
 */
{
  // base.liquid 렌더링 -> index.html / 404.html 빌드
  let {frontmatter, content} = renderer.separate(fs.readFileSync(`${$_layout}/base.liquid`, "utf-8").trim())
  let vars = renderer.yaml(renderer.liquid(frontmatter, $global))
  content = renderer.liquid(content, {...vars, pagesMap})
  fs.outputFileSync(`${$_site}/index.html`, content)
  fs.copySync(`${$_site}/index.html`, `${$_site}/404.html`)

  // scss -> css 변환
  fs.ensureFileSync(`${$_asset}/main.scss`)
  const css = sass.compile(`${$_asset}/main.scss`, {style: "compressed"});
  fs.outputFileSync(`${$_site}/main.css`, css.css);

  // 나머지 파일들 복사
  fs.copySync(`${$_asset}/`, `${$_site}/`, {filter: (src, _) => !src.includes("main.scss")});

  console.log(`==> 전체 웹사이트 빌드 완료`)
}