import fs from "fs-extra";
import fg from "fast-glob";
import * as sass from "sass";
import path from "node:path";
import { renderer } from "./_lib/renderer.js";

const $_page = "./_page";
const $_layout = "./_layout";
const $_asset = "./_asset";
const $_site = "./_site";
const $_dir = "./_dir";


/**
 * pagesMap = {
 *   dir: [
 *     { vars... },
 *     ...
 *   ],
 *   ...
 * };
 */
const pagesMap = {};

const site = {
  title: "EHzL 블로그",
  footer: {
    msg: "<div>Designed by EHzL,</div><div>Built with Deno,</div><div>Deployed on Github.</div>",
  },
};

fs.removeSync(`${$_site}`);

console.log(`==> 빌드 시작`);

/**
 * Step 1) $_page md -> html, pagesMap 오브젝트 생성
 */
{
  const mdFiles = fg.globSync(`${$_page}/**/*.md`);
  for (const f of mdFiles) {
    let vars = {
      site,
      layout: "page",
      permalink: "/page/{{ name | remove_label }}",
      filepath: `${$_site}/page/{{ name | remove_label }}.json`,
      content: "",
    };

    let {dir, name} = path.parse(f);
    dir = dir.replace($_page, "").replace(/^\//, "");
    Object.assign(vars, renderer.yaml(renderer.liquid(JSON.stringify(vars), {dir, name})));

    const {frontmatter, content} = renderer.separate(fs.readFileSync(f, "utf-8"));
    Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars).trim()));
    Object.assign(vars, {content: renderer.md(content).trim()});    // md 는 liquid 렌더링을 적용하지 않음

    pagesMap[dir] ??= [];
    pagesMap[dir].push(vars);
  }

  console.log(`==> ${mdFiles.length}개 포스팅 페이지 렌더링 완료`);
}

/**
 * Step 2) $_dir md -> html, pagesMap 오브젝트 업데이트
 */
{
  const mdFiles = fg.globSync(`${$_dir}/**/*.md`);
  for (const f of mdFiles) {
    let vars = {
      site,
      pagesMap,   // 렌더링 된 $_page md 정보
      layout: "dir",
      cat: "{{ name | remove_label }}",
      permalink: "/cat/{{ name | remove_label }}",
      filepath: `${$_site}/cat/{{ name | remove_label }}.json`,
      content: "",
    };

    let {name} = path.parse(f);
    let dir = "_dir";
    Object.assign(vars, renderer.yaml(renderer.liquid(JSON.stringify(vars), {dir, name})));

    const {frontmatter, content} = renderer.separate(fs.readFileSync(f, "utf-8"));
    Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars).trim()));
    // Object.assign(vars, {content: renderer.md(content).trim()});    // $_dir md 는 content 부분 무시

    pagesMap[dir] ??= [];
    pagesMap[dir].push(vars);
  }

  console.log(`==> ${mdFiles.length}개 카테고리 페이지 렌더링 완료`);
}

/**
 * Step 3) pagesMap 순회, layout 체이닝 사용, filepath 에 따라 각 json 파일 생성
 */
{
  for (const [dir, pages] of Object.entries(pagesMap)) {
    for (const page of pages) {
      let vars = page;

      while (vars.layout) {
        let layout = vars.layout;
        delete vars.layout;

        const {frontmatter, content} = renderer.separate(fs.readFileSync(`${$_layout}/${layout}.liquid`, "utf-8"));
        Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars).trim()));
        Object.assign(vars, {content: renderer.liquid(content, vars).trim()});
      }

      fs.outputJsonSync(vars.filepath, {content: vars.content});
    }
  }

  console.log("==> 각 렌더링 결과로 json 파일 생성 완료");
}

/**
 * Step 4) Index.html (깃허브 페이지 배포 위한 404.html 포함), Sitemap 생성
 */
{
  let vars = {
    site,
    pagesMap,   // 렌더링 된 $_page, $_dir md 정보
    layout: "base",
    permalink: "/",
    filepath: `${$_site}/index.html`,
    filepath_404: `${$_site}/404.html`,
    content: "",
  };

  // Index.html 과 sitemap.xml 은 layout 체이닝을 사용하지 않고 생성
  const {frontmatter, content} = renderer.separate(fs.readFileSync(`${$_layout}/${vars.layout}.liquid`, "utf-8"));
  Object.assign(vars, renderer.yaml(renderer.liquid(frontmatter, vars).trim()));
  Object.assign(vars, {content: renderer.liquid(content, vars).trim()});

  fs.outputFileSync(vars.filepath, vars.content);

  // 404.html 생성
  fs.copySync(vars.filepath, vars.filepath_404);

  // sitemap.xml 생성
  Object.assign(vars, {layout: "sitemap", content: "", filepath: `${$_site}/sitemap.xml`});
  fs.outputFileSync(vars.filepath, vars.content);

  console.log("==> 블로그 외형 html 파일 및 사이트맵 생성 완료");
}

/**
 * Step 5) $_asset 파일 복사 (sass 변환 포함)
 */
{
  fs.ensureFileSync(`${$_asset}/main.scss`);
  const css = sass.compile(`${$_asset}/main.scss`, {style: "compressed"});
  fs.outputFileSync(`${$_site}/main.css`, css.css);

  fs.copySync(`${$_asset}`, `${$_site}`, {filter: (src, _) => !src.includes("main.scss")});

  console.log("==> 기타 파일들 생성 완료, 빌드 종료");
}
