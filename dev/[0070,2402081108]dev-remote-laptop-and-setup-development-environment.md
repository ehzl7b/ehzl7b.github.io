---
title: "Windows 노트북에 WSL 설치, VSCODE 개발환경 세팅하고, 노트북 원격 연결 구축기"
description: 별도 노트북을 가지고 다닐 필요없이 언제든 개발할 수 있도록, 개발환경 세팅 + 원격조작으로 개발환경 구축해 본 경험기
updated: 2023-09-03
---

## 이 포스팅은...

나름대로 개인적인 서버를 마련해서 개발 환경을 구축해보고자 [Oracle Cloud](https://www.oracle.com/kr/cloud/free/) 무료 서버도 얻어보고, 집에 남아도는 태블릿에 리눅스 유사 에뮬레이터인 [Termux](https://f-droid.org/ko/packages/com.termux/) 설치하는 등 이런저런 시도를 해보았다.

갖가지 시도 끝에 가장 괜찮다고 느낀 방법은, Windows 노트북에 [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/ko-kr/windows/wsl/) 로 Ubuntu 를 설치하고, [VSCode](https://code.visualstudio.com/) 편집기 + 필수 Extension 을 추가한 뒤, [Chrome Remote Desktop](https://remotedesktop.google.com/access) 설치해서 원격으로 개발을 즐기는 방법이었다.

아래부터는 위 구축환경을 만들기 위한 구체적인 내용이다.

## WSL 설치

기본적으로 [Windows 도움말](https://learn.microsoft.com/ko-kr/windows/wsl/install)을 참고하면 된다.

PowerShell 을 관리자모드로 실행하고 아래 명령어를 입력한다.

- powershell
```powershell
wsl --install
```
설치 완료 메시지가 출력되면 요구하는대로 시스템을 재부팅한다.

부팅되고 난 뒤, PowerShell 재실행 하고 (이 때는 관리자모드로 실행하지 않아도 된다.) 아래 명령어를 입력한다.

- powershell
```powershell
wsl --install Ubuntu
```

중간에 유저네임과 패스워드를 물어보는데 원하는 대로 입력한다.

Ubuntu CLI 환경에 진입을 했다면 설치가 완료된 것이다. 창을 닫아도 된다.

## VSCode 설치

[VSCode](https://code.visualstudio.com/) 를 다운받고 설치한다.

VSCode 를 실행하고 아래 Extention 들을 설치한다.

- note
- [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
- [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager)

첫번째 Extension 은 WSL 에 접근하기 위해 필요하고, 두번째는 작업을 하고 있는 위치를 기록해두면 언제든 다시 원클릭으로 접근할 수 있는 편의성을 제공한다.

## Chrome Remote Desktop

[Chrome Remote Desktop](https://remotedesktop.google.com/access) 접속하여, 구글 계정 로그인한다.

왼쪽에 보이는 메뉴에서 `원격 엑세스` 를 선택하면 보이는 커다란 `원격 액세스 설정` 박스에서 크롬 확장프로그램을 다운로드하고 실행한다. 

설치가 정상적으로 진행되면 PIN 번호 입력을 요구하는데, 외부에서 이 컴퓨터에 원격으로 접근할 때 필요한 패스워드이므로 잘 기억해둔다.

여기까지 진행했다면 외부 다른 컴퓨터에서 [Chrome Remote Desktop](https://remotedesktop.google.com/access) 접속해서 원격으로 조작할 수 있다.

## 노트북 설정

언제든 외부에서 원격 접근이 가능해야 하므로, 노트북에 몇가지 설정을 해두었다.

노트북 덮개 및 전원버튼이 아무런 동작을 하지 않도록 설정하고, 전원옵션 등을 통해 하드디스크 꺼짐, 절전모드 전환이 안되도록 했다.

그리고 **제일 중요한 포인트**!!! [링크](https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%8D%94%EB%AF%B8+hdmi)와 같은 더이 HDMI 플러그롤 꼳아둔다. 이는 Chrome Remote Desktop 으로 원격 접속했을 때 Windows 설정 화면이나 MS Office Word 스크롤이 먹히지 않는 문제를 해결하기 위해서다.
