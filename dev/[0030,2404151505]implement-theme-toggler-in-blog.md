---
layout: page
title: 블로그 다크 테마 및 토글 스위치 구현하기
description: 시스템 설정에 맞춰, Light 또는 Dark 테마를 자동으로 선택하고, 선택한 테마에 따라 쉽게 CSS 변환하는 방법
updated: 2024-04-15
---

## 블로그에 테마 적용

쉽게 말해 Light 또는 Dark 테마를 아래 규칙에 따라 적용되도록 만드는 방법이다.

- note
> - 방문자 첫 블로그 접속 시, 시스템 설정에 따라 Light 또는 Dark 테마를 보여줌
> - 방문자의 선택에 따라 테마 변경 가능
> - 다른 페이지 이동 또는 다른 웹사이트를 들렀다가 재방문 했을 때 최근 선택했던 테마로 다시 보여줌

고려해야 할 것은 아래와 같았다.

- note
> - Light 및 Dark 테마에 필요한 CSS
> - 테마 전환 스위치를 구현한 HTML
> - 시스템 테마 확인, 스위치 클릭 시 테마 전환, 선택한 테마를 기억하는 모듈을 구현한 Javascript

## 테마별 CSS

HTML 최상위 태그에 적용할 테마를 기록하고, CSS변수로 해당 테마에 따라 각각 테마가 적용되도록 하는 것이 간편했다.

- index.html
```html
<html data-theme="light">
  <!-- 생략 -->
  <h1>블로그</h1>
  <!-- 생략 -->
</html>
```

- main.scss
```scss
:root {
  --fg: #fff;
  &[data-theme="dark"] {
    --fg: #000;
  }
}

h1 {
  color: var(--fg);
}
```

태그 전경색 등을 CSS변수로 설정하고, CSS변수를 `:root` 안에서 테마에 따라 설정하는 방식이다. 나중에 테마를 변경하거나 추가할 때, `:root` 내용만 건들면 되므로 편할 것 같다.

## 전환스위치 HTML

- index.html
```html
<label class="theme-btn">
  <div>LIGHT</div>
  <div>
    <input type="checkbox">
    <div class="theme-switch"></div>
  <div>
  <div>DARK</div>
</label>
```

스위치 역할은 체크박스 타입의 input 태그가 담당한다.

- main.scss
```scss
label {
  // 생략
  input {
    height: 0; width: 0; opacity: 0;
    &:checked+div {
      // 스위치 클릭되었을 때(checked)의 속성
    }
  }
  .theme-switch {
    // 스위치 클릭되지 않았을 때(unchecked)의 속성
    // 스위치 클릭여부에 관계없는 공통 속성
  }
  // 생략
}
```

CSS로 input 태그를 안보이게 설정하고, input 태그가 클릭(즉, 체크박스가 checked) 되었을 때와 아닐때를 설정해주면 된다.

개인적으로는 좌우 형태의 전환 스위치 모양으로 표현하고, `.theme-switch`의 left 속성을 달리하는 식으로 구현하고는 했다.

## 테마 관련 모둘 Javascript

먼저 주요 변수와 테마를 전환하는 set_theme 함수를 구현한다.

- index.html
```js
// index.html 의 script 태그 안에 작성
const $root = document.querySelector('html');
const $theme_btn_input = document.querySelector('.theme-btn input');

function set_theme(theme) {
  $root.dataset.theme = theme
  window.sessionStorage.setItem('theme', theme)
}
```

방문자가 선택한 테마를 기억하기 위해 sessionStorage 를 사용했다. 이에 대해선 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/sessionStorage)를 참고하자. 사실 localStorage 도 사용할 수 있는데 이에 대해서도 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)를 참고하자.

다음으로 사이트가 로딩될 때의 코드가 필요하다.

- index.html
```js
// 위 코드에 이어서 작성
let cur_theme = window.sessionStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches  ? 'dark' : 'light');
if (cur_theme === 'dark') {
  $theme_btn_input.checked = true;
  set_theme('dark');
}

$theme_btn_input.onclick = e => {
  set_theme((e.target.checked) ? 'dark' : 'light');
}
```

먼저 방문자가 선택한 테마가 있는지 확인하고, 없다면 시스템 테마를 `cur_theme` 변수로 가져온다. 가져온 테마가 `dark` 라면 Dark 테마로 전환해준다.

마지막은 스위치 클릭에 대한 이벤트 처리다.