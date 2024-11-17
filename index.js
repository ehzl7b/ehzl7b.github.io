import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
import * as sass from "sass";
import { renderer } from "./_lib/renderer.js";
import global from "./_src/globals.js";


const $_src = "./_src";
const $_site = "./_site";


console.log("===> 빌드 시작");

const mdGlob = fg.globSync(`${$_src}/**/*.md`, {ignore: `${$_src}/_layout/**/*.md`});
const pagesMap = {};

for (let mdFile of mdGlob) {
  let vars = {};
  let t = undefined;

  // global 오브젝트 렌더링
  let {dir, name} = path.parse(mdFile);
  dir = dir.replace($_src, "") || "/";
  Object.assign(vars, {name});
  t = JSON.parse(renderer.liquid(JSON.stringify(global), vars))
  Object.assign(vars, {...t});

  // markdown 프론트매터 렌더링
  let {frontmatter, content} = renderer.separate(fs.readFileSync(mdFile, "utf-8"));
  t = renderer.liquid(frontmatter, vars).trim();
  t = renderer.yaml(t);
  Object.assign(vars, {...t});

  // markdown 콘텐츠 렌더링
  t = renderer.liquid(content, vars);
  t = renderer.md(t).trim();
  Object.assign(vars, {content: t});

  // pagesMap 삽입
  pagesMap[dir] ??= [];
  pagesMap[dir].push({...vars});
}

for (let [dir, pages] of Object.entries(pagesMap)) {
  for (let [i, page] of pages.entries()) {
    // layout 체이닝
    while ("layout" in page) {
      let {layout, ...vars} = page;
      let t = undefined;

      // liquid 템플릿 프론트메터 렌더링
      let{frontmatter, content} = renderer.separate(fs.readFileSync(`${$_src}/_layout/${layout}.liquid`, "utf-8"));
      t = renderer.liquid(frontmatter, vars).trim();
      t = renderer.yaml(t);
      Object.assign(vars, {...t, pagesMap});

      // liquid 템플릿 콘텐츠 렌더링
      t = renderer.liquid(content, vars).trim();
      Object.assign(vars, {content: t});

      page = vars;
    }

    // 렌더링 결과 저장
    let t = `${$_site}${page.permalink}`;
    fs.outputFileSync(t.endsWith("/") ? `${t}index.html` : t, page.content);
  }
}

console.log(`==> 총 ${mdGlob.length}개 markdown 템플릿 렌더링 완료`);

// scss 파일은 css 로 전환하고, /asset 폴더에 있는 모든 스태틱 파일을 복사
const css = sass.compile(`${$_src}/asset/main.scss`, {style: "compressed"});
fs.outputFileSync(`${$_site}/main.css`, css.css);

fs.copySync(`${$_src}/asset`, `${$_site}/`, {filter: (src, _) => !src.includes("main.scss")});

console.log(`==> 필요한 스태틱 파일들 복사 완료`);
console.log(`==> 전체 사이트 빌드가 완료되었습니다.`);