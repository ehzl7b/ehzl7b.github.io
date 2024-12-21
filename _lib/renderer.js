import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import yaml from "js-yaml";
import { Liquid } from "liquidjs";

const engine = new Liquid();
engine.registerFilter("remove_label", (x) => x.replace(/\[.*\]/, ""));
engine.registerFilter("today", (_) => (new Date()).toISOString().split("T")[0]);

const md = new MarkdownIt({
  xhtmlOut: true,
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";

    const h = new Map();
    code = code.trim().split("\n").map((x, i) => {
      if (x.match(/\s*\/[+=-]$/)) {
        h.set(i, x.at(-1));
        return x.replace(/\s*\/[+=-]$/, "");
      } else {
        return x;
      }
    }).join("\n");

    return code;
  },
});

export const renderer = {
  md: (str) => md.render(str),
  yaml: (str) => yaml.load(str),
  liquid: (str, obj) => engine.parseAndRenderSync(str, obj),
  separate: (str) => {
    let frontmatter = "";
    let content = str;

    if (str.startsWith("---")) {
      const t = str.indexOf("---", 3);
      if (t !== -1) {
        frontmatter = str.slice(3, t).trim();
        content = str.slice(3 + t).trim();
      }
    }

    return {frontmatter, content};
  },
};