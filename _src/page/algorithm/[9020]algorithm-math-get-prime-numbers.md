---
layout: "page"
title: "수학(Math) - 소수(Prime Number) 구하기"
description: "소수를 찾아내는 알고리즘 소개"
updated: "2024-06-20"
---

## 소수 찾는 알고리즘

소수를 찾아내는 가장 유명한 알고리즘은 [에라토스테네스의 체](https://namu.wiki/w/%EC%97%90%EB%9D%BC%ED%86%A0%EC%8A%A4%ED%85%8C%EB%84%A4%EC%8A%A4%EC%9D%98%20%EC%B2%B4)이다.

자연수를 순서대로 나열하고, 2 부터 그 배수를 계속 지워나간다. 다음은 3 부터 다시 배수를 지워나간다. 마치 체로 거르듯이 말이다. 지워지지 않고 남은 수들이 소수인 셈이다.

## Leetcode: 204. Count Primes

[https://leetcode.com/problems/count-primes](https://leetcode.com/problems/count-primes)

주이진 n 미만의 소수가 몇개인지 리턴하는 문제다. 2 부터 n 미만까지의 소수를 찾아내서 그 개수를 구하면 된다.

- python
```py
class Solution:
    def countPrimes(self, n: int) -> int:
        return len(self.f(n))
    
    def f(self, n):
        a = [0, 0]+[1]*(n-2)

        for i in range(2, int(n**0.5) + 1):
            if not a[i]:
                continue
            for j in range(i*i, n, i):
                a[j] = 0
        
        return [i for i, x in enumerate(a) if x == 1]
```

위에서 언급한 에라토스테네스의 체 알고리즘을 적용했다.

f 함수 내부를 보면, a 리스트를 먼저 생성하는데, 해당 인덱스가 소수이면 1, 아니라면 0 으로 두고자 한다. 일단 먼저 2 부터는 모두 소수인 1 로 보았다.

for 반복문 내용이 핵심인데, 2 부터 시작해서 n 의 제곱근 이하의 정수까지 반복한다. 소수라면 다음 for 문으로 넘어가서 해당 소수의 제곱부터 그 배수를 지워나간다.

마지막에 소수만 추려서 리턴한다.

이 함수 f 는 최대값 n 이 주어질 때만 작동한다. 구글링을 해보니, 제너레이터 문법을 사용하여 2 부터 무한대로 (시간과 메모리가 충분하다면...) 소수를 계속 생성하는 코드가 있어([StackOverflow](https://stackoverflow.com/questions/567222/simple-prime-number-generator-in-python) 참고) 아래에 javascript 로 옮겨 문제를 풀어보았다.

- python
```py
from itertools import takewhile

class Solution:
    def countPrimes(self, n: int) -> int:
        return len(list(takewhile(lambda x: x < n, self.g())))

    def g(self):
        h = {}        
        i = 2

        while 1:
            if i in h:
                for x in h[i]:
                    h.setdefault(i+x, []).append(x)
                del h[i]
            else:
                yield i
                h[i*i] = [i]
            i += 1
```

시간이 오래 걸리기는 했지만 간신히 풀리기는 했다.

g 제너레이터를 보면 h 딕셔너리에 `{합성수: [소수, ...], ... }` 형태로 데이터를 저장해 간다. 여기서의 소수는 소인수분해를 했을 때 해당 합성수를 구성하는 소수다. 찬찬히 살펴보면 에라토스테네스의 체 방식을 그대로 사용하는 것을 알 수 있다.

구글링을 또 해보니 어느 외국 [사이트](https://illya.sh/the-codeumentary-blog/regular-expression-check-if-number-is-prime/)에서 정규식을 가지고 어떤 숫자가 소수인지 아닌지 판별하는 방법을 소개하고 있었다.

이를 약간 변형해서 아래와 같이 풀어보았다.

- python
```py
import re

class Solution:
    def countPrimes(self, n: int) -> int:
        a = 0
        for i in range(2, n):
            if self.check(i):
                a += 1
        return a
    
    def check(self, n):
        return not re.match(r"^1?$|^(11+?)\1+$", "1"*n)
```

check 함수가 아주 독특하다. 원리는 "1" 이라는 문자를 n 개 나열했을 때, 2 이상의 수로 "1" 을 똑같은 개수로 나눌 수 있는지를 탐색한다. 기발한 방법이다.

아쉽게도 속도는 제일 느려서, 시간초과로 문제를 통과할 순 없었다.