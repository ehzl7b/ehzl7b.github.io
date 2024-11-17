---
layout: "page"
title: "트리(Tree) - 너비우선탐색(Breadth First Search)과 깊이우선탐색(Depth First Search)"
description: "최상위 노드로부터 시작하여, 각 노드를 탐색하는 가장 대표적인 두가지 방식 소개"
updated: "2024-06-23"
---

## BFS 와 DFS

[나무위키](https://namu.wiki/w/%EB%84%88%EB%B9%84%20%EC%9A%B0%EC%84%A0%20%ED%83%90%EC%83%89)를 보면, 트리 구조에서 너비우선탐색(BFS, Breadth First Search)과 깊이우선탐색(DFS, Depth First Search)의 탐색 순서가 어떻게 다른지 쉽게 이해할 수 있다.

보통 BFS 는 큐 자료구조를, DFS 는 스택 자료구조를 사용하여 탐색한다.

## Leetcode: 101. Symmetric Tree

[https://leetcode.com/problems/symmetric-tree](https://leetcode.com/problems/symmetric-tree)

주어진 이진트리가 있을 때, Root 를 중심으로 좌우대칭이 되는지 판별하여 리턴하는 문제다.

BFS 또는 DFS 방식으로, 좌우 노드들을 동시에 탐색하면서, 자식 노드들의 위치와 그 값이 대칭이 되는지를 살펴보면 된다.

아래는 iterative BFS 방식의 코드다.

- python
```py
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        qu = [(root.left, root.right)]

        while qu:
            l, r = qu.pop(0)
            if l and r:
                if l.val != r.val:
                    return False
                else:
                    qu += [(l.left, r.right), (l.right, r.left)]
            elif l or r:
                return False

      return True
```

큐 자료구조로 사용할 qu 리스트를 생성하여, 초기값으로 대칭이 되어야 할 좌/우 자식노드를 튜플 쌍으로 삽입하였다.

대칭적이어야 할 자식노드 쌍이, 자식노드가 모두 있는 경우에는 그 값이 다를 경우, 자식노드가 한쪽만 있는 경우에 대칭이 아님을 리턴한다.

참고로 iterative DFS 방식은, 위 코드에서 큐 자료구조 대신 스택 자료구조를 사용하면 된다. 실질적으로 `l, r = qu.pop(0)` 을 `l, r = qu.pop()` 으로 바꾸기만 하면된다.

DFS 는 recursive 하게 구현할 수도 있는데, 아래는 그 코드다.

- python
```py
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def f(l, r):
            if l and r:
                if l.val != r.val:
                    return False
                else:
                    return True and f(l.left, r.right) and f(l.right, r.left)
            elif l or r:
                return False
            else:
                return True

    return f(root.left, root.right)
```

재귀함수를 보면 노드쌍들이 대칭되는지 아닌지를 and 조건으로 연결하도록 되어 있다. 하나라도 False 가 있다면 전체 결과가 False 가 된다.

## 프로그래머스: 게임 맵 최단거리

[https://school.programmers.co.kr/learn/courses/30/lessons/1844](https://school.programmers.co.kr/learn/courses/30/lessons/1844)

주어진 미로에서 골까지 최단거리를 구해서 리턴하는 문제다. 보통 BFS 로 미로 탐색을 하면, 최단거리를 구할 수 있다.

- python
```py
def solution(maps):
    m = [[-x for x in rows] for rows in maps]
    
    qu = [(0, 0)]
    m[0][0] = 1
    
    while qu:
        y, x = qu.pop(0)
        for ny, nx in [(y-1, x), (y, x+1), (y+1, x), (y, x-1)]:
            if 0 <= ny < len(m) and 0 <= nx < len(m[0]) and m[ny][nx] == -1:
                qu += (ny, nx),
                m[ny][nx] = m[y][x] + 1
                
    return m[-1][-1]
```

미로를 나타내는 maps 리스트를 다소 변형하여, 1 이 아닌 -1 이 길을 나타내도록 하여 m 리스트에 저장했다. 새롭게 찾아내는 길의 스타트지점에서 거리를 정수로 나타내기 위해서, 그리고 어차피 골을 못찾는 미로는 -1 을 리턴하도록 요구하여 있어서 편의상 그렇게 변형한 것이다.

큐 자료구조를 나타내는 qu 리스트에 스타트지점인 좌상단의 좌표를 튜플로 초기값으로 주고 while 반복문을 순환한다.

어떤 지점에서 상하좌우 네 군데로 갈 수 있으므로, for 반복문을 통해 상하좌우가 길이라면 다시 qu 리스트에 삽입하고, 길에 해당하는 지점의 거리를 현 지점의 거리 + 1 한다.
