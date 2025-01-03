---
layout: "page"
title: "나만의 PC 초기화 순서/방법"
description: "PC 포맷부터 이런저런 프로그램까지 설치 순서/방법들 기록, 계속 업데이트 예정"
updated: "2024-04-16"
---

## Windows 설치

사전 준비물: 8G 이상의 USB, 윈도우즈 정품 인증 키 

[레미쯔](https://remiz.co.kr/) 사이트에서 윈도우즈 iso 다운로드

다운로드 파일 안에서 추천하는 대로, [Ventoy](https://www.ventoy.net/en/index.html) 프로그램을 이용해서, 윈도우즈 설치 USB 제작

## Windows 설정

멀티부팅할 때 뜨는 이름 변경을 위해 `WINDOWS` 키 --> "cmd" 로 검색 --> "명령 프롬프트"를 **관리자 권한으로 실행** 클릭

cmd 창에 `<이름>` 칸에 원하는 이름을 넣고 아래 명령어 입력

- 명령 프롬프트
```powershell
bcdedit /set {current} description "<이름>"
```

## WSL 설치

`WINDOWS` 키 --> "cmd" 로 검색 --> "명령 프롬프트"를 **관리자 권한으로 실행** 클릭
(위 Windows 설정에서 계속 이어진다면 명령 프롬프트 창이 띄워져 있을 것이다.)

활성화된 cmd 에 아래 명령어를 위부터 순서대로 입력하여 설치

- 명령 프롬프트
```powershell
wsl --install
wsl --update
```

아래 명령어들로 리눅스 배포판을 확인하고, `<Distro>` 란에 설치 원하는 배포한 입력하여 설치 진행

- 명령 프롬프트
```powershell
wsl --list --online
wsl --install <Distro>
```

설치 완료 후 재부팅 --> 재부팅하면, 창이 새로 뜨는데, Ubuntu 에서 사용할 이름과 비밀번호 입력

[VSCode](https://code.visualstudio.com/Download) 다운로드 후 설치

왼쪽 메뉴아이콘에서 확장팩(Extensions) 선택 후, "WSL" 검색 --> 설치

좌하단의 >< 모양의 "원격" 버튼 클릭하여 WSL 접속

## Ubuntu 프로그램 설치

VSCode <code>CTRL + `</code> 키 --> 아래 명령어 실행 (선택을 묻는 질문이 나올때마다 y/yes 선택)

- bash
```bash
sudo apt update
sudo apt upgrade
```

git 설치

- bash
```bash
sudo apt install git
```

git 초기화, `<username>` 과 `<useremail>` 에는 본인의 이름과 이메일 입력 (이름과 이메일을 쌍따옴표로 둘러싸고 입력)

- bash
```bash
git config --global user.name "<username>"
git config --global user.email "<useremail>"
```

맘바포지 설치를 위해, 설치파일을 다운받고자 하는 폴더 생성 --> 해당 폴더로 이동

[맘바포지](https://github.com/conda-forge/miniforge/releases) 사이트 방문, 설치파일 인터넷 링크 복사 --> 아래 명령어의 `<인터넷경로>`에 복사한 링크 붙여넣고 실행

- bash
```bash
wget <인터넷경로>
```

다운로드 된 파일을 ls 명령어로 확인 --> `<파일>` 부분에 다운로드 파일명을 입력(대소문자 구분)하고 실행 (선택을 묻는 질문 나올때마다 y/yes 선택)

- bash
```bash
bash <파일>
source ~/.bashrc
```

터미널 화면 프롬프트에 `(base)` 표시가 되면 완료

mamba 명령어는 conda 와 매우 유사, 포털에서 원하는 기능을 conda 로 실행하는 방법을 검색해도 OK

## (참고) Windows 자체에 개발 환경 설치

[Git](https://git-scm.com/downloads) 사이트에서 설치 파일 다운로드 --> 권장하는 옵션대로 설치

[맘바포지](https://github.com/conda-forge/miniforge/releases) 사이트 방문, 설치 파일 다운로드 --> 권장하는 옵션대로 설치

VSCode 또는 CMD 에서 아래 명령어(`<사용자이름>`에 본인의 Windows 로그인 이름 삽입)로 가상환경 활성화

- 명령 프롬프트
```powershell
C:\Users\<사용자이름>\mambaforge\Scripts\activate
```