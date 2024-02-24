---
title: "[Array] 이진 탐색"
description: "Array가 오름차순으로 정렬되어 있을 때, O(log n) 시간복잡도로 신속히 값을 검색하는 알고리즘"
updated: "2024-02-24"
---

## 현재 작성중인 문서입니다.

## 이진 탐색

Array 안의 특정값 검색 알고리즘으로, [나무위키](https://namu.wiki/w/%EC%9D%B4%EC%A7%84%20%ED%83%90%EC%83%89)에 있는 그림과 설명을 보면 어떤 원리인지 쉽게 이해가 된다. 사전에서 어떤 단어를 찾아보는 원리와 유사하다.

반드시 **Array 안의 요소들이 오름차순으로 정렬**이 되어 있어야 알고리즘이 의미가 있다.

## 알고리즘 구현

원리는 간단한데, 실제로 구현하려면 다소 까다로울 수 있다. 아래와 같이 구현하면 된다.

- pseudo
```pseudo
# 
```

## LeetCode - Search Insert Position 문제

LeetCode의 [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/description/) 문제는 이진 탐색 코드 자체를 구현해 보라는 문제로, 아래와 같이 풀 수 있다.

- rust
```rust
pub fn search_insert(nums: Vec<i32>, target: i32) -> i32 {
    let (mut i, mut j) = (0, nums.len());
    
    while i < j {
        let m = i + (j - i) / 2;
        match nums[m] {
            x if x < target => i = m + 1,
            _ => j = m,
        }
    }
    
    i as _
}
```
