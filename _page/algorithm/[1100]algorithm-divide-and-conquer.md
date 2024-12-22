---
title: "분할 정복 (Divide and Conquer)"
description: "문제를 해결하기 위해, 두 단위로 계속 쪼깨어, 가장 작은 단위에서 다시 문제 해결을 하면서 조립하는 알고리즘"
updated: "2024-12-22"
---

## 분할 정복 (Divide and Conquer)

[나무위키](https://namu.wiki/w/%EB%B6%84%ED%95%A0%20%EC%A0%95%EB%B3%B5%20%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)에 소개된 개념을 보면 된다. 개념 자체는 어렵지 않지만, 코드 구현이 까다롭다.

재귀함수 안에 세가지 코드구현이 들어가야 한다. 첫째는 가장 작은 단위로 쪼개졌을 때의 리턴값, 둘째는 두 부분으로 쪼개어 다시 재귀호출을 하는 코드, 셋째는 재귀호출을 받아 재조립하여 다시 리턴하는 코드다.

## leetcode: 53. Maximum Subarray

[https://leetcode.com/problems/maximum-subarray/](https://leetcode.com/problems/maximum-subarray/)

주어진 nums 배열에서, 연속된 요소들로 이뤄진 부분합들 중 최대 부분합을 구하는 문제다.

- rust
```rust
use std::cmp::max;

fn dac(ns: &[i32]) -> (i32, i32, i32, i32) {
    if ns.len() == 1 {
        return (ns[0], ns[0], ns[0], ns[0]);
    }

    let m = ns.len() / 2;
    let (al, am, ar, at) = dac(&ns[..m]);
    let (bl, bm, br, bt) = dac(&ns[m..]);

    return (max(al, at+bl), max(max(am, bm), ar+bl), max(ar+bt, br), at+bt);
}

impl Solution {
    pub fn max_sub_array(nums: Vec<i32>) -> i32 {
        return dac(&nums).1;
    }
}
```

dac 는 재귀함수인데, 위에서 언급한 것처럼 세부분이 모두 코딩되어 있다.

먼저 dac 함수의 리턴값 형태를 이해해야하는데, 4 가지 값은 아래 의미를 가리킨다.

- pseudo
```pseudo
dac 리턴값 = (배열 가장 왼쪽 요소부터의 최대부분합, 배열의 최대부분합, 배열 가장 오른쪽 요소부터의 최대부분합, 배열 전체 요소의 합)
```

사실 구해야하는 것은 두번째 리턴값이지만, 네가지가 모두 필요한데 이유는 아래와 같다.

- pseudo
```pseudo
두개의 부분으로 쪼개진 A, B 배열이 순서대로 있다고 하고, 이 두 배열 합친 상태에서 최대부분합을 구한다고 해보자.
그리고 네가지 리턴값을 일단 (l, m, r, t) 라 해보자.

최대부분합 = max( A의 최대부분합, B의 최대부분합, A의 가장 오른쪽 요소부터의 최대부분합 + B의 가장 왼쪽 요소부터의 최대부분합 ) 이 되어야 한다.
즉 (A+B)m = max( Am, Bm, Ar + Bl ) 이다.

계산을 위해서는 r, l 도 구할 수 있어야 한다.

가장 오른쪽 요소부터의 최대부분합 = max ( A의 가장 오른쪽 요소부터의 최대부분합 + B 전체 요소의 합, R의 가장 오른쪽 요소부터의 최대부분합 )
즉 (A+B)r = max ( Ar + Bt, Br ) 이다.

비슷하게 생각하면
(A+B)l = max ( Al, At + Bl ) 이다.

이제는 t 도 알아야 하는데 간단하다.
(A+B)t = At + Bt 이다.
```

참고로 이 문제는 동적 계획법의 일종인 카데인 알고리즘으로도 풀 수 있는 문제다. 별도 포스팅을 참고하기 바란다.