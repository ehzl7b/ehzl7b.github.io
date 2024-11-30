import fs from "fs-extra"
import fg from "fast-glob"
import path from "node:path"
import { renderer } from "./_lib/renderer.ts"
import { ForTag } from "liquidjs";

const $_page = "./_page"
const $_layout = "./_layout"
const $_asset = "./_asset"
const $_site = "./_site"
const $_dir = "./_dir"
const vars = {
  site: {
    title: "EHzL 블로그",
    footer: {
      msg: "<div>Designed by EHzL,</div><div>Built with Deno,</div><div>Deployed on Github.</div>",
    },
  },
  layout: "page",
  permalink: "/page/{{ name | remove_label }}",
  filepath: "/page/{{ name | remove_label }}.json",
  content: "",
}

type PagesMap = {
  [key: string]: object[]
}
const pagesMap: PagesMap = {}

console.log(`==> 빌드 시작`)
/**
 * Step 1) md -> html, pagesMap 오브젝트 생성
 * 
 * pagesMap = {
 *   dir: [
 *     {...vars},
 *     ...
 *   ],
 *   ...
 * }
 */
{
  fs.removeSync(`${$_site}/`)

  const mdFiles = fg.globSync(`${$_page}/**/*.md`)
  for (const f of mdFiles) {
    const {dir, name} = path.parse(f)
    Object.assign(vars, renderer.yaml(renderer.liquid(JSON.stringify(vars), {dir, name})))

    const {frontmatter, content} = renderer.separate(fs.readFileSync(f, "utf-8"))
    Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars).trim()))
    Object.assign(vars, {content: renderer.liquid(renderer.md(content), vars).trim()})

    pagesMap[dir] ??= []
    pagesMap[dir].push(vars)

    fs.outputJsonSync(vars.filepath, {content: vars.content})
  }

  console.log(`==> ${mdFiles.length}개 마크다운 파일 렌더링 완료`)
}

/**
 * Step 2) pagesMap 순회, layout 체이닝 사용하여 페이지 빌드
 */
{
  for (const [dir, pages] of Object.entries(pagesMap).sort((x, y) => x[0].localeCompare(y[0]))) {
    for (const page of pages) {
      let vars = page

      while (layout) {

      }
    }
  }
}