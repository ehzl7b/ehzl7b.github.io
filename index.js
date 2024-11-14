import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
import { renderer } from "./_lib/renderer.js";


const $_src = "./_src";
const $page = `${$_src}/page`;
const pagesGlob = fg.globSync(`${$_src}/**/*.{md,liquid}`, {ignore: `${$_src}/_layout/**/*`});

const pagesMap = new Map();
for (let x of pagesGlob) {
  let {dir, base, ext, name} = path.parse(x.replace($_src, ""));
  let content = fs.readFileSync(x, "utf-8");

  console.log(content);
}