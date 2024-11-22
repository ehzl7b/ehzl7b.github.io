---
layout: "page"
title: "엑셀함수 - N 함수로 수식안에 주석문 삽입"
description: "엑셀 메모 기능말고 N 함수를 사용하여 수식 자체에 간단한 메모 또는 주석문을 삽입해보기"
updated: "2024-05-19"
---

## 주석문 삽입

- excel
```excel
=수식 + N("주석문...")
```

N 함수는 사실 쓸모없는 함수로, [MS 오피스 문서](https://support.microsoft.com/ko-kr/office/n-%ed%95%a8%ec%88%98-a624cad1-3635-4208-b54a-29733d1278c9?ui=ko-kr&rs=ko-kr&ad=kr)를 보면 다른 스프레드시트 프로그램과의 호환성을 위해 제공한다고 되어 있다.

N 함수에 문자열을 적용하면 0 이 되는 특성을 이용한 것으로, `수식` 뒤에 `+ N("하고싶은말....")` 형태로 넣으면, 수식에 영향을 주지 않으면서, 엑셀 메모기능과 비슷한 역할을 할 수 있다.