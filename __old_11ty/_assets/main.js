const $html = document.documentElement;
const $switchTheme = document.querySelector("label.switch-theme");

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