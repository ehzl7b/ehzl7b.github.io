export default global = {
  site: {
    title: "어즐 블로그",  
    cats: [
      {cat: "/page/aa", permalink: "/cat/aa/", icon: "O", title: "AA 카테고리", reverse: false},
      {cat: "/page/bb", permalink: "/cat/bb/", icon: "X", title: "BB 카테고리", reverse: true},
      {cat: "/page/cc", permalink: "/cat/cc/", icon: "Z", title: "CC 카테고리", reverse: false},
    ],
  },
  // default
  layout: "test",
  permalink: "/page/{{ name | remove_label }}/",
  content: "",
};