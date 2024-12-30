---
title: "소수 (Prime Number) 구하기"
description: "소수를 구하는 가장 유명한 방법인 에라토스테네스의 체 알고리즘 구현"
updated: "2024-12-31"
---

## 에라토스테네스의 체

[나무위키](https://namu.wiki/w/%EC%97%90%EB%9D%BC%ED%86%A0%EC%8A%A4%ED%85%8C%EB%84%A4%EC%8A%A4%EC%9D%98%20%EC%B2%B4)를 보면 쉽게 알 수 있다.

여기서 [체](https://namu.wiki/w/%EC%B2%B4(%EC%A1%B0%EB%A6%AC%EA%B8%B0%EA%B5%AC))는 곡물등 고운 입자만을 거를 때 쓰는 주방기구를 말한다. 숫자들을 나열해놓고 소수가 아닌 수들을 걸러내는 알고리즘 방식 때문에 붙은 표현인 것 같다.

간단하게 말하자면, 가장 작은 소수인 2 의 배수들은 소수가 아니므로 지운다. 다음 소수인 3 의 배수들을 마찬가지로 지운다. 이제 다음 소수인 5 의 배수들을 지운다... 계속 하다보면 지워지지 않고 남이있는 수들이 소수인 셈이다.

## leetcode: 204. Count Primes

[https://leetcode.com/problems/count-primes/](https://leetcode.com/problems/count-primes/)

주어진 정수 n 보다 작은 소수의 개수를 리턴하는 문제다.

- javascript, Sieve of Eratosthenes
```js
let genPrimes = (n) => {
  if (n < 2) return [];
  
  let a = Array(n).fill(true);
  a[0] = false;
  a[1] = false;

  for (let i = 2; i <= Math.trunc(n ** 0.5); i++) {
    if (!a[i]) continue;

    for (let j = i*i; j <= n; j += i) a[j] = false;
  }
  
  return a.reduce((acc, x, i) => {
    if (x) acc.push(i);
    return acc;
  }, []);
};

let countPrimes = (n) => {
  let a = genPrimes(n);
  return a.at(-1) === n ? a.length - 1 : a.length;
};
```

genPrimes 함수가 핵심으로, n 까지의 소수를 구하도록 되어 있다.

인덱스 n 까지의 배열을 생성하고, 모두 true 로 채운다. (인덱스 i 가 true 면 i 는 소수라는 의미), 먼저 소수가 아닌 0, 1 은 false 로 바꾼다.

다음은 이중 반복문으로 소수이면, 그 배수(정확하게는 i 의 제곱부터) 들을 false 로 채우도록 되어 있다.

마지막엔 true 값을 가진 인덱스만 추려서 리턴한다.

countPrimes 함수에서는 마지막으로 구한 소수가 n 이면 이를 빼고 리턴하도록 되어 있다. (n 보다 작은 소수들의 개수를 구하라고 했으므로...)

참고로, 위 getPrimes 는 n 이라는 숫자가 주어진 상황에서 소수를 생성한다. 이와달리 python 제너레이터 문법으로, n 없이 2 부터 계속 소수만을 yield 하도록 하는 코드를 [stackoverflow](https://stackoverflow.com/questions/567222/simple-prime-number-generator-in-python#answer-568618) 에서 찾았기에 javascript 문법으로 바꿔보았다.

- javascript, Sieve of Eratosthenes 2
```js
let genPrimes = function* () {
  let h = new Map();
  let n = 2;

  while (true) {
    if (h.has(n)) {
      for (let x of h.get(n)) {
        if (!h.has(n+x)) h.set(n+x, []);
        h.get(n+x).push(x);
      }
      h.delete(n);
    } else {
      yield n;
      h.set(n*n, [n]);
    }

    n++;
  }
};

let countPrimes = (n) => {
  let primeNums = [];
  for (let x of genPrimes()) {
    if (n <= x) break;
    primeNums.push(x);
  }

  return primeNums.length;
};
```

마찬가지로 에라토스테네스의 체 알고리즘을 사용하고 있다. 하지만 이 방식은 아쉽게도 시간초과로 문제를 통과할 수 없었다.