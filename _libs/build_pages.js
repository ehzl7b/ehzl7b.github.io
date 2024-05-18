import fs from 'fs-extra'
import fg from 'fast-glob'
import yaml from 'js-yaml'
import path from 'path'
import render from './render.js'


/**
 * pages 빌드
 * 
 * markdown 에 ver(파일명의 대괄호 부분, 정렬 또는 update 판단 용도) 달려있는 경우만 빌드할지 결정
 *   - old page 목록에 없거나(created), old page 목록의 ver 가 달라진 경우(updated) markdown -> html -> json 빌드
 *   - old page 목록에는 있는데 new page 목록에는 없는 경우(removed) json 삭제
 * 
 * 가장 먼저 검색되는 yaml || yml 파일 내용을 읽어서 네비게이션 json 빌드
 * 
 * index.html, 404.html 빌드
 * 
 * sitemap.xml 빌드
 */
export default function build_pages() {
  let build_count = 0

  // pageinfos 로딩 --> pageinfos_old 맵개체에 저장
  let pageinfos = (() => {
    try {
      return fs.readJSONSync(`${process.env.PWD}/_site/pageinfos.json`)
    } catch (e) {
      return []
    }
  })()
  let pageinfos_old = new Map(pageinfos.map(info => [info.name, info]))

  // markdown --> html --> json 빌드
  let pageinfos_new = new Map()
  let mdfiles = fg.globSync(`${process.env.PWD}/_pages/**/*.md`)
  for (let mdfile of mdfiles) {
    let parsed = path.parse(mdfile)
    let ver = (parsed.name.match(/^\[\S*\]/g) || [])[0]

    // ver 있는 경우만,
    if (ver) {
      let name = parsed.name.replace(ver, '')

      // created 또는 updated 된 경우만,
      if (!pageinfos_old.has(name) || pageinfos_old.get(name).ver !== ver) {
        let cat = parsed.dir.split('/_pages')[1]
        let jsonfile = process.env.PWD + ((cat === '' || cat === '/') ? '/_site/pages/' : '/_site/pages/post/') + name + '.json'
        let pathname = (((cat === '' || cat === '/') ? '/' : '/post/') + name).replace('/index', '/')
        let {content, args} = render(mdfile)
        fs.outputJSONSync(jsonfile, {name, ver, cat, pathname, ...args, content}, 'utf-8')
        pageinfos_new.set(name, {name, ver, cat, pathname, mdfile, jsonfile, ...args})

        build_count += 1
      } else {
        pageinfos_new.set(name, pageinfos_old.get(name))
      }
    }
  }
  console.log(`===> ${build_count} file(s) generated`)

  // new page 목록에 없는 json 삭제
  for (let [name, info] of pageinfos_old) {
    if (!pageinfos_new.has(name)) {
      try {
        fs.unlinkSync(info.jsonfile)
      } catch(e) {
        console.log('pageinfos.json 파일이 뭔가 잘못된 것 같습니다. node index all 명령어를 실행하세요.')
        process.exit(1)
      }
    }
  }

  // 네비게이션 json 빌드
  let pages = [...pageinfos_new.values()]
  let yamlfile = fg.globSync(`${process.env.PWD}/_pages/**/*.{yaml,yml}`)[0]
  let menus = yaml.load(fs.readFileSync(yamlfile, 'utf8'))
  for (let x of menus) {
    let pathname = `/${x.id}`
    let title = x.title
    let jsonfile = `${process.env.PWD}/_site/pages/${x.id}.json`
    let description = `${x.title} 관련 포스팅들`
    let updated = new Date().toISOString().split('T')[0]

    let {content, args} = render(`${process.env.PWD}/_layouts/nav.pug`, {cat: x, title, description, updated, pathname, pages})
    fs.outputJSONSync(jsonfile, {...args, content}, 'utf-8')
  }
  console.log('===> navigation page(s) is(are) generated')

  // index.html, 404.html 빌드
  {
    let {content, args} = render(`${process.env.PWD}/_layouts/default.pug`, {menus})
    fs.outputFileSync(`${process.env.PWD}/_site/index.html`, content, 'utf-8')
    fs.copyFileSync(`${process.env.PWD}/_site/index.html`, `${process.env.PWD}/_site/404.html`)
  }
  console.log('===> index.html is generated')

  // sitemap.xml 빌드
  {
    let {content, args} = render(`${process.env.PWD}/_layouts/sitemap.pug`, {pages})
    fs.outputFileSync(`${process.env.PWD}/_site/sitemap.xml`, content, 'utf-8')
  }
  console.log('===> sitemap.xml is generated')

  // new page 목록 저장
  fs.outputJsonSync(`${process.env.PWD}/_site/pageinfos.json`, pages)
}