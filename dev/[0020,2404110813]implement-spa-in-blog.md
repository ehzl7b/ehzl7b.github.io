---
layout: page
title: 블로그 SPA(Single Page Application) 구현하기
description: SPA 구현을 위해 고려해야 할 사항들과 실제 구현해본 코드 예시
updated: 2024-04-11
---

## SPA 구현

SPA에 대한 개념은 [위키피디아](https://ko.wikipedia.org/wiki/%EC%8B%B1%EA%B8%80_%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98) 문서를 살펴보면 된다.

블로그를 SPA로 만들려면 아래 이벤트에 대한 페이지 로딩 처리가 필요하다.

- note
> - 주소를 직접 입력했을 때
> - 브라우저 전/후 이동 버튼을 클릭했을 때
> - 링크 태그를 클릭했을 때

위 이벤트 구현 위한 코드를 index.html 의 script 태그 안에 삽입하면 된다.

다만, 본 블로그가 심겨진 Github Pages의 작동방식의 특성상(입력주소.html 파일을 찾고 없다면, 404.html 파일을 로드) index.html과 동일한 내용으로 404.html 파일도 만들어야 했다.

## Javascript 코드

전체적으로 페이지를 로딩하는 fetch_content 함수를 만들고, 위에서 언급한 세가지 이벤트가 발생할 때마다 fetch_content 를 호출하도록 했다.

- index.html
```js
async function fetch_content() {
  const cur_pathname = window.location.pathname    // 현재 접속한 주소 정보를 로드
  const tar_pathname = '<json_file_address>'       // cur_pathname 에 매칭되는 json 파일 주소
  let response = ''
  try {
    response = await (await fetch(tar_pathname)).json()         // 매칭 json 파일 로드
  } catch (err) {
    response = await (await fetch('/pages/404.json')).json()    // 매칭 json 파일이 없다면 404.json 로드
  }
  some_element.innerHTML = response.content        // 특정 엘리먼트(some_element) 안에 json 내용 삽입 
  document.title = '<title>태그 내용'              // 로드한 json 파일에 걸맞게 <title> 태그 내용 변경
}
```

아래는 주소를 직접 입력했을 때의 이벤트 처리 코드다.

- index.html
```js
fetch_content()
```

주소를 직접 입력하면, 서버에 의해 index.html(또는 404.html)이 처음부터 로드되므로, fetch_content 함수를 직접 실행시키면 된다.

아래는 브라우저 전/후 이동 버튼 클릭했을 때의 이벤트 처리 코드다.

- index.html
```js
window.onpopstate = e => {
  fetch_content()
}
```

popstate 이벤트에 대해서는 [MDN](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event) 문서를 살펴보자.

아래는 링크 태그를 클릭했을 때의 이벤트 처리 코드다.

- index.html
```js
document.body.onclick = async e => {
  // a 태그를 클릭이면서, 링크 주소가 본 블로그에 속한 주소이고, 주소가 # 이나 확장자가 붙은 경우(파일인 경우)가 아닐 때 SPA 작동
  if (e.target.matches('a')  && e.target.href.startsWith(window.location.origin) && !e.target.getAttribute('href').match(/[.#]/)) {
    e.preventDefault()

    // 현재의 주소와 동일한 주소가 아닐 때 SPA 작동
    if (e.target.href !== window.location.href) {
      history.pushState(null, null, e.target.href)
      await fetch_content()
    }
  }
}
```

이유는 잘 모르겠으나, a 태그에 대한 이벤트처리를 작성하면 작동하지 않았다. a 태그가 속한 부모 태그에 대한 이벤트 처리가 필요하며, 블로그 특성상 여기저기 a 태그가 널려있으므로 최상위에 속한 body 태그에 이벤트 처리 구문을 작성했다.

history 인스턴스의 pushState 메서드에 대해선 [MDN](https://developer.mozilla.org/ko/docs/Web/API/History/pushState) 문서를 참고하자.