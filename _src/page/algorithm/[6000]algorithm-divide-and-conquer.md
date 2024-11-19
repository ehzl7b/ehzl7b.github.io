---
layout: "page"
title: "분할 정복(Divide and Conquer) - 개요"
description: "분할 정복 알고리즘 소개"
updated: "2024-06-17"
---

## 분할 정복

[나무위키](https://namu.wiki/w/%EB%B6%84%ED%95%A0%20%EC%A0%95%EB%B3%B5%20%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)를 봐도 잘 이해가 되지않는다. 분할 정복(DAC, Divide and Conquer) 방식으로 짠 코드를 직접 보는 것이 이해가 더 빠를 것이다.

어떤 문제를 해결할 때, 보다 더 작은 단위를 가지고 같은 방식으로 해결할 수 있고, 이들의 결과를 묶어서 큰 문제를 해결할 수 있을 때 사용할 수 있는 알고리즘으로 이해되었다.

따라서 코드는 보통 재귀 방식으로 구성하되, 가장 작은 단위에 대한 리턴 구문, 그렇지 않은 단위를 둘로 쪼깨서 재귀호출하는 구문, 두개의 호출 결과를 조합하여 리턴하는 구문을 포함해야 한다.

## Leetcode: 53. Maximum Subarray

[https://leetcode.com/problems/maximum-subarray](https://leetcode.com/problems/maximum-subarray)

숫자를 요소로 가지는 어떤 배열이 주어졌을 때, 연속 합이 가장 큰 부분합을 구하는 문제다.

DP 방식으로 풀어내는 방식이 가장 일반적([별도 포스팅](/page/dynamic-programming-kadane-algorithm) 참고)이지만 DAC로도 풀 수 있다.

- python
```py
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        def dac(arr):
            if len(arr) == 1:
                return arr[0], arr[0], arr[0], arr[0]
            
            m = len(arr)//2
            ll, lm, lr, lt = dac(arr[:m])
            rl, rm, rr, rt = dac(arr[m:])

            return max(ll, lt+rl), max(lm, lr+rl, rm), max(lr+rt, rr), lt+rt
        
        return dac(nums)[1]
```

위 코드가 어떻게 최대 부분합을 구할 수 있는지 이해하려면 다소 까다로운데, 아래와 같이 생각해볼 수 있다.

어떤 배열이 있을 때, 아래와 같은 4가지 정보를 구한다고 해보자.

- pseudo
```pseudo
# A 배열 [a1, a2, a3, ... , an-1, an]

1: 가장 왼쪽 원소를 포함하는 최대 부분합 (즉, a1 부터 순차적으로 합산했을 때의 최대값)
2: A 배열의 최대 부분합 (즉, A 배열안에서 연속된 원소들의 부분합 중 최대값)
3: 가장 오른쪽 원소를 포함하는 최대 부분합 (즉, 중간 어딘가부터 시작하여 an 까지 합산했을 때의 최대값)
4: A 배열 전체 합계값 (즉, a1 부터 an 까지 합계)
```

이젠 A 배열과 B 배열이 있을 때, A 와 B 의 위 4가지 정보를 아는 상황에서 A와 B를 연결한 새로운 배열의 4가지 정보는 아래와 같다.

- pseudo
```pseudo
# A와 B 배열을 연결한 배열 [a1, a2, a3, ... , an-1, an], [b1, b2, b3, ... , bn-1, bn]

1: 연결배열의 가장 왼쪽 원소를 포함하는 최대 부분합은, max(A 배열의 가장 왼쪽 원소 포함 최대 부분합, A 전체 합계 + B 배열의 가장 왼쪽 원소 포함 최대 부분합)
2: 연결배열의 최대 부분합은 max(A 배열의 최대 부분합, B 배열의 최대 부분합, A 배열의 가장 오른쪽 원소 포함 최대 부분합 + B 배열의 가장 왼쪽 원소 포함 최대 부분합)
3: 연결배열의 가장 오른쪽 원소를 포함하는 최대 부분합은, max(A 배열의 가장 오른쪽 원소 포함 최대 부분합 + B 전체 합계, B 배열의 가장 오른쪽 원소 포함 최대 부분합)
4: 연결배열의 전체 합계값, A 배열의 합계 + B 배열의 합계
```

위에서 2번 항목에 대한 값을 최종적으로 찾아내면 된다. (누가 생각했는지 정말 기발했다.)