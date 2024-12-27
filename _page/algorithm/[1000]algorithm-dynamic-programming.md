---
title: "동적 계획법 (Dynamic Programming)"
description: "수학 점화식 풀이와 유사한 방식으로 접근하는 알고리즘"
updated: "2024-12-21"
---

## 동적 계획법 (Dynamic Programming)

한글 이름과 영문이 가장 매치가 안되는 알고리즘으로, [나무위키](https://namu.wiki/w/%EB%8F%99%EC%A0%81%20%EA%B3%84%ED%9A%8D%EB%B2%95)나 포털에서 개념을 아무리 찾아봐도 잘 이해가 되지 않는 알고리즘이다.

차라리 고등학교 수학에서 배웠던 [점화식](https://namu.wiki/w/%EC%A0%90%ED%99%94%EC%8B%9D) 풀이와 유사한 알고리즘이라고 보는 것이 좋다. (초기값을 정의하고, 일반항으로 n 번째까지 반복하여 결과 도출)

예를들어 n! 을 구하는 팩토리얼을 동적 계획법으로 풀어본다면 아래와 같다.

- pseudo
```pseudo
1. 초기값 을 정의, f(1) = 1
2. 일반항을 정의, f(n) = f(n-1) * n
3. n 을 구할 때까지 일반항을 반복
```

또한 일반항을 반복하는 방법은 두가지가 있다. 초기값부터 시작해서 올라가는 Bottom-up 방식과 일반항에서 시작해서 초기값으로 내려가는 Top-down 방식이 있는데, 필연적으로 전자는 iterative 반복, 후자는 recursive 반복과 연결된다.

## leetcode: 

[https://leetcode.com/problems/climbing-stairs/](https://leetcode.com/problems/climbing-stairs/)

계단을 오를 때, 한계단을 오르는 방법, 두계단을 한번에 오르는 방법, 2 가지가 있을 때, 총 n 개의 계단을 오르는 방법의 개수를 구하는 문제다.

조금만 생각해보면, 피보나치 수열과 똑같은 문제라는 것을 알 수 있다.

n = 1 일 때, 계단을 오르는 방법 개수는 1 개 뿐이다. n = 2 이라면 한계단씩 오르는 방법과, 한번에 두계단을 오르는 방법 2 개가 있다. 이것이 초기값이다.

그럼 일반항은? n 개의 계단을 오른다고 하면, n - 2 개의 계단을 오른 뒤 마지막 두계단을 한번에 오르는 방법과, n - 1 개의 계단을 오른 뒤 마지막 한계단을 오르는 방법이 있다. 즉 f(n) = f(n-2) + f(n-1) 인 셈이다.

- javascript, iterative DP
```js
let climbStairs = (n) => {
  let a = Array((n < 3) ? 3 : n+1).fill(0);
  a[1] = 1;
  a[2] = 2;

  for (let i = 3; i <= n; i++) {
    a[i] = a[i-2] + a[i-1];
  }

  return a[n];
};
```

최소 인덱스 2 이상 가능한 a 배열을 생성하고, a 배열에 초기값을 지정한 뒤, 반복을 통해 a[n] 을 계산하는 방식이다.

- javascript, iterative DP 2
```js
let climbStairs = (n) => {
  let [a, b] = [1, 2];

  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a+b];
  }

  return a;
};
```

일반항 반복 계산의 최종 결과만 리턴하면 되므로, 굳이 저장소를 크게 확보할 필요가 없이 a, b 변수 두개만 사용한 방법이다.

- javascript, recursive DP
```js
let f = (n) => (n < 3) ? n : f(n-2) + f(n-1);

let climbStairs = (n) => f(n);
```

위 방법은 Time Limit 초과로 문제를 통과할 수 없다. 예를들어 f(45) 를 구한다고하면 f(43) + f(44) 를 구하게 된다, f(43) 을 먼저 구했다고 해보자. 이제 f(44) 를 구해야 하는데, f(44) 는 f(42) + f(43) 이므로, 이미 앞에서 구한 f(43) 을 또 구해야 한다. O(2^n) 이라는 어마어마한 시간복잡도를 가진다.

아래와 같이 한번 구한 값을 저장해두고, 이를 활용하는 방식으로 해결 할 수 있다. 이른바 memoization 기법이다.

- javascript, recursive DP with memoization
```js
let f = (n) => (n < 3) ? n : f(n-2) + f(n-1);

let memoize = (f) => {
  let h = new Map();
  return (n) => {
    if (!h.has(n)) h.set(n, f(n));
    return h.get(n);
  };
};

let climbStairs = (n) => {
  f = memoize(f);
  return f(n);
};
```

memoize 함수는, f 함수를 받아서 저장소 h 를 우선 검색하여, 없다면 값을 재귀호출로 계산하고, 있다면 그 결과를 리턴하는 구조로 되어있다.