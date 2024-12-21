const $html = document.documentElement;
const $switchTheme = document.querySelector("label.switch-theme");
const $article = document.querySelector("article");

// 페이지 오픈 직후, 자동 애니메이션/트랜지션 방지
window.onload = () => {
  $html.classList.remove("preload");
};

// 테마전환 코드
function toggleTheme(isOn) {
  if (isOn) {
    $switchTheme.classList.add("on");
  } else {
    $switchTheme.classList.remove("on");
  }
  
  $html.dataset.theme = isOn ? "dark" : "light";
  window.sessionStorage.setItem("theme", $html.dataset.theme);
}

// 페이지 오픈 직후, 테마선택
let curTheme = window.sessionStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
let isOn = curTheme === "dark" ? true : false;
toggleTheme(isOn);

// 테마 스위치 클릭 시, 테마전환
$switchTheme.onclick = () => {
  isOn = !isOn;
  toggleTheme(isOn);
};

// SPA 코드
async function fetch_content() {
  let cur_pathname = window.location.pathname;
  if (cur_pathname === "/") cur_pathname = "/page/index";
  let tar_pathname = cur_pathname + ".json";

  let res;
  try {
    res = await (await fetch(tar_pathname)).json();
  } catch(e) {
    res = await (await fetch("/page/404.json")).json();
  }

  $article.innerHTML = res.content;
}

// 주소 직접입력
fetch_content();

// 브라우저 전/후 이동버튼 클릭
window.onpopstate = () => fetch_content();

// 링크 클릭
document.body.onclick = (e) => {
  // SPA 작동 조건
  let t = e.target;
  if (t.matches("a") && t.href.startsWith(window.location.origin) && !t.href.match(/[.#]/)) {
    e.preventDefault();

    // 현재의 주소와 동일하지 않을때 작동
    if (t.href !== window.location.href) {
      history.pushState(null, null, t.href);
      fetch_content();
    }
  }
};