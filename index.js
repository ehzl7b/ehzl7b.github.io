import build_pages from './_libs/build_pages.js'
import build_assets from './_libs/build_assets.js'
import fs from 'fs-extra'

switch (process.argv[2]) {
  case 'pages':
    build_pages()
    break
  case 'assets':
    build_assets()
    break
  case 'all':
    fs.removeSync('./_site')
    build_pages()
    build_assets()
    break   
}