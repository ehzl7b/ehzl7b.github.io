import path from "node:path"
import fs from "fs-extra"
import fg from "fast-glob"
import { renderer } from "./_lib/renderer.js"


const $_page = "./_page"
const $_layout = "./_layout"
const $_site = "./_site"
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

  // layout 체이닝 반복문
  let file = mdFile
  while (true) {
    // 프론트매터 렌더링 -> vars 업데이트 
    let {frontmatter, content} = renderer.separate(fs.readFileSync(file, "utf-8").trim())
    Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars)))

    // layout 을 vars 에서 분리
    let {layout, ...rest} = vars
    vars = rest

    // 콘텐츠 렌더링 -> vars 업데이트
    content = (path.extname(file) === ".md") ? renderer.md(content) : renderer.liquid(content, vars)
    Object.assign(vars, {content})
    
    // layout 체이닝 분기구문 -> layout 업다면 pagesMap 업데이트 -> 반복종료
    if (layout !== undefined) {
      file = `${$_layout}/${layout}.liquid`
    } else {
      pagesMap[dir] ??= []
      pagesMap[dir].push(vars)
      break
    }
  }
}
console.log(pagesMap)


  // // 파일경로 분해 결과를 변수로 하여, $global liquid 렌더링
  // let {dir, name} = path.parse(mdFile)
  // dir = dir.replace($_page, "") || "/"
  // let vars = {dir, name}
  // Object.assign(vars, JSON.parse(renderer.liquid(JSON.stringify($global), vars)))

  // // 위 결과를 변수로 하여, 프론트매터 liquid 렌더링
  // let {frontmatter, content} = renderer.separate(fs.readFileSync(mdFile, "utf-8").trim())
  // Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter)))

  // // 콘텐츠 markdown 렌더링
  // content = renderer.md(content).trim()
  // Object.assign(vars, {content})

  // // 프론트매터를 변수로 하여, 콘텐츠 liquid 렌더링 (layout 체이닝)
  // while ("layout" in vars) {
  //   let {layout, ...rest} = vars
  //   vars = rest

  //   let {frontmatter, content} = renderer.separate(fs.readFileSync(`${$_layout}/${layout}.liquid`, "utf-8").trim())
  //   Objext.assign(vars, renderer.yaml(renderer.liquid(frontmatter)))
  //   content = renderer.liquid(, vars)
  // }

  // // 프론트매터, 콘텐츠 렌더링 결과를 pagesMap 에 저장
  // pagesMap[dir] ??= []
  // pagesMap[dir].push(vars)
