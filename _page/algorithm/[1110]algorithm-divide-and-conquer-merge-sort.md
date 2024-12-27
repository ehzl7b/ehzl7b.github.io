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

- javascript, divide and conquer, merge sort
```js
let sort = (nums) => {
  if (nums.length === 1) return nums;

  let m = nums.length / 2 | 0;
  let left = sort(nums.slice(0, m));
  let right = sort(nums.slice(m));

  for (let l = 0, r = 0, i = 0; i < nums.length; i++) {
    if (l < left.length && r < right.length) {
      nums[i] = (left[l] < right[r]) ? left[l++] : right[r++];
    } else if (l < left.length) {
      nums[i] = left[l++];
    } else {
      nums[i] = right[r++];
    }
  }

  return nums;
};

let sortArray = (nums) => sort(nums);
```

배열을 잘게 나눈 뒤, 잘게 나눠진 배열끼리 정렬하여 조립하는 방식이다.