import fs from "fs-extra"
import fg from "fast-glob"
import path from "node:path"
import { renderer } from "./_lib/renderer.ts"
import { ForTag } from "liquidjs";

const $_page = "./_page/"
const $_layout = "./_layout/"
const $_asset = "./_asset/"
const vars = {
  site: {
    title: "EHzL 블로그",
    footer: {
      msg: "<div>Designed by EHzL,</div><div>Built with Deno,</div><div>Deployed on Github.</div>",
    },
  },
  layout: "page",
  permalink: "/page/{{ name | remove_label }}",
  content: "",
}
const pagesMap = {}

console.log(`==> 빌드 시작`)
/**
 * Step 1) md -> html, 업데이트 pagesMap 오브젝트
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
  const mdFiles = fg.globSync(`${$_page}**/*.md`)
  for (let f of mdFiles) {
    const {dir, name} = path.parse(f)
    Object.assign(vars, renderer.yaml(renderer.liquid(JSON.stringify(vars), {dir, name})))

    pagesMap[dir] ??= []
    pagesMap[dir].push(vars)

    console.log(pagesMap)
  }



  // console.log(mdFiles)
}