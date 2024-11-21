---
layout: "page"
title: "수학(Math) - 최대공약수(GCD)와 최소공배수(LCM)"
description: "최대공약수와 최소공배수를 구하는 알고리즘"
updated: "2024-06-20"
---

## 최대공약수와 최소공배수

최대공약수 (GCD, Greatest Common Divisor) 는 [유클리드 호제법](https://namu.wiki/w/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C%20%ED%98%B8%EC%A0%9C%EB%B2%95)으로 구할 수 있다. 그리고 최소공배수 (LCM, Least Common Multiple) 은 GCD 를 이용하여 구할 수 있다.

참고로 3 개 이상 수, 예를들어 x, y, z 의 GCD(또는 LCM) 을 구할 때는, x 와 y 의 GCD(또는 LCM) 을 먼저 구하고, 그 수와 z 의 GCD(또는 LCM) 을 구하면 된다. 

## 프로그래머스: N개의 최소공배수

[https://school.programmers.co.kr/learn/courses/30/lessons/12953](https://school.programmers.co.kr/learn/courses/30/lessons/12953)

주어진 수들의 LCM 을 구하는 문제다.

- python
```py
from functools import reduce

def gcd(x, y): return gcd(y, x%y) if x%y else y
def lcm(x, y): return x*y // gcd(x, y)

def solution(arr):
    return reduce(lcm, arr)
```

두 수의 gcd, lcm 을 구해주는 함수를 먼저 구현했다. x, y 크기에 관계없이 자연수이기만 하면 된다. 간혹 다른 블로그에서 x > y 이어야한다는 조건을 다는 경우도 봤는데 x < y 이면 gcd(x, y) 의 결과는 자연스럽게 x 와 y 의 값을 교환한다. 따라서 x < y 이어도 상관이 없다.