import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
// import _ from "lodash";
import { renderer } from "./_lib/renderer.js";
import global from "./_src/globals.js";

// 템플릿 렌더 함수
function render(file, vars) {
  vars = JSON.parse(renderer.liquid(JSON.stringify(vars), vars));

  let {frontmatter, content} = renderer.separate(fs.readFileSync(file, "utf-8"));
  frontmatter = renderer.liquid(frontmatter, vars);

  Object.assign(vars, renderer.yaml(frontmatter));
  content = renderer.liquid(content, vars);

  if (path.extname(file) === ".md") content = renderer.md(content);
  Object.assign(vars, {content});

  if ("layout" in vars) {
    let {layout, ...nextVars} = vars;
    return render(`${$_src}/_layout/${layout}.liquid`, nextVars);
  } else {
    return {vars, content};
  }
}

// 렌더링 결과 저장 함수
function save(permalink, content) {
  let path = `${$_site}${permalink.endsWith("/") ? permalink + "index.html" : permalink }`;
  fs.outputFileSync(path, content);
}

const $_src = "./_src";
const $_site = "./_site";
const pagesGlob = fg.globSync(`${$_src}/**/*.{md,liquid}`, {ignore: `${$_src}/_layout/**/*`});

// 전체 웹페이지 정보 저장
const pagesMap = {};
for (let file of pagesGlob) {
  let {dir, base, name, ext} = path.parse(file.replace($_src, ""));
  let {vars, content} = render(file, {cat: dir, name, ...global});
  
  pagesMap[dir] ??= [];
  pagesMap[dir].push({permalink: vars.permalink, title: vars.title, content});
}

// permalink 에 따라 웹페이지 기록
// for (let [_, pages] of Object.entries(pagesMap)) {
//   for (let {permalink, content} of pages) {
//     fs.outputFileSync(`${$_site}${permalink}index.html`, content);
//   }
// }

// 카테고리 페이지 생성
// for (let {cat, permalink, icon, title} of global.site.cats) {
//   if (cat in pagesMap) {
//     // console.log(cat, permalink, title);
//     let pages = pagesMap[cat];
//     let {vars, content} = render(`${$_src}/_layout/catpage.liquid`, {permalink, icon, title, pages});
// 
//     save(vars.permalink, content);
//   }
// }

// console.log(pagesMap);

// sitemap.xml 생성
{
  let allpages = [];
  for (let [_, pages] of Object.entries(pagesMap)) {
    allpages = allpages.concat(pages);
  }
  // console.log(allpages);
  let {vars, content} = render(`${$_src}/_layout/sitemap.liquid`, {pages: allpages});
  save(vars.permalink, content);

  /**
   * 
   * 
   * 파일 정보에 updated 필요...
   * 
   * 
   */
}