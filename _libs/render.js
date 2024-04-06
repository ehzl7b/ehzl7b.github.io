import pug from 'pug'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import path from 'path'

// hljs 초기화
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
        begin: /[\/|\\▲▶▼◀+-∧>∨<]+/,
      },
    ],
  }
})

// markdown-it 초기화
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

// render function
export default function render(file, args={}) {
  let {content, data} = matter.read(file)
  Object.assign(args, data)
  
  let {ext} = path.parse(file)
  switch (ext) {
    case '.md':
      content = parse_md.render(content)
      break
    case '.pug':
      content = pug.compile(content)(args)
      break
  }

  if ('layout' in args) {
    let {layout, ...args_} = {...args, content}
    return render(`${process.env.PWD}/_layouts/${layout}.pug`, args_)
  } else {
    return content
  }
}
