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

## 기본 구조

본 블로그 [레포지토리](https://github.com/ehzl7b/ehzl7b.github.io)에 방문하면 폴더 구조를 볼 수 있다.

대략 Jekyll 과 비슷하게 보이도록 흉내내봤다. /_src 폴더에 빌드 관련 자료를 넣어 빌드하면 /_site 폴더에 웹사이트를 생성한다.

특이한 점은, Jekyll 과 달리 markdown 템플릿이 위치한 경로로 카테고리 구분을, 파일명에 "라벨"을 두고 이를 바탕으로 템플릿 순서를 지정하도록 했다.

예를들어 "/_src/page/dev/[0010]self-introduction.md" 와 같은 템플릿이 있다고 하면, /page/dev 가 해당 템플릿의 카테고리, 대괄호로 둘러쌓인 부분(라벨)을 제외한 self-introduction 부분만이 인터넷 주소가 된다.

카테고리는 해당 카테고리 포스팅만을 모아놓은 네비게이션 페이지를 만들 때 필요하고, 라벨은 같은 카테고리 안 포스팅들 순서를 정할 때 편하다.

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

## 어려웠던 점

빌더를 구축하다보니 다소 곤란했던 점이 생겼다.

/_src/dir 폴더 아래에는 특정 카테고리에 해당하는 포스팅들을 모두 나타내는 웹페이지 markdown 템플릿이 있다.

이 템플릿의 목적상, 전체(적어도 해당 카테고리)에 있는 모든 페이지들이 먼저 빌드가 되어 있어야 한다.

그런데, 해당 페이지들은 최종적으로 /_layout/base.liquid 파일을 렌더링하는데, 이 base.liquid 는 카테고리가 렌더링 되어야 한다.

즉 마치 엑셀의 순환참조와 같은 문제가 생긴다.

고민끝에, markdown 만 먼저 렌더링하여 pagesMap 오브젝트를 만들어 정보를 저장하고, pagesMap 을 순회하면서, pagesMap 자체를 같이 전달하여 liquid 렌더링 하도록 했다.

어떤 웹페이지가 만들어질 때, 렌더링 단계 어디에는 특정 프론트매터 변수를 넣어도 상관없는데, **pagesMap 에 지정된 변수는 markdown 렌더링했을 때의 정보** 수준에 머물러 있기 때문에, pagesMap 오브젝트가 참조되어야 할 때는 이를 markdown 단계에서 확실하게 정의되어야 한다.

예를들어, 어떤 웹페이지를 liquid 단계에서 permalink 를 정의하면, 원하는 위치에 제대로 저장은 되나, 이 웹페이지를 pagesMap 에서 참고하게 되면, markdown 단계에서의 permalink 가 참조되게 된다. 

## 기타

markdown 코드를 렌더링할 때 약간의 커스터마이징을 했다.

highlight.js 를 사용하되, 각 줄마다 &lt;span&gt; 코드를 추가로 삽입하여 줄마다 뭔가 효과를 줄 수 있는 부분을 추가했다.

## 미래 계획 ?

언젠가 시간이 된다면... (실력이 된다면...) 웹페이지 서칭과 페이지네이션 기능을 추가해 보고자 한다.

그런데, 직접 만들기 보다는 아마도 그냥 Jekyll 같은 이미 검증된 SSG 를 사용하겠지...