import fg from "fast-glob"
import fs from "fs-extra"
import path from "node:path"
import { renderer } from "./_lib/renderer.js"

const $_layout = "./_layout"
const $_page = "./_page"
const $_site = "./_site"
const global = {
  site: {
    title: "EHzL Blog",
    footer: {
      msg: "<div>Designed by EHzl,</div><div>Built with Deno,</div><div>Powered by Github.</div>",
    },
  },
  layout: "page",
  permalink: "/page/{{ name | remove_label }}/",
}

const pagesMap = {}

console.log(`==> 웹사이트 빌드 시작`)

/**
 * 
 * Step 1) md 렌더링 -> pagesMap 오브젝트 생성
 * 
 * pagesMap = {
 *   dir: [
 *     {permalink, title, description, updated, content},
 *     ...
 *   ],
 *   ...
 * }
 *  
 */
{
  const mdFiles = fg.sync(`${$_page}/**/*.md`)

  for (let file of mdFiles) {
    let vars = {}

    let {dir, name} = path.parse(file)
    dir = dir.replace($_page, "") + "/"
    Object.assign(vars, {dir, name})
    Object.assign(vars, JSON.parse(renderer.liquid(JSON.stringify(global), vars)))

    let {frontmatter, content} = renderer.separate(fs.readFileSync(file, "utf-8").trim())
    Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars)))
    Object.assign(vars, {content: renderer.md(content)})

    pagesMap[dir] ??= []
    pagesMap[dir].push(vars)
  }

  console.log(`==> 총 ${mdFiles.length}개의 markdown 파일 렌더링 완료`)
}

/**
 * 
 * Step 2) pagesMap 순회 -> layout 체이닝에 따라 liquid 렌더링 -> pagesMap 업데이트
 */
{
  for (let [dir, pages] of Object.entries(pagesMap).sort((x, y) => -x[0].localeCompare(y[0]))) {
    for (let page of pages) {
      let vars = page

      while (true) {
        let layout = vars.layout
        delete vars["layout"]

        if (layout !== undefined) {
          let {frontmatter, content} = renderer.separate(fs.readFileSync(`${$_layout}/${layout}.liquid`, "utf-8").trim())
          Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, {...vars, pagesMap})))
          Object.assign(vars, {content: renderer.liquid(content, {...vars, pagesMap})})
        } else {
          break
        }
      }
    }
  }

  console.log(`==> 전체 웹페이지 렌더링 완료`)
}

/**
 * 
 * Step 3) pagesMap 순화 -> html 파일 저장
 */
{
  for (let [dir, pages] of Object.entries(pagesMap)) {
    for (let page of pages) {
      let p = $_site + page.permalink + page.permalink.endsWidh("/") ? "index.html" : ""
      fs.outputFileSync(p, page.content)
    }
  }
}