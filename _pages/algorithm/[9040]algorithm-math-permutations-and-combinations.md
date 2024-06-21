---
layout: page
title: 수학(Math) - 순열(Permutations)과 조합(Combinations)
description: n 개의 요소들로 이뤄진 배열에서 k 개를 골라 순열 또는 조합 배열을 구하기
updated: 2024-06-22
---

## 순열과 조합

n 개 요소를 가진 배열에서 k 개를 골라 나열한다고 했을 때, [순열](https://namu.wiki/w/%EC%88%9C%EC%97%B4)은 순서를 고려하고, [조합](https://namu.wiki/w/%EC%A1%B0%ED%95%A9)은 순서를 고려하지 않고 나열하는 방법을 의미한다.

또한, 중복하여 요소를 고를 수 있나 없나에 따라 구별도 할 수 있다.

- pseudo
```pseudo
# 배열 [0, 1, 2] 에서 2 개를 골라서 나타낸다면 아래와 같다.

중복순열: [ [0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2] ]
순열    : [         [0, 1], [0, 2], [1, 0],         [1, 2], [2, 0], [2, 1]         ]
중복조합: [ [0, 0], [0, 1], [0, 2],         [1, 1], [1, 2],                 [2, 2] ]
조합    : [         [0, 1], [0, 2],                 [1, 2]                         ]
```

"중복순열"에서 반복되는 요소가 없는 것이 "순열"이다. 그리고 "중복순열"에서 앞의 요소가 뒤 요소보다 큰 경우가 없는 것이 "중복조합"이며, 반복되는 요소마저 없다면 "조합"이 된다.

javascript 제너레이터 문법을 이용해서 아래와 같이 구현할 수 있다.

- javascript
```js
function* f(arr, k) {
    let a = Array(k).fill(0)
    let n = arr.length

    while (true) {
        // yield a.map(x => arr[x])                                                 // 중복순열
        // if (a.length === new Set(a).size) yield a.map(x => arr[x])               // 순열
        // if (a.every((x, i) => i === 0 || a[i-1] <= x)) yield a.map(x => arr[x])  // 중복조합
        if (a.every((x, i) => i === 0 || a[i-1] < x)) yield a.map(x => arr[x])      // 조합

        let i = k-1
        while (a[i] === n-1) {
            i--
            if (i < 0) return
        }

        a[i]++
        for (let j=i+1; j < k; j++) a[j] = 0
    }
}
```
