import { renderer } from "./_lib/renderer.js";

let a = `
---
msg: "안녕"
---

# {{ msg }}
`.trim();

console.log(renderer.separate(a));