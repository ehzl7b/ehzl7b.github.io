---
layout: page
title: 동적 계획법(Dynamic Programming) - Iterative, Recursive DP 및 메모이제이션(Memoization)
description: iterative, recursive 방식의 DP와 recursive DP에서 과도한 재귀호출을 줄일 수 있는 메모이제이션 기법 소개
updated: 2024-06-14
---

## 프로그래머스: 멀리뛰기

[https://school.programmers.co.kr/learn/courses/30/lessons/12914](https://school.programmers.co.kr/learn/courses/30/lessons/12914)

멀리뛰기를 한칸 또는 두칸을 뛸 수 있을때, N칸을 멀리뛸 수 있는 가짓수를 찾는 문제다. DP로 풀 수 있으며, [피보나치 수열](https://namu.wiki/w/%ED%94%BC%EB%B3%B4%EB%82%98%EC%B9%98%20%EC%88%98%EC%97%B4)값을 찾는 방법과 매우 닮았다.

초기값과 일반항은 아래와 같다.

- pseudo
```pseudo
# N칸을 멀리뛰기 할 수 있는 가짓수를 f(N)이라 할 때, 초기값과 일반항
초기값: f(1) = 1, f(2) = 2
일반항: f(N) = f(N-2) + f(N-1)
```

아래는 초기값과 일반항을 그대로 사용하여 iterative DP 방식으로 푼 코드다.

- javascript
```js
function solution(n) {
    let a = [0n, 1n, 2n, ...Array(n).fill(0)]
    
    for (let i=3; i <= n; i++) {
        a[i] = a[i-2] + a[i-1]
    }
    
    return a[n] % 1234567n
}
```

초기값과 함께 n 개 이상의 공간이 준비된 a 배열을 상정한 뒤, for 반복문으로 일반항 값들을 계산하여 배열에 담아낸다.

문제를 보면 n 이 최대 2,000까지 될 수 있는데, 이 경우 무지무지하게 큰 값이 나오게 되므로 [BigInt 개체](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/BigInt)를 사용했다.

위 코드를 좀 더 효율화 할 수 있다.

우선, 문제에서 요구하는 것은 n칸 멀리뛰기 가짓수만이므로, n까지의 모든 가짓수를 모아놓은 a 배열을 만들 필요는 없다. 단순 변수 a, b 만을 사용하면 된다.

다음으로, 나머지를 구하는 % 연산자의 특성을 활용하면 BigInt 개체를 굳이 사용하지 않아도 된다. % 연산은 아래와 같은 공식이 성립한다.

- note
```text
(A + B) % x = ((A % x) + (B % x)) % x
```

아래는 개선 코드다.

- javascript
```js
function solution(n) {
    if (n < 3) return n
    
    let [a, b] = [1, 2]
    for (let i=3; i <= n; i++) {
        [a, b] = [b, (a+b) % 1234567]
    }
    
    return b
}
```

이제까지는 iterative 방식이었는데, 재귀함수를 사용하여 recursive 방식으로도 풀 수 있다.

- javascript
```js
function solution(n) {
    return n < 3 ? n : (solution(n-2)+solution(n-1)) % 1234567
}
```

매우 간결해보이지만 시간초과 에러가 나온다. 왜냐하면, f(20)을 구하려면, f(18) 과 f(19) 값이 필요하다. f(18)을 먼저 구했다고 치자. 이제 f(19)를 구해야하는데 또 f(18)을 구해야한다. 이런식으로 구해야 하기 때문에 시간복잡도는 어마무시한 O(2^n)이다.

메모이제이션 기법을 사용하면 해결할 수 있다. 저장소 h 를 하나 마련하고, 한번 구한 f(n) 값은 h[n] 과 같은 형태로 저장해 놓고, 이를 가져다쓰면 된다.

- javascript
```js
function solution(n) {
    let f = n => n < 3 ? n : (f(n-2)+f(n-1)) % 1234567
    
    f = (f => {
        h = new Map()
        
        return n => {
            if (!h.has(n)) h.set(n, f(n))
            return h.get(n)
        }
    })(f)
    
    return f(n)
}
```

시간초과가 나왔던 코드를 Arrow 함수로서 f 로 정의한 뒤, 이를 다시 클로저로 감쌌다. h Map 개체가 저장소 역할을 한다. 리턴하는 Arrow 함수를 보면 h 안에 n의 결과값이 없다면 먼저 구해서 넣고, 결과값을 리턴하도록 되어 있다.
