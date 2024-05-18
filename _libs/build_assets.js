import * as sass from 'sass'
import fs from 'fs-extra'

export default function build_assets() {
  // main.scss --> main.css
  const css = sass.compile(`${process.env.PWD}/_assets/main.scss`, {style: 'compressed'})
  fs.outputFileSync(`${process.env.PWD}/_site/main.css`, css.css, 'utf-8')

  // copy others
  fs.copySync(`${process.env.PWD}/_assets`, `${process.env.PWD}/_site`, {
    filter: (from, to) => {
      return !from.includes('main.scss')
    }
  })
}