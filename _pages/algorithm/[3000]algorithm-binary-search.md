---
layout: page
title: 이진 탐색(Binary Search)
description: 오름차순으로 정렬된 Data Set에서 원하는 Data를 빠른 속도로 탐색 구현
updated: 2024-05-23
---

## 이진 탐색

[나무위키](https://namu.wiki/w/%EC%9D%B4%EC%A7%84%20%ED%83%90%EC%83%89)를 보면 이진 탐색이 어떤식으로 특정 Data를 찾아가는지 쉽게 알 수 있다.

이진 탐색은 시간복잡도가 O(log n)으로, 처음부터 Data Set을 뒤져서 검색하는 방식보다 월등히 효율이 좋다. 다만, Data Set이 **오름차순으로 정렬**이 되어 있어야 한다. 이유는 조금만 생각하면 알 수 있다.

## 알고리즘

이해는 쉽지만 코드 구현이 다소 까다롭다. 아래와 같이 하면 된다.

- pseudo
```pseudo
# 오름차순 정렬된 A 배열에서 특정값 x를 찾는다고 할 때...

1: i = 0, j = len(A)              # i, j는 A 배열을 가리키는 인덱스, i 이상 ~ j 미만 사이에 x가 있다고 가정
2: m = i + Trunc((j-i) / 2)       # m은 i, j 사이의 중간 인덱스, (j-i) / 2의 결과에서 소수점 이하는 버림
3: A[m] < x 라면 i = m+1          # A의 m 인덱스의 값과 x를 비교, x가 크다면 m 포함하여 보다 왼쪽에 있는 모든 값들은 버려도 되므로 i를 m+1 위치로 끌어올림
4: x <= A[m] 라면 j = m           # 3행이 아니라면 m 포함하여 보다 오른쪽에 있는 모든 값들은 버려도 되므로 j를 m 위치로 끌어내림
5: i == j 될때까지 3 ~ 4행 반복   # 해보면 알겠지만 반드시 i == j 되는 시점이 등장하며, 이때 반복 종료
6: A[i] == x 라면 찾기 완료, A != [x] 라면 찾는값 없음
```

## Leetcode: 35. Search Insert Position

[https://leetcode.com/problems/search-insert-position](https://leetcode.com/problems/search-insert-position)

오름차순으로 정렬된 배열 nums와 정수 target이 주어질 때, 오름차순을 해치지 않게 target이 nums의 어느 인덱스에 들어갈 수 있는지를 찾는 문제다.

- python
```python
def searchInsert(self, nums: List[int], target: int) -> int:
    i, j = 0, len(nums)

    while i < j:
        m = i + (j - i) // 2
        if nums[m] < target:
            i = m + 1
        else:
            j = m

    return i
```

- rust
```rust
pub fn search_insert(nums: Vec<i32>, target: i32) -> i32 {
    let (mut i, mut j) = (0, nums.len());

    while i < j {
        let m = i + (j - i) / 2;
        if nums[m] < target {
            i = m + 1;
        } else {
            j = m;
        }
    }

    return i as _;
}
```
