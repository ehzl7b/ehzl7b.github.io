---
title: "동적 계획법 카데인 알고리즘 (Kadane Algorithm)"
description: "어떤 배열에서 연속된 수들로 구한 부분합 중 가장 큰 부분합을 구하는 동적 계획법 알고리즘인 카데인 알고리즘"
updated: "2024-12-22"
---

## 카데인 알고리즘 (Kadane Algorithm)

주어진 배열에서, 연속된 요소들로 이뤄진 부분합들을 구한다고 했을 때, 가장 큰 부분합을 구할 수 있는 효율적인 알고리즘이다.

일종의 동적 계획법으로, 아래와 같은 초기값과 일반항을 가진다.

- pseudo
```pseudo
# A 배열에서, 인덱스 0 ~ n 까지의 최대 부분합을 f(n) 라 할 때...

초기값 : f(0) = A[0]
일반항 : f(n) = max( f(n-1) + A[n], A[n] )
```

인덱스 n-1 까지의 최대 부분합이 f(n-1) 이므로, 여기에 A[n] 을 더한 값이 최대부분합인지, 아니면 A[n] 단독만으로 최대부분합이 되는지를 판별하는 셈이다.

## leetcode:

[https://leetcode.com/problems/maximum-subarray/](https://leetcode.com/problems/maximum-subarray/)

주어진 nums 배열에서, 연속된 요소들로 이뤄진 부분합들 중 최대 부분합을 구하는 문제다.

- rust, iterative DP (Kadane algorithm)
```rust
use std::cmp::max;

impl Solution {
    pub fn max_sub_array(nums: Vec<i32>) -> i32 {
        let mut a = vec![0; nums.len()];
        a[0] = nums[0];

        for (i, &x) in (1..).zip(&nums[1..]) {
            a[i] = max(a[i-1] + x, x);
        }

        return *a.iter().max().unwrap();
    }
}
```

인덱스 0 ~ n 까지의 최대 부분합을 저장하기 위한 저장소로 a 벡터를 상정했다. 초기값을 주고, 일반항을 이용해 반복하면 된다.

사실 이 문제는 "분할 정복" 이라는 알고리즘으로도 풀어낼 수 있는데, 다른 포스팅을 참고해보기 바란다.