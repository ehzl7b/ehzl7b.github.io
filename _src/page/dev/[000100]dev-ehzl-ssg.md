---
layout: "page"
title: "어즐 SSG(Static Site Generator) 개발 기록"
description: "Nodejs 및 다양한 모듈을 사용하여, 간단한 SSG 를 만들어 본 경험을 기록한 페이지"
updated: "2024-11-16"
---

## 어즐 SSG

깃허브에서 기본으로 제공하는 [Jekyll](https://jekyllrb.com/) 과 같은 SSG 를 만들어보고 싶었다.

불필요한 기능들은 빼고(실력이 없어서 구현은 못하고...) 최소한 필요한 것만 추려서, 본인의 필명을 붙여 [어즐 SSG](https://github.com/ehzl7b/ehzl7b.github.io)라 명명했다.

[node.js](https://nodejs.org/en/) 를 기본으로, [liquidjs](https://liquidjs.com/), [markdown-it](https://github.com/markdown-it/markdown-it#readme), [highlight.js](https://highlightjs.org/) 등 각종 라이브러리를 사용했다.

지금 현재 웹브라우저에 보이는 [어즐 블로그](/)는 이를 사용하여 제작된 블로그다.

## 폴더 기본 구조

- 폴더 구조
```pseudo
/_site
/_src
   +-- /_layout
   +-- /page
   +-- /asset
   |
   index.md
   404.md
   globals.js
```

/_src 폴더 안의 템플릿들과 리소스를 조합, 웹사이트를 /_site 폴더에 빌드하는 구조다. (빌드를 실행하고 나면 /_site 폴더가 자동 생성된다.)

index.md 는 웹사이트의 첫 화면을, 404.md 는 요청한 웹페이지나 리소스를 찾을 수 없는 경우 띄워질 화면을 담당하는 markdown 템플릿이다.

/page 는 보통 포스팅이라 불리우는 웹페이지들이 생성될 markdown 템플릿들이 삽입될 위치이고, /_layout 은 Jekyll 과 같이 layout 체이닝을 위해 필요한 liquid 템플릿들이 위치한다.

globals.js 는 markdown 템플릿이 빌드되기 시작할 때 최초로 삽입이 되는 기초적인 변수들을 담고있는 파일이다.

/asset 에는 웹사이트 구축에 필요한 다른 리소스들(*.css, *.js, robots.txt, favicon.svg 등등)을 담아두는 폴더다. 이 폴더에 담겨있는 파일들은 빌드 후 /_site 폴더 바로 아래에 복사가 된다. (즉 /_src/asset/*.* --> /_site/*.*)

## markdown 카테고리와 라벨

어즐 SSG 는 Jekyll 과 달리 markdown 템플릿이 위치한 경로로 카테고리 구분을, 파일명에 "라벨"을 두고 이를 바탕으로 템플릿 순서를 지정하도록 했다.

예를들어 "/_src/page/dev/[0010]self-introduction.md" 와 같은 템플릿이 있다고 하면, /page/dev 가 해당 템플릿의 카테고리, 대괄호로 둘러쌓인 부분(라벨)을 제외한 self-introduction 부분만이 인터넷 주소가 된다.

카테고리는 해당 카테고리 포스팅만을 모아놓은 네비게이션 페이지를 만들 때 필요하고, 라벨은 같은 카테고리 안 포스팅들 순서를 정할 때 필요하다.

카테고리와 라벨에 대해서는 아래 부연설명한다.

## globals.js

- /_src/globals.js
```js
export default global = {
  // site vars
  site: {
    title: "어즐 블로그",  
    cats: [
      {cat: "#", permalink: "##", title: "카테고리1"},
      {cat: "#", permalink: "##", title: "카테고리2"},
    ],
  },
  // default page vars
  layout: "page",
  permalink: "/page/{{ name | remove_label }}/",
  content: "",
};
```

site.title 은 생성될 사이트의 제목을, site.cats 는 지금 상단 메뉴에 보이는 카테고리들 정보를 담은 변수이고, 아래에 보이는 layout, permalink, content 는 markdown 템플릿을 최초로 빌드할 때 우선적으로 전달되는 변수들이다.

이 변수들은 모두 markdown 및 layout 체이닝 과정에서 프론트매터 정보를 통해 덧씌워질 수 있다.

이 중 permalink 는 빌드가 되는 템플릿의 최종적인 인터넷 주소를 가리킨다고 보면 된다. "/page/{{ name | remove_label }}" 이라고 되어 있는데, name 은 파일명을, remove_label 은 라벨을 제거하라는 liquidjs 라이브러리의 필터다. (빌드 프로그램 안에 사용자 필터를 정의하였다.)

permalink 는 반드시 trailing slash 로 끝나야 한다. 여기에 index.html 이 붙는 구조로 인터넷 경로가 설정된다.

위에서 예로 든 self-introduction 의 경우, 템플릿 프론트매터에서 permalink 를 별도로 지정하지 않았다면, 최종 빌드 결과물은 "/_site/page/self-introduction/index.html" 이 되고, 웹브라우저에서 " ... /page/self-introduction" 으로 접근할 수 있게 된다.

## 빌드

대략 아래와 같은 순서로 빌드가 진행된다.

- 전체 빌드 순서
> - globals.js 에서 정의한 변수 import
> - 템플릿 파일들을 순회하면서 하나하나씩 웹페이지로 빌드
> - global 에서 정의한 site.cats 정보에 따라 카테고리별 웹페이지를 빌드
> - 템플릿 파일들을 순회할 때 얻은 정보로 sitemap.xml 빌드
> - 모든 웹페이지는 템플릿(또는 global)에서 정의한 permalink 에 따라 /_site 폴더에 저장

웹페이지 빌드만 구체적으로 얘기하면 아래와 같다.

- 웹페이지 빌드 순서
> - 템플릿 파일을 path 모듈 parse 함수로 { dir, base, name, ext } 생성
> - parse 결과물과 global 변수를 liquid 로 렌더링 
> - 위 렌더링 결과를 변수로 하여 템플릿 프론트매터 부분을 먼저 liquid 로 렌더링
> - 위 렌더링 결과를 변수로 하여 템플릿 콘텐츠 부분을 liquid 로 렌더링
> - 만일 markdown 이었다면, 추가로 markdown 렌더링
> - 전체 렌더링 결과를 content 에 담고, layout 체이닝에 따라 재귀호출 방식으로 계속 렌러딩

참고로 프론트매터는 yaml 형식이어야 한다. 그리고 layout 체이닝에 필요한 liquid 템플릿은 /_layout 폴더에 정의되어 있어야 한다.

## index.md, 404.md, 카테고리별 웹페이지, sitemap.xml

/_src 폴더 바로 아래에 위치한 index.md, 404.md 는 프론트매터에 permalink 를 별도로 지정하였다. 각각 블로그 첫화면과 404 에러 발생했을 때의 화면이므로, Github 페이지 작동방식대로 index.html, 404.html 이 되어야 하기 때문이다. 또한 노출 순서가 중요한 웹페이지는 아니기에 템플릿 파일명에 라벨도 필요가 없다.

카테고리 페이지와 sitemap.xml 은 markdown 템플릿 없이 자동으로 빌드가 된다. (markdown 은 없지만 /_layout 폴더에 liquid 템플릿은 정의되어 있다.)

markdown 템플릿들을 하나하나 빌드하는 과정에서, 전체 웹페이지에 대한 정보들을 카테고리별로 오브젝트에 차곡차곡 담는다. 이 오브젝트를 다시 순회하면서, 카테고리 웹페이지, sitemap.xml 을 빌드하는 구조다.

참고로 전체 웹페이지 정보는 { "카테고리": [ { permalink, title, content }, ... ], ... } 과 같은 형태로 담긴다.

globals.js 안을 보면, site.cats 변수가 보이는데, 이 순서대로 카테고리 웹페이지가 빌드된다. 기본 permalink 가 아닌 별도의 permalink 와 함께 상단 메뉴에 보이는 것처럼 타이틀을 정의하고 있다.

이 변수의 정보는, 모든 웹페이지의 기본 골격에 해당하는 liquid 템플릿도 참고한다. 메뉴 네비게이션 부분을 만들어 내야 하기 때문이다.

참고로 "cats" 의 의미는 카테고리의 약자인 cat 에 복수형 s 를 붙인 것이다. (고양이가 아니다.)

## 미래 계획 ?

언젠가 시간이 된다면... (실력이 된다면...) 웹페이지 서칭과 페이지네이션 기능을 추가해 보고자 한다.

그런데, 직접 만들기 보다는 아마도 그냥 Jekyll 같은 이미 검증된 SSG 를 사용하겠지...