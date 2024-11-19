---
layout: "page"
title: "어즐 블로그 빌더 개발 기록"
description: "node.js 로 SPA 웹사이트를 형성해주는 블로그 빌더 개발한 경험을 기록한 페이지"
updated: "2024-11-19"
---

## 어즐 블로그 빌더 개요

명칭은 "어즐 블로그 빌더", 버전은 "1.0" (예전에도 비슷한 것을 만들어봤었으나, 명칭도 바꾸고 버전도 새로이 등록)

node.js 로 블로그 웹사이트 생성, 템플릿 엔진으로 liquid.js 사용, 전체 css 는 scss 로 변환

SPA 방식으로 작동, 요청한 주소에 매칭되는 웹페이지를 js 가 로딩, 웹페이지 소스는 markdown 이며, 전체 빌드 시점에 html 로 렌더링

## 폴더 구조

- 폴더 구조
```pseudo
/_site              # 빌드 결과물(웹사이트)가 저장되는 폴더
/_page              # 웹페이지가 될 markdown 소스 폴더
/_layout            # liquid.js 템플릿 엔진용 소스 폴더
/_asset             # 각종 scss, js, ico 등 리소스 폴더
/_lib               # 빌드에 필요한 유틸리티 (markdown, liquid.js 렌더링)
index.js            # 빌드 시작 js 파일
```

/_layout 폴더에 base.liquid, page.liquid, dirpage.liquid, sitemap.liquid 배치

base 는 index.html 을, page 는 로딩 웹페이지 html 완성을, dirpage 는 카테고리 페이지 html 을, sitemap 은 sitemap.xml 을 위한 템플릿

필요한경우 layout 체이닝을 통해 템플릿 렌더링 후 다른 템플릿으로 전체 정보 전달

/_page 내부의 markdown 들은 하위 폴더로 카테고리 구분 (즉 /_page/dev 폴더 안의 markdown 들은 /dev 라는 카테고리로 묶임)

또한 markdown 파일명은 [라벨]파일명.md 형태, html 로 렌더링 된 뒤에는 /_site/page/카테고리/파일명.html 로 저장 (즉 대괄호에 둘러쌓인 라벨은 삭제), 라벨은 동일한 카테고리 내 파일들 간의 순서를 정할 때 용이

/_page 에 카테고리를 지정하지 않는 index.md, 404.md, [라벨]카테고리.md, sitemap.md 파일 필요, html 렌더링 된 뒤에는 /_site/page 폴더에 저장

## 빌드 순서

- 빌드 순서
> - 전체 markdown 템플릿 순회
> - 파일경로으로 디폴트 변수 liquid 렌더링
> - 디폴트 변수로 markdown 프론트매터 렌더링
> - 프론트매터를 변수로 markdown 콘텐츠 렌더링
> - 렌더링 결과(html)을 pagesMap 오브젝트에 저장
> - pagesMap 오브젝트 순회
> - maarkdown 렌더링 결과에 있던 layout 정보를 변수로 다음 liquid 템플릿 연결
> - 렌더링 결과 콘텐츠 부분을 제외하고 pagesMap 정보 업데이트
> - pagesMap 및 디폴트를 변수로 base.liquid 렌더링하여 index.html 생성
> - index.html 을 404.html 에 그대로 복사
> - scss 파일을 css 로 전환
> - /_asset 폴더 내용을 /_site 폴더로 복사

## 향후 계획

게시판 기능, 서치 기능, 페이지네아션...
