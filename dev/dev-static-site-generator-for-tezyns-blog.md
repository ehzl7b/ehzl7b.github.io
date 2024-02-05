---
title: "Tezyns 블로그 빌더 구축"
description: Node.JS 사용하여 SPA 형태의 Tezyns 블로그를 구축한 경험을 기록
updated: 2024-02-05
---

## 블로그 빌더 콘셉트

그동안 깃허브 페이지에서 블로그를 운영하면서, 주로 사용하는 SSG 툴인 [Jekyll](https://jekyllrb-ko.github.io/) 을 사용해왔는데, 개인적인 스터디도 할 겸해서 직접 블로그 빌더를 구축해보기로 하였다.

어떤 방식으로 빌드가 되도록 할까 하다가 아래와 같이 정했다.

> - Historical SPA (Single Page Application) 방식으로 작동 (메뉴 또는 포스팅을 클릭거나 주소를 입력하면 Json 형식의 콘텐츠를 불러오도록 함)
> - 포스팅은 마크다운으로 작성하되, Github 에 올리면 자동으로 빌드(마크다운 -> Html -> Json 으로 저장) 되도록 함
> - 마크다운 파일을 `[ver]pathname.md` 형태로 저장하고, `ver` 가 변경된 파일만 빌드, `ver` 에 따라 포스팅 정렬, `pathname` 은 포스팅 주소가 되도록 함

약 두달간의 삽질 끝에 허접하게나마 만들 수 있었다. 빌드에 필요한 모든 내용을 build.js 이라는 단일 파일에 담았다.

모든 과정을 기록하기보다는 중요한 것만 추려서 아래부터 기록하였다. 실제 결과물을 모두 보고 싶다면 [깃허브 레포지토리](https://github.com/tezyns/tezyns.github.io/tree/tezyns-blog-builder-v1.0.0)를 직접 탐색해보기 바란다.

## markdown-it 커스터마이징

마크다운 파싱하기 위해 [markdown-it](https://github.com/markdown-it/markdown-it#readme) 을, 그리고 코딩 하이라이트를 위해 [highlight.js](https://highlightjs.org/) 외부 모듈을 사용하였다.

특히, 라인 하이라이팅을 넣기 위해 약간의 커스터마이징을 하였는데, 아래와 같이 코딩했다.

- ./build.js
```js
// ...

import hljs from 'highlight.js'
import markdownIt from 'markdown-it'

// ...

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

// ...
```

markdown-it 설정을 보면, 하이라이팅이 필요한 구문을 줄 단위로 끊은 뒤, 줄 단위로 순회하면서 만일 `/-`, `/+`, `/=`로 시작하는 줄이 있다면 이를 따로 기록하고 해당 문자를 삭제해 둔다.

그리고, highlight.js 로 하이라이팅 한 뒤, 다시 각 줄을 `<div class="codeline ..."></div>` 구문으로 감싼다. 앞서서 따로 기록했던 문자가 속한 줄이라면 class 에 포함시켜 나중에 라인 하이라이팅이 되도록 하면 된다.

## SPA 구현 코드

Historical SPA 로 웹페이지가 동작하려면, 아래 기능이 모두 구현되어야 한다.

> - `<a>` 태그를 클릭했을 때, 링크 주소로 웹페이지를 연결하는 것이 아니라, 링크 주소와 관련된 json 파일 로드하여 화면에 띄움
> - 주소를 직접 입력했을 때, 링크 주소와 관련된 json 파일 로드하여 화면에 띄움
> - 웹페이지 앞, 뒤가기 버튼을 클릭했을 때, 주소가 바뀌면서 해당 주소와 관련된 json 파일을 로드하여 화면에 띄움

템플릿 엔진으로 [pug](https://pugjs.org/api/getting-started.html) 를 사용하였는데, 그 안에 javascript 를 아래와 같이 직접 구현했다.

- ./_layouts/base.pug
```js
// ...
const $scroller = document.querySelector('#scroller')
const $main = document.querySelector('main')
async function fetch_content() {
  const cur_pathname = window.location.pathname
  const tar_pathname = '/pages/' + cur_pathname.slice(1) + (cur_pathname === '/' ? 'index.json' : '.json')
  let response = ''
  try {
    response = await (await fetch(tar_pathname)).json()
  } catch (err) {
    response = await (await fetch('/pages/404.json')).json()
  }
  $main.innerHTML = response.content
  document.title = response.title + `::#{site.title}`
}
// 주소 직접 입력
fetch_content()
// <a> 태그 클릭
document.body.onclick = async e => {
  if (e.target.matches('a') && e.target.href.startsWith(window.location.origin) && !e.target.getAttribute('href').match(/[.#]/)) {
    e.preventDefault()
    if (e.target.href !== window.location.href) {
      history.pushState(null, null, e.target.href)
      await fetch_content()
      $scroller.scrollTo({ top: 0 })
    }
  }
}
// 전,후 이동 버튼 클릭
window.onpopstate = e => {
  fetch_content()
}
```

눈여겨봐야할 것은, json 파일을 로드하는 `fetch_content` 함수와, `<a>` 태그를 클릭했을 때 이벤트 처리하는 `document.body.onclick` 함수다.

클릭 이벤트 처리를 `<a>` 태그가 아닌, `<body>` 태그로 하면서 실제 타겟이 `<a>` 태그에서 이뤄졌는지를 체크해야, `preventDefault` 함수가 먹혔다. (이유는 잘 모르겠다.)

## 다크 모드 구현 코드

- ./_layouts/base.pug
```js
$root = document.querySelector('html')
$switch_theme_input = document.querySelector('#switch-theme input')

function set_theme(theme) {
  $root.dataset.theme = theme
  window.sessionStorage.setItem('theme', theme)
}

let cur_theme = window.sessionStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches  ? 'dark' : 'light')
if (cur_theme === 'dark') {
  $switch_theme_input.checked = true
  set_theme('dark')
}
$switch_theme_input.onclick = function(e) {
  set_theme((e.target.checked) ? 'dark' : 'light')
}
```

먼저 `cur_theme` 변수를 통해 사용자가 임의로 선택한 

id 가 `switch-theme` 인 태그 아래에 있는 `<input>` 태그를 클릭할 때마다 테마가 전환되도록 하는 것이 기본이다. 전환이 되면 스타일이 모두 바껴야한다. css 파일에 다크 테마 용도의 스타일을 미리 설정해두고, 테마가 전환되면 해당 스타일을 사용토록 하는 방식으로 하기로 했다.

클릭 이벤트 발생할 때마다 테마를 전환하는 `set_theme` 함수를 호출하도록 했다. `set_theme` 함수를 보면 다크 테마로 변경될 경우, `<html>` 최상위 태그를 가리키는 `$root` 함수를 통해 `dark` class 를 붙이도록 했다. 즉, `dark` 라고 명명될 경우 다크 테마 css 를 적용토록 하면 된다.