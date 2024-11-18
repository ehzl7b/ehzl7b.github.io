export default global = {
  site: {
    title: "어즐 블로그",
    footer: {
      msg: "<div>Designed by 어즐,</div><div>built with Node.js,</div><div>and deployed on Github.</div>",
    },
  },
  layout: "page",
  permalink: "/page/{{ name | remove_label }}/",
  content: "",
};