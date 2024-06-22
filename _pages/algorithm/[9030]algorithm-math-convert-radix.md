---
layout: page
title: 수학(Math) - 진법(Radix) 변환
description: 일반적으로 사용하는 10진법 수를 2~36진법으로 변경하는 알고리즘과, 다시 원복하는 알고리즘 구현
updated: 2024-06-22
---

## 진법

[진법](https://ko.wikipedia.org/wiki/%EA%B8%B0%EC%88%98%EB%B2%95)은 수를 표기하는 방법론에 관한 것으로, 보통 우리가 사용하는 10진법은 10개의 문자로 하나의 자릿수를 표기하는 방법을 의미한다. 2진법은 2개의 문자를, 16진법은 16개의 문자를 사용한다.

위 링크 안을 보면, 10진법을 N진법으로... 또는 N진법을 10진법으로 바꾸는 방법을 찾을 수 있는데, N진법으로 바꿀때는 나눗셈의 나머지를, 10진법으로 환원할 때는 N 거듭제곱을 활용하면 된다.

## 프로그래머스: 3진법 뒤집기

[https://school.programmers.co.kr/learn/courses/30/lessons/68935](https://school.programmers.co.kr/learn/courses/30/lessons/68935)

주어진 수를 3진법 수로 바꾸고, 그 숫자를 뒤집어서 다시 10진법으로 환원하는 문제다.

- javascript
```js
Number.prototype.toRadix = function(r, d="0123456789abcdefghijklmnopqrstuvwxyz") {
    return this < r ? d[this%r] : (~~(this/r)).toRadix(r) + d[this%r]
}
String.prototype.toInt = function(r, d="0123456789abcdefghijklmnopqrstuvwxyz") {
    return this.split("").reverse().reduce((a, x, i) => a + d.indexOf(x) * r ** i, 0)
}

function solution(n) {
    return n.toRadix(3).split("").reverse().join("").toInt(3)
}
```

javascript의 prototype 문법을 사용하여, 함수들이 체인형태로 이어질 수 있도록 구성했다.

javascript는 진법 변환을 위한 기본 함수를 제공하는데, 아래는 이를 사용한 풀이다.

- javascript
```js
function solution(n) {
    return parseInt(n.toString(3).split("").reverse().join(""), 3)
}
```

# 프로그래머스: N진수 게임

[https://school.programmers.co.kr/learn/courses/30/lessons/17687](https://school.programmers.co.kr/learn/courses/30/lessons/17687)

n 진법으로 변형된 수를 m 명의 인원들이 한글자씩 순서대로 말하는 게임이 있다. 이때, p 번째 자리에 앉아있는 사람이 t 개의 컨닝페이퍼를 만든다고 할 때, 그 컨닝페이퍼를 리턴하는 문제다.

- javascript
```js
function solution(n, t, m, p) {
    let a = ""
    let chs = []
    let gn = g(n)
    
    while (a.length < t) {
        while (chs.length < m) chs = [...chs, ...gn.next().value.split("")]
        a += chs.splice(0, m)[p-1]
    }
    
    return a
}

function* g(r) {
    let toRadix = (n, r, d="0123456789ABCDEF") => n < r ? d[n%r] : toRadix(~~(n/r), r) + d[n%r]
    
    let i = 0
    while (true) {
        yield toRadix(i, r)
        i++
    }
}
```

먼저 g 제너레이터를 구현하였다. r 진법의 수를 순서대로 필요할 때마다 yield 한다.

solution 함수의 while 구문이 핵심인데, chs 배열의 요소 개수가 m 개가 안되면 그 때마다 제너레이터를 호출하여 한글자씩 끊어서 채운다. 그리고 chs 배열의 앞부분부터 m개씩 끊고, p-1번째 글자를 컨닝페이퍼에 채우는 구조다.
