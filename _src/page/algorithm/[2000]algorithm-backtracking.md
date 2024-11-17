---
layout: "algorithm"
title: "백트래킹(Backtracking)"
description: "모든 경우의 수를 탐색하는 백트래킹 알고리즘 문제풀이"
updated: "2024-07-21"
---

## 백트래킹

[나무위키](https://namu.wiki/w/%EB%B0%B1%ED%8A%B8%EB%9E%98%ED%82%B9)를 보면 백트래킹에 대한 설명이 잘 되어 있다.

## leetcode: 22. Generate Parentheses

[https://leetcode.com/problems/generate-parentheses](https://leetcode.com/problems/generate-parentheses)

"(" 과 ")" 문자가 각각 n 개씩 주어질 때, 주어진 괄호 문자를 모두 사용하여, 올바른 괄호쌍을 만들어내는 경우의 수를 모두 찾아 리턴하는 문제다.

먼저 아래와 같은 풀이를 생각할 수 있다.

- note
> - n === 1 일 때는 무조건 "()" 이 된다.
> - "()" 문자열에 0 ~ n+1 인덱스마다 "()"를 삽입한다.
> - 삽입을 하면 "()()", "(())", "()()" 문자열이 만들어지는데, 중복은 제거한다.
> - "()()", "(())" 각각의 문자열에 0 ~ n+1 인덱스마다 "()" 삽입하는 것을 반복한다.

- javascript
```js
let generateParenthesis = (n) => {
    let a = ["()"];
    for (let i=2; i <= n; i++) {
        let b = new Set();
        for (let x of a) {
            for (let j=0; j <= i; j++) {
                b.add(x.slice(0, j) + "()" + x.slice(j));
            }
        }
        a = [...b.values()];
    }
    return a;
};
```

for 반복문이 세번 사용되었다. 첫번째 for 는 n 번까지 순회하기 위함이고, 두번째 for 는 n-1 번째 순회로 만들어진 각 문자열들을 순회하기 위함이며, 세번째 for 는 문자열 사이마다 "()" 를 넣기위함이다.

두번째 풀이방식은 BFS 또는 DFS 를 이용하며, 아래와 같다.

- note
> - 빈 문자열 "" 에서 시작하고, 각각 n 개씩 "(", ")" 문자를 준비하여, 스택(or 큐)를 준비한다.
> - "(" 문자 개수가 n 보다 작다면 "(" 를 추가하여 스택(or 큐)에 삽입한다.
> - ")" 문자 개수가 "(" 문자 개수보다 작다면 ")" 를 추가하여 스택(or 큐)에 삽입한다.
> - "(", ")" 문자 개수가 모두 n 개가 될 때, 해당 문자열을 하나의 완성된 문자열로 본다.

- javascript
```js
let generateParenthesis = (n) => {
    let g = function* (x=n, y=n, c="") {
        if (0 < x) yield* g(x-1, y, c+"(");
        if (x < y) yield* g(x, y-1, c+")");
        if (0 === x && x === y) yield c;
    };
    return [...g()];
};
```

generator 문법을 사용하였다. 그리고 괄호 개수를 n 개부터 시작해서 차감하는 식으로 구하고 있다.