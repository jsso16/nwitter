# Nwitter - 전소진
Twitter Clone 2022<br>
교재 참고 자료 : https://github.com/easysIT/nwitter

## 03월 23일
> React 프로젝트 생성 및 파일 정리하기

**1. React 프로젝트 생성하기**
- React 프로젝트를 생성하기 위해서는 아래의 명령어를 실행해주어야 한다.
```jsx
npx create-react-app nwitter
```

**2. React 프로젝트 생성 시 발생하는 오류 해결하기**
- React 프로젝트 생성 시, 다음과 같은 에러 메세지가 발생할 수 있다.
- 이는 create-react-app을 설치할 때 최신 버전이 아니어서 발생하는 문제이다.
```jsx
You are running `create-react-app` 4.0.3, which is behind the latest release (5.0.0).
```
- 해결 방법은 아래의 명령어를 순서대로 실행해주면 된다.
```jsx
npm uninstall -g create-react-app
npm add create-react-app
npx create-react-app nwitter
```
- 이 외에도 하단의 오류 메시지 내 사이트 URL을 통해서 확인이 가능하다.<br> 
https://create-react-app.dev/docs/getting-started/

**+) React 프로젝트 생성 시 발생하는 오류가 해결되지 않을 때는?**
- 다음과 같이 create-react-app을 삭제해도 문제가 해결되지 않을 때가 있다.
- 이러한 경우에는 아래의 2가지 방법으로 오류를 해결할 수 있다.
```jsx
npx create-react-app@latest nwitter  // 일회성으로 해결하는 방법
```
```jsx
npm install -g create-react-app@latest  // 영구적으로 해결하는 방법
```

**3. React 프로젝트 파일 정리하기**
- 기본적으로 사용할 파일들의 코드를 수정해준다.
→ [관련 커밋 : Edit files](https://github.com/jsso16/nwitter/commit/190423d8184da09724658b04958cc367cad76940)
  - package.json
  - index.js
  - App.js
- 이 외의 프로젝트 작업에 필요하지 않은 파일들을 삭제해준다.
  - App.css
  - App.test.js
  - index.css
  - logo.svg
  - reportWebVitals.js
  - setupTest.js

> React 프로젝트에 Github 연동하기

**1. 로컬 PC에서 Github에 Push하기**
- Git 최초 설정하기
```jsx
git config --global user.name "Your Name"
git config --global user.email "Your Email"
```
- Git 설정 확인하기
```jsx
git config --global user.name
git config --global user.email
```
- Github에 파일 올리기
```jsx
git add .  // 변경된 파일 등록
git commit -m "commit message"  // 등록된 파일을 묶어 메세지 첨부
git push origin master  // 저장소로 등록된 파일과 메세지 업로드
```