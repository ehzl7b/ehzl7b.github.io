---
title: "이진 탐색 (Binary Search)"
description: "오름차순으로 정렬된 배열 안에서, 특정 값을 찾는 가장 효율적인 알고리즘"
updated: "2024-12-21"
---

## 이진 탐색 (Binary Search)

[나무위키](https://namu.wiki/w/%EC%9D%B4%EC%A7%84%20%ED%83%90%EC%83%89)를 들어가서 그림만 봐도 이진 탐색 알고리즘 원리를 쉽게 알 수 있다.

이 알고리즘을 사용하기 위해서는 요소들이 반드시 오름차순으로 되어 있어야 하는 이유도 알 수 있을 것이다.

다만, 의사코드로 구현하는 것이 다소 까다로운데, 아래와 같이 하면 된다.

- pseudo
```pseudo
1: 오름차순 정렬된 A 배열이 있을 때, 요소들의 가장 왼쪽 인덱스를 i, 가장 오른쪽 인덱스 + 1 을 j 로 지정 (유효 범위가 i 이상 j 미만이라는 의미)
2: i < j 이면 아래를 반복
   2.1: 중간 인덱스 m = i + (j-i) / 2 를 구하고 소수점 아래를 버림
   2.2: 중간 인덱스에 해당하는 값 < 찾는 값 이면, 중간 인덱스를 포함하여 보다 왼쪽에 있는 값을 모두 버려도 되므로, i = m + 1 으로 설정
   2.3: 찾는 값 < 중간 인덱스에 해당하는 값 이면, 중간 인덱스를 포함하여 보다 오른쪽에 있는 값을 모두 버려도 되므로, j = m 으로 설정
   2.4: 찾는 값 = 중간 인덱스 값 이면, 값을 찾았으므로 알고리즘 종료
3: 반복문 수행 중, 2.4 를 만족하지 못하면 반드시 i == j 가 되는 순간이 오고 이 때 반복문은 종료됨
4: 이 때의 i 또는 j 인덱스는, 해당 인덱스에 찾는 값이 들어가도 오름차순이 자연스럽게 유지가 되는 인덱스임
```

## leetcode: 35. Search Insert Position

[(https://leetcode.com/problems/search-insert-position/](https://leetcode.com/problems/search-insert-position/)

오름차순으로 정렬된 nums 배열이 주어질 때, 오름차순을 유지한 채로 target 이 들어갈 수 있는 인덱스를 찾는 문제다.

이진 탐색을 이용하여, target 의 위치를 찾을 수 있다.

- javascript
```js
let searchInsert = (nums, target) => {
  let [i, j] = [0, nums.length];

  while (i < j) {
    let m = i + (j-i)/2 | 0;
    if (nums[m] < target) {
      i = m+1;
    } else {
      j = m;
    }
  }

  return i;
};
```