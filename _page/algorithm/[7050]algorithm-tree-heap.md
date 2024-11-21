---
layout: "page"
title: "트리(Tree) - 힙(Heap) 자료구조"
description: "이진 트리를 응용한 힙 자료구조 소개"
updated: "2024-06-19"
---

## 힙(Heap) 자료구조

[나무위키](https://namu.wiki/w/%ED%9E%99%20%ED%8A%B8%EB%A6%AC)에 잘 설명이 되어 있다.

이진 트리 구조를 응용하여, 위/아래 노드의 순서를 보장하는 구조를 만들어낸 것이 핵심이다. 잘 보면 좌/우 노드는 순서를 보장하지 않는다. 우선순위 Queue, Heap 정렬 등에 사용되는 알고리즘이다.

사실 개념적인 형태는 이진트리지만 실제 구현에 사용되는 자료구조는 배열이다. 일정한 수학 공식으로 노드를 넘나들 수 있기 때문에 속도가 빠른 배열을 이용하는 듯 하다. 그럼에도 여기서는 이진 트리의 특수한 구조로 보기로 한다.

## 프로그래머스: 더 맵게

[https://school.programmers.co.kr/learn/courses/30/lessons/42626](https://school.programmers.co.kr/learn/courses/30/lessons/42626)

매운맛을 나타내는 스코빌 지수 배열이 있을 때, 스코빌 지수가 가장 낮은 값과, 그 다음으로 낮은 값을 조합하여, 다시 배열에 넣는 작업을 반복한다.

배열의 모든 요소들이 K 이상을 달성할 수 있다면, 몇번의 조합으로 가능한지를 구하는 문제다.

이 문제를 시간초과없이 구하려면 힙 자료구조를 이용해야 하며, 아래는 heap 자료구조를 javascript로 구현해본 코드다. (python으로는 직접구현하면 아무리해도 시간초과를 피할 수 없었기에 javascript로 풀었다.)

- javascript
```js
class Heap {
    constructor() {
        this.heap = [null] // index 0 is not used
    }
    
    push(v) {
        this.heap.push(v)
        let i = this.heap.length - 1
        
        while (true) {
            let p = ~~(i / 2)
            if (1 < i && this.heap[i] < this.heap[p]) {
                ;[this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]]
                i = p
            } else {
                break
            }
        }
    }
    
    pop() {
        if (this.heap.length < 2) return undefined
        
        let top = this.heap[1]
        this.heap[1] = this.heap[this.heap.length-1]
        this.heap.length -= 1
        let i = 1
        
        while (true) {
            let c = i * 2
            c = (c+1 < this.heap.length && this.heap[c+1] < this.heap[c]) ? c+1 : c
            
            if (c < this.heap.length && this.heap[c] < this.heap[i]) {
                ;[this.heap[i], this.heap[c]] = [this.heap[c], this.heap[i]]
                i = c
            } else {
                break
            }
        }
        
        return top
    }
}
```

위에서 언급한 [나무위키](https://namu.wiki/w/%ED%9E%99%20%ED%8A%B8%EB%A6%AC) 내용을 보고 구현하였다. (편의상 작은 값이 최상위로 오도록 했다.) 나무위키 내용과는 다소 다른 코드지만 알고리즘은 동일하다.

프로그래머스 문제풀이는 아래와 같다. 위 코드에 이어서 붙이면 된다.

- javascript
```js
function solution(scoville, K) {
    let h = new Heap()
    for (let x of scoville) {
        h.push(x)
    }
    
    let a = 0
    while (true) {
        let v1 = h.pop()
        if (v1 === undefined) return -1
        if (K <= v1) return a
        
        let v2 = h.pop()
        if (v2 === undefined) return -1
        
        a += 1
        h.push(v1 + v2*2)
    }
}
```

Heap 클래스의 인스턴트 h 를 생성하고, 주어진 값들을 h 에 푸시한다.

이후 while 반복문을 통해, 문제에서 요구하는대로 v1, v2 값들을 추출하여 조합을 하고 다시 푸시한다. 중간중간에 if 문으로 무한반복문을 탈출 할 수 있는 조건을 붙여줬다.

참고로 python이 기본제공하면서 힙 자료구조를 구현해주는 heapq 라이브러리를 사용하면 문제를 통과할 수 있다.

- python
```py
from heapq import heapify, heappush, heappop

def solution(scoville, K):
    heapify(scoville)
    
    i = 0
    while 1:
        if not scoville:
            return -1
        p = heappop(scoville)
        if K <= p:
            return i
        
        if not scoville:
            return -1
        q = heappop(scoville)
        
        heappush(scoville, p + q*2)
        i += 1
```
