import pug from 'pug'
import fs from 'fs-extra'
import fg from 'fast-glob'
import path from 'node:path'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import postcss from 'postcss'
import postcss_nested from 'postcss-nested'
import unocss from '@unocss/postcss'
import cssnano from 'cssnano'

// 글로벌 변수 초기화
$root = '.'

// _pages 디렉토리 안의 md 파일(페이지)들 빌드
// md -> html -> json
console.log("===> Building Start")
build_count = 0

let mdfiles = fg.globSync($root + '/_pages/**/*.md')
for (let mdfile of mdfiles) {
  const parsed = path.parse(mdfile)
  const ver = (parsed.name.match(/^\[\S*\]/g) || [])[0]

  // md 파일명에 "ver"를 확인할 수 있는 경우만 빌드
  if (ver) {
    const name = parsed.name.replace(ver, '')
    const cat = parsed.dir.split('/_pages')[1]
    const jsonfile = $root + ((cat === '' || cat === '/') ? '/_site/pages/' : '/_site/pages/post/') + name + '.json'
    const pathname = (((cat === '' || cat === '/') ? '/' : '/post/') + name).replace('/index', '/')

    // json 빌드
    const { content, data } = matter.read(mdfile, {})
    const render = pug.compileFile($root + '/_layouts/page.pug')
    fs.outputJSONSync(jsonfile, { name, ver, cat, pathname, ...data, content: render({content: parse_md.render(content), ...data}) }, 'utf-8')
    build_count += 1
  }
}

// 네비게이션 빌드
const yamlfile = fg.globSync($root + '/_pages/**/*.{yaml,yml}')[0]
const navmenu = yaml.load(fs.readFileSync(yamlfile, 'utf8'))
for (let [sup, sub] of Object.entries(navmenu)) {
  const render = pug.compileFile($root + '/_layouts/nav.pug')
  const pathname = '/' + sup.toLocaleLowerCase()
  const jsonfile = $root + '/_site/pages' + pathname + '.json'
  fs.outputJSONSync(jsonfile, {pathname, title: sup.toLocaleLowerCase() + ' 카테고리', content: render({pages: [...pageinfos_new.values()], cats: sub})}, 'utf-8')
  build_count += 1
}

// assets 복사
fs.copySync($root + '/_assets', $root + '/_site/_assets', {
  filter: (from, to) => {
    return !from.includes('main.css')
  }
})

// CSS 빌드
postcss([ postcss_nested, unocss, cssnano ]).process(
  fs.readFileSync($root + '/_assets/main.css', 'utf-8'), {
    from: $root + '/_assets/main.css',
    to: $root + '/_site/_assets/main.css',
  }
).then(css => {
  fs.outputFileSync(css.opts.to, css.css)
})

