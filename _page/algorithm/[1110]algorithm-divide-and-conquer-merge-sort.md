---
title: "분할 정복 병합 정렬 (Merge Sort)"
description: "분할 정복을 사용하는 정렬 알고리즘"
updated: "2024-12-23"
---

## 병합 정렬 (Merge Sort)

[위키피디아](https://ko.wikipedia.org/wiki/%ED%95%A9%EB%B3%91_%EC%A0%95%EB%A0%AC)에 들어가서, 정렬이 되는 움짤을 보면 알 수 있다.

분할 정복 알고리즘을 사용한 정렬 방식이다.

## leetcode: 912. Sort an Array

[https://leetcode.com/problems/sort-an-array/description/](https://leetcode.com/problems/sort-an-array/description/)

주어지는 nums 배열을 정렬하는 문제다.

- rust, divide and conquer, merge sort
```rust
fn merge_sort (a: &mut [i32]) {
    if a.len() == 1 {
        return;
    }

    let m = a.len() / 2;
    merge_sort(&mut a[..m]);
    merge_sort(&mut a[m..]);
    
    let mut l = (&a[..m]).to_vec().into_iter().peekable();
    let mut r = (&a[m..]).to_vec().into_iter().peekable();

    for i in 0..a.len() {
        match (l.peek(), r.peek()) {
            (Some(x), Some(y)) => {
                a[i] = if x <= y { l.next().unwrap() } else { r.next().unwrap() };
            },
            (Some(x), None) => {
                a[i] = l.next().unwrap();
            },
            (None, Some(y)) => {
                a[i] = r.next().unwrap();
            },
            (_, _) => {
                unreachable!();
            },
        }
    }
}

impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        merge_sort(&mut nums);
        return nums;
    }
}
```

배열을 잘게 나눈 뒤, 잘게 나눠진 배열끼리 정렬하여 조립하는 방식이다.