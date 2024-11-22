const $html = document.documentElement
const $switchTheme = document.querySelector("label.switch-theme")

// 페이지 오픈 직후, 자동 애니메이션/트랜지션 방지
window.onload = () => {
  $html.classList.remove("preload")
};

// 테마전환 코드
function toggleTheme(isOn) {
  if (isOn) {
    $switchTheme.classList.add("on")
  } else {
    $switchTheme.classList.remove("on")
  }
  
  $html.dataset.theme = isOn ? "dark" : "light"
  window.sessionStorage.setItem("theme", $html.dataset.theme)
}

// 페이지 오픈 직후, 테마선택
let curTheme = window.sessionStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
let isOn = curTheme === "dark" ? true : false
toggleTheme(isOn)

// 테마 스위치 클릭 시, 테마전환
$switchTheme.onclick = () => {
  isOn = !isOn
  toggleTheme(isOn)
}

// 웹사이트 오픈 시, $permalinksMap 로드
const $article = document.querySelector("article")

let $permalinksMap = {}
const getPermalinks = async () => {
  $permalinksMap = await (await fetch("/permalinksMap.json")).json()
}
getPermalinks()

// 콘텐츠 fetch 함수
const fetch_content = async () => {
  let permalink = window.location.pathname
  if (JSON.stringify($permalinksMap) === "{}") await getPermalinks()
  let filepath = $permalinksMap[permalink] ?? $permalinksMap[permalink + "/"] ?? "/page/404.json"
  let res = await (await fetch(filepath)).json()
  console.log(filepath);
  $article.innerHTML = res.content
}

// 주소 직접 입력했을 경우
;(async () => {
  fetch_content()
})()

// a 태그를 클릭했을 경우
document.body.onclick = async (e) => {
  let el = e.target
  if (el.matches("a") && el.href.startsWith(window.location.origin) && !el.href.match(/[.#]/)) {
    el.preventDefault()
    if(el.href !== window.location.href) {
      history.pushState(null, null, el.href)
      await fetch_content()
    }
  }
}

// 브라우저 전/후 이동버튼을 클릭했을 경우
window.onpopstate = async (e) => {
  await fetch_content()
}