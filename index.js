import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
import { renderer } from "./_lib/renderer.js";
// import global from "./_src/globals.js";



const $_src = "./_src";
const $_site = "./_site";
const global = {
  site: {
    title: "어즐 블로그",
  },
  layout: "page",
  permalink: "/page/{{ name | remove_label }}/",
  content: "",
};


console.log("===> 빌드 시작");

console.log("===> markdown 렌더링 시작");
const mdGlob = fg.globSync(`${$_src}/**/*.md`, {ignore: `${$_src}/_layout/**/*.md`});
const pagesMap = {};

for (let mdFile of mdGlob) {
  let vars = {};
  let t = undefined;

  // global 오브젝트 렌더링
  let {dir, name} = path.parse(mdFile);
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
  for (let page of pages) {
    // layout 체이닝
    while ("layout" in page) {
      let {layout, ...vars } = page;
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
    fs.outputFileSync(`${$_site}${page.permalink}index.html`, page.content);
  }
}









// const $_src = "./_src";
// const $_site = "./_site";
// const pagesGlob = fg.globSync(`${$_src}/**/*.{md,liquid}`, {ignore: `${$_src}/_layout/**/*`});


// // 템플릿 렌더 함수
// function render(file, vars) {
//   vars = JSON.parse(renderer.liquid(JSON.stringify(vars), vars));

//   let {frontmatter, content} = renderer.separate(fs.readFileSync(file, "utf-8"));
//   frontmatter = renderer.liquid(frontmatter, vars).trim();

//   Object.assign(vars, renderer.yaml(frontmatter));
//   content = renderer.liquid(content, vars).trim();

//   if (path.extname(file) === ".md") content = renderer.md(content).trim();
//   Object.assign(vars, {content});

//   if ("layout" in vars) {
//     let {layout, ...nextVars} = vars;
//     return render(`${$_src}/_layout/${layout}.liquid`, nextVars);
//   } else {
//     return {vars, content};
//   }
// }

// // 렌더링 결과물 생성 함수
// function save(permalink, content) {
//   let path = `${$_site}${permalink.endsWith("/") ? permalink + "index.html" : permalink }`;
//   fs.outputFileSync(path, content);
// }

// console.log(`==> 총 ${pagesGlob.length} 개의 템플릿을 확인했습니다. 빌드를 시작합니다.`);

// // 전체 웹페이지 정보 저장
// const pagesMap = {};
// for (let file of pagesGlob) {
//   let {dir, base, name, ext} = path.parse(file.replace($_src, ""));
//   let {vars, content} = render(file, {cat: dir, name, ...global});
  
//   pagesMap[dir] ??= [];
//   pagesMap[dir].push({...vars, content});
// }

// // permalink 에 따라 웹페이지 기록
// for (let [_, pages] of Object.entries(pagesMap)) {
//   for (let {permalink, content} of pages) {
//     save(permalink, content);
//   }
// }

// console.log(`==> 템플릿마다 웹페이지를 생성하고 저장하였습니다.`);

// // 카테고리 페이지 생성
// for (let {cat, permalink, icon, title, reverse} of global.site.cats) {
//   if (cat in pagesMap) {
//     let pages = pagesMap[cat];
//     let {vars, content} = render(`${$_src}/_layout/catpage.liquid`, {permalink, icon, title, pages, reverse, site: global.site});

//     save(vars.permalink, content);
//   }
// }

// // sitemap.xml 생성
// {
//   let {vars, content} = render(`${$_src}/_layout/sitemap.liquid`, {pagesMap});
//   save(vars.permalink, content);
// }

// console.log(`==> sitemap.xml 을 생성했습니다.`);

// // asset 파일들 복사
// {
//   fs.copySync(`${$_src}/asset`, `${$_site}/`);
// }

// console.log(`==> asset 폴더 안의 파일들을 복사했습니다.`);
