---
layout: page
title: 동적 계획법(Dynamic Programming) - 카데인 알고리즘(Kadane's Algorithm)
description: 어떤 배열에서 연속 합이 가장 큰 부분합을 구할 때 사용하는 알고리즘 소개
updated: 2024-06-17
---

## Leetcode: 53. Maximum Subarray

[https://leetcode.com/problems/maximum-subarray](https://leetcode.com/problems/maximum-subarray)

숫자를 요소로 가지는 어떤 배열이 주어졌을 때, 연속 합이 가장 큰 부분합을 구하는 문제다.

DP의 일종으로, 수학의 점화식과 같이 풀면 된다. 초기값과 일반항은 아래와 같다.

- pseudo
```pseudo
# 어떤 배열 arr 에서 i 인덱스까지의 최대 부분합을 sub[i]라 할 때...

초기값: sub[0] = arr[0]
일반항: sub[i] = max(sub[i], sub[i] + arr[i-1])
```

i-1 인덱스까지의 최대 부분합에서, i 인덱스를 더한 값과 i 인덱스의 자체값을 비교하는 것이 핵심이다.

아래는 풀이다.

- javascript
```js
var maxSubArray = function(nums) {
    let a = Array(nums.length).fill(0)
    a[0] = nums[0]

    for (let i=1; i < nums.length; i++) {
        a[i] = Math.max(nums[i], nums[i] + a[i-1])
    }

    return Math.max(...a)
}
```

a 배열은 i 인덱스까지의 최대 부분합들이 모여있는 배열이므로, 이 중에서 최대값을 리턴하면 된다.

참고로 이 문제는, 분할정복 방식으로도 풀 수 있는데, 궁금하다면 [다른 포스팅](/page/algorithm-divide-and-conquer)을 참고해보자.