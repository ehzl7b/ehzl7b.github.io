export default global = {
  site: {
    title: "어즐 블로그",  
    cats: [
      {cat: "/page/aa", permalink: "/cat/aa/", title: "AA 카테고리"},
      {cat: "/page/bb", permalink: "/cat/bb/", title: "BB 카테고리"},
      {cat: "/page/cc", permalink: "/cat/cc/", title: "CC 카테고리"},
    ],
  },
  // default
  layout: "test",
  permalink: "/page/{{ name | remove_label }}/",
  content: "",
};