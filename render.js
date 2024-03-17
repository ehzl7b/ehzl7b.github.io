import pug from 'pug'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import yaml from 'js-yaml'

// 초기화
hljs.registerLanguage('pseudo', function(hljs) {
  return {
    aliases: ['ps'],
    contains: [
      {
        className: 'comment',
        begin: /#/,
        end: /\s\s|\n|$/,
      },
      {
        className: 'strong',
        begin: /\b[A-Z][A-Z0-9]*\b/,
      },
      {
        className: 'number',
        begin: /\b[0-9]+\b/,
      },
      {
        className: 'leadline',
        begin: /[\/|\\▲▶▼◀+-Ʌ>Ṿ<]+/,
      },
    ],
  }
})
const parse_md = markdownIt({
  html: true,
  xhtmlOut: true,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'

    let lines = code.trim().split('\n')
    let tar_line = new Map()
    let code_modified = lines.map((x, i) => {
      if (x.startsWith('/-') || x.startsWith('/+') || x.startsWith('/=')) {
        tar_line.set(i, x[1])
        x = x.slice(2)
      }
      return x
    }).join('\n')

    lines = hljs.highlight(code_modified, { language }).value.trim().split('\n')
    return lines.map((x, i) => {
      return `<div class="codeline ${tar_line.get(i) || ''}">${x || ' '}</div>`
    }).join('')
  },
})

export function render(mdfile, layoutfile) {
  const {content, data} = matter.read(mdfile, {
    engines: { yaml: s => yaml.load(s, { schema: yaml.JSON_SCHEMA }) }
  })
  const render = pug.compileFile(layoutfile)
  return parse_md.render(content)
}