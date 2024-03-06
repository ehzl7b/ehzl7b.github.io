// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
  
export default defineConfig({
  preflights: [
    // {
    //   getCSS: ({ theme }) => '',
    // },
    // {
    //   getCSS: ({ theme }) => fs.readFileSync('./node_modules/@unocss/reset/eric-meyer.css', 'utf-8'),
    // },
  ],
  content: {
    // filesystem: [
    //   './_layouts/**/*.html',
    // ]
  },
  shortcuts: [
    // ...
  ],
  theme: {
    // colors: {
    //   // ...
    // },
    fontFamily: {
      // sans: 'Hack,NanumSquareNeo,NeoDunggeunmo,monospace',//'-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
      // mono: 'Hack,NanumSquareNeo,NeoDunggeunmo,monospace',//'ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace',
      sans: 'NanumGothicCoding,monospace',
      mono: 'NanumGothicCoding,monospace',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        // ...
      },
      cdn: 'https://esm.sh/'
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})