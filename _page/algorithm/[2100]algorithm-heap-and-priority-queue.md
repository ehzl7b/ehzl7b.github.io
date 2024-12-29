---
title: "힙 (Heap) 자료구조와 우선순위 큐 (Priority Queue)"
description: "힙 자료구조와 이를 응용한 우선순위 큐 코드 구현"
updated: "2024-12-29"
---

## 힙 (Heap) 자료구조

[나무위키](https://namu.wiki/w/%ED%9E%99%20%ED%8A%B8%EB%A6%AC) 를 보면 힙 자료구조에 대해 쉽게 알 수 있다.

이진 트리 구조인데, 부모와 자식노드 간에 정렬(오름차순 또는 내림차순)이 보장되도록 구현한 트리이다.

개념은 이진 트리이지만, 이를 배열로 구현할 수 있다는 것도 재밌는 점이다. 부모와 자식 노드간에 아래와 같은 일정한 규칙이 있기 때문이며, 이를 배열의 인덱스로 접근하면 되기 때문이다.

- note
```pseudo
부모 노드의 값 > 자식 노드의 값을 보장하는 "최대 힙"을 구현한다고 했을 때...

1. 최상단 노드의 인덱스는 1
2. 부모노드의 인덱스 = Math.trunc(자식노드 인덱스 / 2)
3. 왼쪽 자식노드의 인덱스 = 부모노드 인덱스 * 2
4. 오른쪽 자식노드의 인덱스 = 부모노드 인덱스 * 2 + 1
```

우선순위 큐는, 어떤 순서로 값들을 넣든 간에, pop 할 때는 정렬된 순서로 값들이 나오도록 구현하면 된다. push 또는 pop 할 때마다, 큐 안의 내용이 정렬이 되도록 만들면 되며, 힙 자료구조를 보통 이용한다.

## leetcode: 1046. Last Stone Weight

[https://leetcode.com/problems/last-stone-weight/description/](https://leetcode.com/problems/last-stone-weight/description/)

무게가 제각각인 돌들의 무게들로 배열이 주어지고, 이 배열에서 무게가 무거운 두개의 돌을 꺼낸뒤, 돌을 부딪힌다.

돌을 부딪히면 두 돌의 무게차이만큼의 돌 하나가 남고(무게가 같다면 남는 것이 없고), 돌이 남았다면 이를 다시 배열에 넣는다.

계속 부딪히다보면, 돌이 안남게 되거나 하나만 남게 되는데, 돌이 안남았다면 0 을, 돌이 하나 남았다면 이 돌의 무게를 리턴하는 문제다.

- javascript, Max Heap
```js
class MaxHeap {
  static from(arr) {
    let heap = new this();
    for (let x of arr) {
      heap.push(x);
    }
    return heap;
  }
  constructor() {
    this.h = [null];
  }
  push(x) {
    this.h.push(x);

    let n = this.h.length - 1;
    while (true) {
      let p = n / 2 | 0;
      if (!(p < 1) && this.h[p] < this.h[n]) {
        [this.h[p], this.h[n]] = [this.h[n], this.h[p]];
        n = p;
      } else {
        break;
      }
    }
  }
  pop(x) {
    if (this.h.length === 1) return null;
    if (this.h.length === 2) return this.h.pop();

    let t = this.h[1];
    this.h[1] = this.h.pop();
    
    let n = 1;
    while (true) {
      let c = n * 2;
      if (c+1 < this.h.length && this.h[c] < this.h[c+1]) c = c+1;
      if (c < this.h.length && this.h[n] < this.h[c]) {
        [this.h[n], this.h[c]] = [this.h[c], this.h[n]];
        n = c;
      } else {
        break;
      }
    }

    return t;
  }
  get length() {
    return this.h.length - 1;
  }
}

let lastStoneWeight = (stones) => {
  let h = MaxHeap.from(stones);

  while (h.length > 1) {
    let [a, b] = [h.pop(), h.pop()];
    if (a-b !== 0) h.push(a-b);
  }

  return (h.length === 1) ? h.pop() : 0;
};
```

javascript 는 빌트인으로 힙 또는 우선순위 큐 콜렉션을 지원하지 않는다. 외부 모듈을 사용하거나 직접 구현해야 한다.

class 문법으로 "최대 힙" 을 구현하였고, 이 안에 가장 핵심함수인 push, pop 함수도 구현되어 있다.

push 를 하게 되면, 기초가 되는 h 배열 가장 뒤에 값을 넣고, 부모노드와 크기를 비교해가면서 값을 위치시킨다.

pop 을 하게 되면, 1번 노드 값을 리턴하고, 그 전에 가장 마지막 노드에 있는 값을 1 번 노드로 가지고 와서, 자식 노드와 값을 비교해가면서 값을 위치시킨다.

lastStoneWeight 함수에서는 문제에서 요구한대로 2 개 돌을 pop 하여 부딪히고, 이를 다시 힙 자료구에 담는 작업을 반복하고, 마지막에 결과를 리턴하도록 했다.