---
layout: "page"
title: "트리(Tree) - 이진 트리(Binary Tree)"
description: "이진 트리와 전위, 중위, 후위 탐색 코드"
updated: "2024-06-19"
---

## 이진 트리

[나무위키](https://namu.wiki/w/%ED%8A%B8%EB%A6%AC(%EA%B7%B8%EB%9E%98%ED%94%84)#s-4.1) 또는 [위키피디아](https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%A7%84_%ED%8A%B8%EB%A6%AC)를 보면 이진 트리가 무엇인지 쉽게 알 수 있다.

노드들을 부모-자식 관계로 연결하되, 자식의 수가 2를 넘지 않는 트리 구조가 이진 트리다.

## Leetcode: 94. Binary Tree Inorder Traversal

[https://leetcode.com/problems/binary-tree-inorder-traversal](https://leetcode.com/problems/binary-tree-inorder-traversal)

주어지는 이진 트리를 중위 탐색으로 순서대로 탐색하여, 그 결과를 배열로 리턴하는 문제다.

중위 탐색 일반적인 코드는 아래와 같다.

- python
```py
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        a = []

        def f(n):
            if n:
                f(n.left)
                a.append(n.val)
                f(n.right)

        f(root)
        return a
```

재귀호출 방식이다. if 구문 안에있는 a.append(n.val) 위치가 f(n.left) 에 오면 전위, f(n.left) 와 f(n.right) 가운데 오면 중위, f(n.right) 아래에 오면 후위 탐색이 된다.

이 문제 다른 풀이를 보면 아래와 같이 기발하게 풀어낸 코드도 있었다.

- python
```py
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        return [*self.inorderTraversal(root.left), root.val, *self.inorderTraversal(root.right)] if root else []
```

iterative 방식으로 풀 수도 있다.

- python
```py
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        a = []
        st = [(root, False)]

        while st:
            n, v = st.pop()
            if n:
                if v:
                    a.append(n.val)
                else:
                    st.extend([(n.right, False), (n, True), (n.left, False)])
        
        return a
```

가장 주의해야 할 것은, 스택을 나타내는 st 리스트에 노드들을 담을 때, right 가 left 보다 먼저 담기는 것에 주의해야 한다. 후입선출의 원리를 생각하면 쉽게 이해가 된다.