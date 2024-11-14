export default global = {
  site: {
    title: "어즐 블로그",
  },
  cats: [
    {permalink: "#", title: "카테고리1"},
    {permalink: "#", title: "카테고리2"},
  ],
  // default permalink
  permalink: "/page/{{ name | remove_label }}/",
};