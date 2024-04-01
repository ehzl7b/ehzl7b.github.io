import { defineConfig } from 'astro/config'
// import UnoCSS from 'unocss/astro'
import hljs from 'highlight.js'
import { visit } from 'unist-util-visit'
import yaml from '@rollup/plugin-yaml'

export default defineConfig({
  integrations: [
    UnoCSS({
      // injectReset: true // or a path to the reset file
    }),
  ],
  publicDir: './_assets',
  outDir: './_site',
  build: {
    inlineStylesheets: 'never',
    format: 'preserve',
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkHighlightjs],
  },
  vite: {
    plugins: [yaml()],
  },
})

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
        begin: /[\/|\\∧>∨<↑→↓←+-]+/,
      },
    ],
  }
})

function remarkHighlightjs() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      let { lang, value } = node
      let language = hljs.getLanguage(lang) ? lang : 'plaintext'

      let lines = value.trim().split('\n')
      let tar_line = new Map()
      let code_modified = lines.map((x, i) => {
        if (x.startsWith('/-') || x.startsWith('/+') || x.startsWith('/=')) {
          tar_line.set(i, x[1])
          x = x.slice(2)
        }
        return x
      }).join('\n')

      lines = hljs.highlight(code_modified, { language }).value.trim().split('\n')
      node.type = 'html'
      node.value = `<pre><code class="hljs language-${ language }">`
      node.value += lines.map((x, i) => {
        return `<div class="line ${tar_line.get(i) || ''}">${x || ' '}</div>`
      }).join('')
      node.value += `</code></pre>`
    })
  }
}