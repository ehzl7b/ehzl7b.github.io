---
layout: page
title: 동적 계획법(Dynamic Programming) - Recursive DP 및 메모이제이션(Memoization)
description: recursive DP에서 과도한 재귀호출을 줄일 수 있는 메모이제이션 기법 소개
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

iterative DP 방식의 풀이 코드는 [별도 포스팅](/page/algorithm-dynamic-programming)에서 소개했다.

아래는 재귀함수를 사용하여 recursive 방식으로도 풀 어낸 코드다.

- javascript
```js
function solution(n) {
    return n < 3 ? n : (solution(n-2)+solution(n-1)) % 1234567
}
```

매우 간결해보이지만 시간초과 에러가 나온다. 왜냐하면, f(20)을 구하려면, f(18) 과 f(19) 값이 필요하다. f(18)을 먼저 구했다고 치자. 이제 f(19)를 구해야하는데 또 f(18)을 구해야한다. 이런식으로 한번 구한 값을 또 구해야 하기 때문에 오래 걸린다. 시간복잡도는 어마무시한 O(2^n)이다.

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

시간초과가 나왔던 코드를 Arrow 함수로서 f 로 정의한 뒤, 이를 다시 클로저 기법으로 감쌌다. h Map 개체가 저장소 역할을 한다. 리턴하는 Arrow 함수를 보면 h 안에 n의 결과값이 없다면 먼저 구해서 넣고, 결과값을 리턴하도록 되어 있다.
