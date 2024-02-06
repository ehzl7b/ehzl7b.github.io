---
title: "Tezyns 블로그 빌더 구축"
description: Node.JS 사용하여 SPA 형태의 Tezyns 블로그를 구축해주는 빌더의 주요 내용 소개
updated: 2024-02-06
---

## 블로그 빌더 콘셉트

그동안 깃허브 페이지에서 블로그를 운영하면서, 주로 사용하는 SSG 툴인 [Jekyll](https://jekyllrb-ko.github.io/) 을 사용해왔는데, 개인적인 스터디도 할 겸해서 직접 블로그 빌더를 구축해보기로 하였다.

어떤 방식으로 빌드가 되도록 할까 하다가 아래와 같이 정했다.

> - Historical SPA (Single Page Application) 방식으로 작동 (메뉴 또는 포스팅을 클릭거나 주소를 입력하면 Json 형식의 콘텐츠를 불러오도록 함)
> - 포스팅은 마크다운으로 작성하되, Github 에 올리면 자동으로 빌드(마크다운 -> html -> json 으로 저장) 되도록 함
> - 마크다운 파일을 `[ver]pathname.md` 형태로 저장하고, `ver` 가 변경된 파일만 빌드, `ver` 에 따라 포스팅 정렬, `pathname` 은 포스팅 주소가 되도록 함

약 두달간의 삽질 끝에 허접하게나마 만들 수 있었다. 빌드에 필요한 모든 내용을 build.js 이라는 단일 파일에 담았다.

모든 과정을 기록하기보다는 중요한 것만 추려서 아래부터 기록하였다. 실제 결과물을 모두 보고 싶다면 [깃허브 레포지토리](https://github.com/tezyns/tezyns.github.io/tree/tezyns-blog-builder-v1.0.1)를 직접 탐색해보기 바란다.

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

아래는 라인 하이라이팅이 적용된 예시다. [Leetcode 1번 문제](https://leetcode.com/problems/two-sum/description/) 풀이를 가져와서 표현해봤다.

- python
```python
def twoSum(self, nums: List[int], target: int) -> List[int]:
/-  for i, x in enumerate(nums):
/+  for i, x in enumerate(nums[:-1]):
/-    for j, y in enumerate(nums):
/+    for j, y in enumerate(nums[i+1:], i+1):
      if x+y == target:
        return i, j
```

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

먼저 `cur_theme` 변수를 통해, 사용자가 임의로 선택한 테마를 먼저 가져오고, 없다면 시스템의 테마를 가져온다.

id 가 `switch-theme` 인 태그 안에 있는 `<input>` 태그를 클릭할 때마다 `set_theme` 함수를 거쳐 테마가 전환되도록 하였다. 선택한 테마는 최상위 `<html>` 태그에 `data-theme` 어트리뷰트에 반영된다.

아래와 같이 변수를 사용하여 css 설정을 하면, 테마에 따른 색상 적용도 편리하게 할 수 있다.

- css
```css
:root {
  --fg: #000; --bg: #fff;
}
:root[data-theme="dark"] {
  --fg: #fff; --bg: #000;
}

/* ... */

body {
  color: var(--fg); background-color: var(--bg);
}
```

테마에 따라 색상을 조정하고 싶으면 `:root` 안의 내용만 수정하면 된다.

## Github Actions 이용하여 자동 빌드

블로그가 배포될 레포지토리의 `main` 브랜치에는 마크다운을, `gh-pages` 브랜치에는 빌드와 관련된 코드를 두었다. 그리고 Github Pages 설정에서 `gh-pages` 브랜치의 `docs` 디렉토리 내용대로 배포되도록 했다.

`main` 브랜치에 아래와 같은 Github Actions 를 설정하여, `main` 브랜치에 뭔가의 내용이 푸시가 되면, 빌드가 되도록 하였다.

- ./.github/workflows/deploy_pages.yml
```yaml
ame: Tezyns Deployment Pages
on:
  push:
    branches: ["main"]
permissions:
  contents: write
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: checkout build library in main branch
        uses: actions/checkout@v4
        with:
          ref: gh-pages
          path: '.'
      - name: delete old pages
        run: rm -rf _pages
      - name: checkout build library in main branch
        uses: actions/checkout@v4
        with:
          ref: main
          path: './_pages'
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: node build pages
      - name: Check if there are any changes
        id: verify_diff
        run: git diff --quiet . || echo "changed=true" >> $GITHUB_OUTPUT
      - name: Update Repo
        if: steps.verify_diff.outputs.changed == 'true'
        run: |
          git config --global user.name "tezyns"
          git config --global user.email "tezyns@outlook.com"
          git add .
          git commit -m "deployment"
          git push
```

Github Actions 는 워낙 많이 사용되기에 구글링에서 조금만 검색해도 원하는 기능을 구현하려면 어떻게 코딩해야하는지 쉽게 찾을 수 있었다.