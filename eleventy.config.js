import pugPlugin from "@11ty/eleventy-plugin-pug";
import markdownIt from "markdown-it";
import hljs from "highlight.js";

export default async function(eleventyConfig) {
  eleventyConfig.addPlugin(pugPlugin);
	eleventyConfig.setInputDirectory("_src");
  eleventyConfig.addPassthroughCopy({ "_assets": "/" });
  eleventyConfig.setLibrary("md", markdownIt({
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
  }));
};

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

