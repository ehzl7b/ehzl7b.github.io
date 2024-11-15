import { renderer } from "./_lib/renderer.js";
import global from "./_src/vars.js";

// let a = `
// ---
// msg: "안녕"
// ---

// # {{ msg }}
// `.trim();

// console.log(renderer.separate(a));

// console.log(global);

import _ from "lodash";

let a = { a: "A", b: "B" };
a = _.omit(a, ["a"]);

console.log(a);