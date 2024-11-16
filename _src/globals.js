export default global = {
  site: {
    title: "어즐 블로그",  
    cats: [
      {cat: "/page/dev", permalink: "/cat/dev/", icon: "🖥️", title: "개발 노트", reverse: true},
    ],
  },
  // default
  layout: "test",
  permalink: "/page/{{ name | remove_label }}/",
  content: "",
};