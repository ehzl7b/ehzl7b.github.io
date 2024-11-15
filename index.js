import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
// import _ from "lodash";
import { renderer } from "./_lib/renderer.js";
import global from "./_src/vars.js";

function render(file, vars) {
  let {frontmatter, content} = renderer.separate(fs.readFileSync(file, "utf-8"));

  frontmatter = renderer.liquid(frontmatter, vars);
  Object.assign(vars, renderer.yaml(frontmatter));

  content = renderer.liquid(content, vars);
  if (path.extname(file) === "md") content = renderer.md(content);
  Object.assign(vars, {content});

  if ("layout" in vars) {
    let {layout, ...nextVars} = vars;
    return render(`${$_src}/_layout/${layout}.liquid`, nextVars);
  } else {
    vars = JSON.parse(renderer.liquid(JSON.stringify(vars), vars));
    return {vars, content};
  }
}

const $_src = "./_src";
const $page = `${$_src}/page`;
const pagesGlob = fg.globSync(`${$_src}/**/*.{md,liquid}`, {ignore: `${$_src}/_layout/**/*`});

const pagesMap = new Map();
for (let file of pagesGlob) {
  let {dir, base, name, ext} = path.parse(file.replace($_src, ""));
  let {vars, content} = render(file, {cat: dir, name, ...global});
  pagesMap.set(vars.permalink, {cat: dir, title: vars.title, content});
}

console.log(pagesMap);