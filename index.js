import fg from "npm:fast-glob"
import fs from "npm:fs-extra"
import path from "node:path"
import { renderer } from "./_lib/renderer.js"

const $_page = "./_page"
const global = {
  site: {
    title: "EHzL Blog",
  },
  footer: {
    msg: "<div>Designed by EHzl,</div><div>Built with Deno,</div><div>Powered by Github.</div>", 
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
    dir = dir.replace($_page, "") || "/"
    Object.assign(vars, JSON.parse(renderer.liquid(JSON.stringify(global), {dir, name})))

    let {frontmatter, content} = renderer.separate(fs.readFileSync(file, "utf-8").trim())
    Object.assign(vars, renderer.yaml(frontmatter))
    Object.assign(vars, {content: renderer.md(content)})

    pagesMap[dir] ??= []
    pagesMap[dir].push(vars)
  }

  console.log(`==> 총 ${mdFiles.length}개의 markdown 파일 렌더링`)
}

/**
 * 
 * Step 2) pagesMap 순회 -> layout 체이닝에 따라 렌더링 -> content 제외 pagesMap 업데이트
 */
{
  for (let [dir, pages] of Object.entries(pagesMap)) {
    console.log(dir)
  }
}
