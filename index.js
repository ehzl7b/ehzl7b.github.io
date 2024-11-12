import { mdToHtml, pugToHtml, getFrontmatter } from "./_lib/util.js";
import fs from "fs-extra";
import _ from "lodash";

const $root = process.env.PWD;

// test
let frontmatter = {
  site: {
    title: "어즐",
    cats: [
      {path: "#", title: "💡MS오피스 팁"},
      {path: "#", title: "💻개발 일기"},
    ],
  },
  page: {},
};
let layout = "";
let content = "";

let page = {};

let x = getFrontmatter(fs.readFileSync(`${$root}/_md/index.md`, "utf-8"));
Object.assign(frontmatter.page, _.omit(x.frontmatter, ["layout"]));
layout = x.frontmatter.layout;
content = mdToHtml(x.content);


let y = getFrontmatter(fs.readFileSync(`${$root}/_layout/${layout}.pug`, "utf-8"));
Object.assign(frontmatter.page, _.omit(y.frontmatter, ["layout"]));
layout = y.frontmatter.layout;
content = pugToHtml(y.content, frontmatter);

console.log(content);