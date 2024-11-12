import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import yaml from "js-yaml";
import pug from "pug";

// pseudo 언어 생성
hljs.registerLanguage("pseudo", (hljs) => {
  return {
    aliases: ["ps"],
    contains: [
      {
        className: "comment",
        begin: /#/,
        end: /\n|$/,
      },
      {
        className: "leadline",
        begin: /[|/\\=+<>∧∨-]+/,
      },
    ],
  };
});

// 초기화
const md = MarkdownIt({
  html: true,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    const t = new Map();

    code = code.trim().split("\n").map((x, i) => {
      if (x.endsWith("/+") || x.endsWith("/-") || x.endsWith("/=")) {
        t.set(i, x[x.length-1]);
        x = x.slice(0, -2);
      }
      return x;
    }).join("\n");

    code = hljs.highlight(code, {language}).value.trim().split("\n").map((x, i) => {
      return `<span class="line ${t.get(i) ?? ""}">${x}</span>`;
    }).join("\n");

    return code;
  },
});

/**
 * MD to HTML
 * @param { string } mdString 마크다운 형식의 스트링
 * @returns { string } HTML 형식의 스트링 리턴 
 */
export function mdToHtml(mdString) {
  let html = md.render(mdString);

  return html;
}

/**
 * PUG to HTML
 * @param { string } pugString 퍼그 형식의 스트링
 * @param { object } vars 퍼그 렌더링 할 때의 변수
 * @returns { string } HTML 형식의 스트링 리턴
 */
export function pugToHtml(pugString, vars) {
  let html = pug.compile(pugString)(vars);

  return html;
}

/**
 * 스트링에서 FRONTMATTER 분리
 * @param { string } content 스트링 원본
 * @returns { object } {frontmatter: object, content: string} 리턴 
 */
export function getFrontmatter(content) {
  let frontmatter = {};
  if (content.startsWith("---")) {
    let t = content.indexOf("---", 3);
    if (t !== -1) {
      frontmatter = yaml.load(content.slice(3, t).trim());
      content = content.slice(t + 3).trim();
    }
  }

  return {frontmatter, content};
}