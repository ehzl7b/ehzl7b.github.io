import markdownIt from "markdown-it";
import hljs from "highlight.js";
import { Liquid } from "liquidjs";
import yaml from "js-yaml";

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

const md = markdownIt({
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

const engine = new Liquid();
engine.registerFilter("remove_label", x => x.replace(/\[.*\]/, ""));

// export
export const renderer = {
  md: (code) => md.render(code),
  liquid: (code, attr) => engine.parseAndRenderSync(code, attr),
  yaml: (code) => yaml.load(code),
  separate: (code) => {
    let r = {frontmatter: "", content: code};

    if (code.startsWith("---")) {
      let t = code.indexOf("---", 3);
      if (t !== -1) {
        r.frontmatter = code.slice(3, t).trim();
        r.content = code.slice(t + 3).trim();
      }
    }

    return r;
  },
};
