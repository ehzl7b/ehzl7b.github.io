import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
import yaml from "js-yaml"
import { Liquid } from "liquidjs"

const engine = new Liquid()
engine.registerFilter("remove_label", (x) => x.replace(/\[.*\]/, ""))
engine.registerFilter("today", (_) => (new Date()).toISOString().split("T")[0])

const md = new MarkdownIt({
  xhtmlOut: true,
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : "plaintext"

    const h = new Map()
    code = code.trim().split("\n").map((x, i) => {
      if (x.match(/\s*\/[+=-]$/)) {
        h.set(i, x.at(-1))
        return x.replace(/\s*\/[+=-]$/, "")
      } else {
        return x
      }
    }).join("\n")

    // pre 태그에서는 liquid 가 파싱안하도록 함 (있을지 모르는 더블 중괄호로 인한 에러 방지)
    return "{% raw %}" + hljs.highlight(code, {language}).value.split("\n").map((x, i) => {
      return `<span class="line ${h.has(i) ? h.get(i) : ""}">${x}</span>`
    }).join("\n") + "{% endraw %}"
  },
})

export const renderer = {
  md: (str: string) => md.render(str),
  yaml: (str: string) => yaml.load(str),
  liquid: (str: string, obj: object) => engine.parseAndRenderSync(str, obj),
  separate: (str: string) => {
    let frontmatter = ""
    let content = str

    if (str.startsWith("---")) {
      const t = str.indexOf("---", 3)
      if (t !== -1) {
        frontmatter = str.slice(3, t).trim()
        content = str.slice(3 + t).trim()
      }
    }

    return {frontmatter, content}
  },
}