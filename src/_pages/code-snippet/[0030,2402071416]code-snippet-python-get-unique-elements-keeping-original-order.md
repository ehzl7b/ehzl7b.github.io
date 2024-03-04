---
title: "Python 리스트에서 Index 순서를 유지하면서 중복없는 고유한 요소만 남기기"
description: "리스트 각 요소를 체크하여 중복을 없애고 고유한 요소만 남기되, 기존 요소들의 인덱스 순서를 그대로 유지하는 방법"
updated: 2021-09-07
---

## 중복 없애고 고유한 요소만 남기기
 
Python 에서, 어떤 리스트가 있을 때, 중복요소들을 모두 없애고 고유한 요소만 골라내거나 남기고 싶을 때, 리스트를 set 자료형으로 변환하였다가 다시 리스트로 환원하는 방법을 사용할 수 있다. 중복요소를 허용하지않는 set 자료형의 특성을 응용한 것이다.

- python
```python
def get_unique_element(arr):
    return list(set(arr))
```

간편하지만 다소 문제가 있는데, **리스트 요소들의 원래 인덱스 순서가 그대로 유지됨을 보장하지는 않는다**는 것이다. [Python 공식문서](https://docs.python.org/ko/3.9/library/stdtypes.html#set-types-set-frozenset) 에서 set 자료형 부분을 살펴보면, "집합은 원소의 위치나 삽입 순서를 기록하지 않습니다" 라고 쓰여있다.

## 기존 인덱스 순서를 유지하면서, 고유한 요소만 남기기

[stackoverflow](https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates) 에서 방법을 찾아낼 수 있었다. Javascript 코드이지만 Python 으로도 충분히 구현할 수 있다.

- python
```python
def get_unique_element(arr):
    return [x for i, x in enumerate(arr) if arr.index(x) == i]
```

arr 리스트를 x 로 순회하면서, 요소 x 의 인덱스인 i 가 index 함수로 찾아낸 인덱스와 일치하는 경우만 골라낸다. 만일 일치하지 않는다면, 해당 x 요소값은 이미 어딘가 앞에서 한번 등장했었다라는 의미가 되므로 중복요소인 셈이다. 아래와 같이 이해할 수 있다.

- pseudo
```pseudo
arr = [1, 3, 5, 7, 9, 3, 4, 2]
          Ʌ           Ʌ
          |           |
          |           # 이 요소를 순회할 때, x == 3, i == 5 이지만...
          |            
          # arr.index(3) == 1 이므로, arr.index(x) != i 가 된다.
```

참고로 이 인덱스 순서 유지 코드의 실행속도는 **set 활용 코드보다 상당히 느리다.**
