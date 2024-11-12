import { mdToHtml, pugToHtml, getFrontmatter } from "./_lib/util.js";
import fs from "fs-extra";
import _ from "lodash";
import vars from "./_layout/vars.js";
import path from "node:path";

const $root = process.env.PWD;

// test
/**
 * 파일명을 넘기면, html로 출력
 * @param { string } file 마크다운 또는 pug 템플릿
 * @param { object } vars 템플릿에 넘길 초기 변수들
 * @returns { object } vars 오프젝트에 이것저것 채워서 리턴
 */
function render(file, vars) {
  let f = path.parse(file);
  let t = getFrontmatter(fs.readFileSync(file, "utf-8"));
  
  Object.assign(vars.page, _.omit(t.getFrontmatter, ["layout"]));
  vars.content = t.content;
  let layout = t.getFrontmatter.layout;

  if (f.ext === "md") {

  } else if (f.ext === "pug") {

  }

  if (layout) {
    render(`${$root}/_layout/${layout}.pug`, vars);
  } else {
    return vars;
  }
}




// let page = {};

// let x = getFrontmatter(fs.readFileSync(`${$root}/_md/index.md`, "utf-8"));
// Object.assign(frontmatter.page, _.omit(x.frontmatter, ["layout"]));
// layout = x.frontmatter.layout;
// content = mdToHtml(x.content);


// let y = getFrontmatter(fs.readFileSync(`${$root}/_layout/${layout}.pug`, "utf-8"));
// Object.assign(frontmatter.page, _.omit(y.frontmatter, ["layout"]));
// layout = y.frontmatter.layout;
// content = pugToHtml(y.content, frontmatter);

// console.log(content);