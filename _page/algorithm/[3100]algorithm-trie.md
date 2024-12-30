---
title: "트라이 (Trie) 자료구조"
description: "문자열 자동완성을 효율적으로 작동하도록 하는 트라이 자료구조"
updated: "2024-12-30"
---

## 트라이 (Trie)

[나무위키](https://namu.wiki/w/%ED%8A%B8%EB%9D%BC%EC%9D%B4)를 먼저 보면 기초적인 내용을 알 수 있다.

문자열 안에 있는 글자 하나하나가 노드가 되고, 문자열을 이룬 글자들이 노드 형태로 연결된 형태의 자료구조이다. 검색 자동완성 기능에 사용되는 기초적인 자료구조다.

노드는 아래처럼 최소한 어떤 문자열의 끝부분인지를 나타내는 속성과 뒤이어질 노드들을 담는 속성으로 구성된다.

- javascript, TrieNode example
```js
class TrieNode {
  end = false;
  children = {};
}
```

## leetcode: 14. Longest Common Prefix

[https://leetcode.com/problems/longest-common-prefix/](https://leetcode.com/problems/longest-common-prefix/)

문자열들로 이뤄진 strs 배열이 주어졌을 때, 이 문자열들의 앞에서부터 공통된 글자들이 어디까지인지를 찾아서 리턴하는 문제다.

첫번째 문자열과 다른 문자열을 비교하는 방법, python 의 zip 과 같은 함수로 문자열들의 앞글자들을 하나하나씩 가져와서 비교하는 방법 등을 사용할 수도 있으나, 트라이 자료구조를 사용할 수도 있다.

- javascript, Trie
```js
class TrieNode {
  end = false;
  children = {};
}

class Trie {
  #trie = new TrieNode();

  static from = (...strs) => {
    let t = new this;
    for (let str of strs) t.insert(str);

    return t;
  };

  insert = (str) => {
    let n = this.#trie;
    for (let x of str) {
      if (!(x in n.children)) n.children[x] = new TrieNode();
      n = n.children[x];
    }
    n.end = true;
  };

  findCommonPrefix = () => {
    let a = "";
    let n = this.#trie;
    
    while (!n.end && Object.keys(n.children).length === 1) {
      a += Object.keys(n.children)[0];
      n = n.children[a.at(-1)];
    }

    return a;
  };
}

let longestCommonPrefix = (strs) => {
  let trie = Trie.from(...strs);
  return trie.findCommonPrefix();
};
```

TrieNode 클래스는 앞절에서 언급한 Trie 자료구조를 위한 노드를 나타내고, Trie 클래스는 이 노드를 활용하여 트라이 자료구조 자체를 만들어내는 클래스다.

insert 메서드는 문자열을 받아서 트라이 자료구조를 만드는 핵심코드다. 주어진 문자열이 끝날 때까지, 자식노드에 해당 글자가 없다면 노드를 생성하면서 계속 내려간다. 문자열이 끝나면 end 속성에 true 를 붙여주어 어떤 문자열이 여기서 끝났음을 나타내준다.

findCommonPrefix 는 문제 풀이를 위한 메서드로, 어떤 문자열의 끝부분이 아니면서, 자식 노드가 1 개인 경우 (즉 공통 글자인 경우) 만을 취합하여 리턴하도록 되어 있다.