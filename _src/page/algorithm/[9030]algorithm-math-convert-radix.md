---
layout: "page"
title: "수학(Math) - 진법(Radix) 변환"
description: "일반적으로 사용하는 10진법 수를 2~36진법으로 변경하는 알고리즘과, 다시 원복하는 알고리즘 구현"
updated: "2024-06-22"
---

## 진법

[진법](https://ko.wikipedia.org/wiki/%EA%B8%B0%EC%88%98%EB%B2%95)은 수를 표기하는 방법론에 관한 것으로, 보통 우리가 사용하는 10진법은 10개의 문자로 하나의 자릿수를 표기하는 방법을 의미한다. 2진법은 2개의 문자를, 16진법은 16개의 문자를 사용한다.

위 링크 안을 보면, 10진법을 N진법으로... 또는 N진법을 10진법으로 바꾸는 방법을 찾을 수 있는데, N진법으로 바꿀때는 나눗셈의 나머지를, 10진법으로 환원할 때는 N 거듭제곱을 활용하면 된다.

## 프로그래머스: 3진법 뒤집기

[https://school.programmers.co.kr/learn/courses/30/lessons/68935](https://school.programmers.co.kr/learn/courses/30/lessons/68935)

주어진 수를 3진법 수로 바꾸고, 그 숫자를 뒤집어서 다시 10진법으로 환원하는 문제다.

- python
```py
def toRadix(n, r, d="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    return d[n%r] if n < r else toRadix(n//r, r) + d[n%r]

def toInt(s, r, d="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    return sum(d.index(x) * r**i for i, x in enumerate(s[::-1]))

def solution(n):
    return toInt(str(toRadix(n, 3)[::-1]), 3)
```

python는 int 함수가 위에서 작성한 toInt 함수와 동일한 기능을 제공하는데, 아래는 이를 사용한 풀이다.

- python
```py
def toRadix(n, r, d="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    return d[n%r] if n < r else toRadix(n//r, r) + d[n%r]

def solution(n):
    return int(toRadix(n, 3)[::-1], 3)
```

# 프로그래머스: N진수 게임

[https://school.programmers.co.kr/learn/courses/30/lessons/17687](https://school.programmers.co.kr/learn/courses/30/lessons/17687)

n 진법으로 변형된 수를 m 명의 인원들이 한글자씩 순서대로 말하는 게임이 있다. 이때, p 번째 자리에 앉아있는 사람이 t 개의 컨닝페이퍼를 만든다고 할 때, 그 컨닝페이퍼를 리턴하는 문제다.

- python
```py
def solution(n, t, m, p):
    a = ""
    pool = ""
    gen = iter(g(n))
    
    while len(a) < t:
        while len(pool) < m:
            pool += next(gen)
        a += pool[p-1]
        pool = pool[m:]
    
    return a

def g(r):
    def toRadix(n, r, d="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
        return d[n%r] if n < r else toRadix(n//r, r) + d[n%r]
    
    i = 0
    while 1:
        yield toRadix(i, r)
        i += 1
```

먼저 g 제너레이터를 구현하였다. r 진법의 수를 순서대로 필요할 때마다 yield 한다.

solution 함수의 while 구문이 핵심인데, pool 문자열의 요소 개수가 m 개가 안되면 그 때마다 제너레이터를 호출하여 뒤에 채운다. 그리고 pool p-1번째 글자를 컨닝페이퍼에 채우고, 앞에서부터 m개수만큼 끊어낸다.
