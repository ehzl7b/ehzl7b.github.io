---
title: "About..."
description: "블로그 대문 페이지"
updated: "2024-12-21"
---

## 블로그 리부트...

2025년을 앞두고 블로그를 리뉴얼 했다. 그리고 포스팅들도 새롭게 채울 생각이다. 아예 리부트하는 셈이다.

허접하지만 [Deno](https://deno.com/) 를 사용하여, [SPA](https://ko.wikipedia.org/wiki/%EC%8B%B1%EA%B8%80_%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98) 로 작동하는 사이트를 제작하는 빌더를 만들어서 블로그를 구축했다.

## About 어즐

어즐이는 40대 게이른 배불뚝이 아재... 모 그룹 기획부서에서 일하고 있다. 제법 잘 버티는중(?) 이라 생각한다. 목표는 정년!

## About 블로그

개인 관심사를 모아놓은 블로그, 본 블로그 윗 상단에 있는 네비게이션을 보면 알 수 있다.

개인적인 목적이 우선인 블로그라, 본 블로그를 방문하는 이들 입장에서는 매우 불친절한 블로그일 것이다. 또한 공지나 아무런 예고도 없이 글이 수정되거나 삭제되기도 하며, 때로는 블로그가 폭파될 수도 있다. 아무쪼록 양해를 부탁하는 바이다.

이제 블로그를 다시 시작해본다.

- welcome.js
```js
function welcome(name) {
  console.log(`안녕? ${name}, 이제 블로그를 시작해볼게`); /-
  console.log(`안녕하세요 ${name}님, 이제 블로그를 시작합니다.`); /+
}
```