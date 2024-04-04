import * as sass from 'sass'
import fs from 'fs-extra'

export default function build_assets() {
  // main.scss --> main.css
  const css = sass.compile('./_assets/main.scss', {style: 'compressed'})
  fs.outputFileSync('./_site/main.css', css.css, 'utf-8')

  // copy others
  fs.copySync('./_assets', './_site', {
    filter: (from, to) => {
      return !from.includes('main.scss')
    }
  })
}