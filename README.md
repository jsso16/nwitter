# Nwitter - 전소진
Twitter Clone 2022<br>
교재 참고 자료 : https://github.com/easysIT/nwitter

## 04월 06일
> Router 적용하기<br>
> +) 04월 06일 README.md 참조

**1. useState 함수 사용하기**
- useState 함수를 사용하기 위해서는 아래와 같이 코드를 작성해주면 된다.
```jsx
import { useState } from "react";

... 

const AppRouter = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  ... 

}

export default AppRouter;
```
- 이때 **isLoggedIn**은 단순 변수가 아니라 setIsLoggedIn으로 관리하는 상태로 취급할 수 있다.
- 또한 **setIsLoggedIn**은 변수가 아닌 isLoggedIn을 변경할 때 사용하는 함수이다.

**2. 삼항연산자와 state로 컴포넌트 반환하기**
- 삼항연산자와 state를 이용하여 상태에 따른 적절한 컴포넌트를 렌더링할 수 있다.
- 이를 구현하는 코드는 아래와 같이 작성해주면 된다.
```jsx
... 

import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = () => {

  ... 

  return(
    <Router>
      <Switch>
        {isLoggedIn ? (
          <Route exact path="/">
            <Home />
          </Route>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  )
};

export default AppRouter;
```

**3. Swich 사용 시 발생하는 오류 해결하기**
- 프로젝트를 진행하는 도중 다음과 같은 에러 메세지가 발생할 수 있다.
- 이는 react-router-dom 6 버전에서 Switch를 지원하지 않기 때문에 발생하는 문제이다.
```jsx
export 'Switch' (imported as 'Switch') was not found in 'react-router-dom'
```
- 해결 방법으로는 아래의 2가지가 있다.
```
1. Switch 대신에 Routes 사용하기
2. react-router-dom을 5.2.0 버전으로 설치하여 버전 낮추기
```
- 2번 방법으로 문제를 해결한다면 아래의 명령어를 실행해주면 된다.
```jsx
npm install react-router-dom@5.2.0
```

> Firebase 로그인 준비하기

**1. useState 함수 코드 효율적으로 수정하기**
- 컴포넌트가 Router 역할을 하면서도 코드의 가독성까지 챙기기 위해서는 App 컴포넌트에서 관리하는 것이 좋다.
- 따라서 다음과 같이 코드를 수정해주면 코드를 효율적으로 사용할 수 있다.<br>
→ [관련 커밋 : Refactoring components files](https://github.com/jsso16/nwitter/commit/e63d63138bbd46f773ddc58391633f724beb6739)

**2. 절대 경로 설정해주기**
- 절대 경로 설정을 위해 jsconfig.json 파일을 생성해주어야 한다.
- jsconfig.json 파일은 해당 파일이 있는 곳이 프로젝트의 루트 디렉토리임을 의미한다.
- 이렇게 절대 경로를 설정해주면 다른 파일들을 import하기 간편해지고 가독성이 좋아진다.
- jsconfig.json 파일은 아래와 같이 생성해주면 된다.
```jsx
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```
- 이후 절대 경로는 다음과 같이 수정해주면 된다.<br>
→ [관련 커밋 : Modify import files path](https://github.com/jsso16/nwitter/commit/22aeedda656b32e23eee9c78ee39ca45512bbde3)

**3. firebase.js 이름 변경하기**
- 절대 경로로 설정해주게 되면 한 가지 단점이 존재한다.
- 이는 파일 이름과 npm install로 설치한 패키지 이름이 같으면 오류가 발생한다는 것이다.
- 따라서 우리가 설치한 패키지 중 firebase가 존재함으로 파일 이름을 firebase.js에서 fbase.js로 변경해주어야 한다.

**4. Firebase 인증 모듈 사용하기**
- Firebase 인증 모듈을 사용하기 위해서는 아래와 같이 코드를 작성해주어야 된다.
- 이때 오류가 발생한다면 아래처럼 import 경로에 compat를 추가해주면 된다.
```jsx   
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  
  ... 

};

firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth();
```
- 다음으로, 내보낸 serviceAuth를 사용하기 위해 아래의 코드를 작성해준다.
- 프로젝트 실행 시, 콘솔에 null이 출력된다면 auth 모듈이 제대로 실행되고 있는 것이다.
```jsx 
... 

import { authService }from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  console.log(authService.currentUser);
  
  return (
   
    ... 

  );
}

export default App;
```

## 03월 30일
> Firebase 설정하기

**1. Firebase 프로젝트 만들기**
- Firebase 프로젝트 생성 방법은 아래와 같다.
- Firebase 홈페이지<br>
https://firebase.google.com
```
1. 상단 링크의 홈페이지 접속하기
2. 구글 아이디 로그인 후 시작하기 클릭하기
3. 프로젝트 만들기 클릭 후 프로젝트 이름 지정해주기(+ Firebase 약관 동의)
4. 구글 애널리틱스 사용 설정 끄기
5. 프로젝트 만들기 클릭 후 프로젝트 생성하기
```

**2. Firebase 웹 애플리케이션 등록하기**
- Firebase 웹 애플리케이션 등록은 아래와 같다.
```
1. </> 모양의 버튼 클릭하기
2. 앱 닉네임 설정하기
3. '또한 이 앱의 Firebase 호스팅을 설정하세요.' 체크 해제하기
4. 앱 등록하기
```

**3. Firebase 설치 및 설정하기**
- Firebase를 설치하기 위해서는 아래의 명령어를 실행해주어야 한다.
```jsx
npm install firebase
```
- 이후 Firebase.js 파일을 생성하여 Firebase SDK의 추가 내용을 복사하여 넣어준다.

**4. Firebase의 동작 확인하기**
- Firebase의 동작 확인은 index.js 파일에 console.log 함수를 출력해보기만 하면 된다.
- 제대로 동작이 된다면 콘솔창에서 아래 사진의 내용을 확인할 수 있다.
<img width="420" alt="Firebase 변수값" src="https://user-images.githubusercontent.com/62285642/161128583-dab9b7f7-c7de-494c-b54b-de00c3cab5c3.png">

- 그러나 해당 내용이 콘솔창에서 확인되지 않는 경우가 있다.
- 이는 Firebase의 버전으로 인한 문제이므로 버전에 따라 아래와 같이 작성해주어야 한다.
```jsx
// firebase 8버전 이하
import firebase from 'firebase/app'; 
import 'firebase/auth'; 
import 'firebase/firestore';
```
```jsx
// firebase 9버전 이상
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';
```

> Firebase 비밀키 숨기기

**1. Firebase의 비밀키란?**
- 웹 애플리케이션 등록 시 생성된 SDK 내용을 보면 apikey와 같은 값들을 볼 수 있다.
- 이러한 값은 Firebase의 비밀키로, firebase 시스템을 활용하기 위한 가장 중요한 정보이다.
- 따라서 비밀키가 노출되면 데이터베이스에 접근하여 데이터를 바꾸는 등의 보안 문제가 생길 수 있다.

**2. Firebase의 비밀키 숨기기**
- Firebase의 비밀키를 숨기기 위해서는 .env 파일을 이용하면 된다.
- .env 파일을 이용한 비밀키 암호화 방법은 다음과 같다.
```
1. .env 파일 생성하기
2. .env 파일 내에 "REACT_APP_변수명"으로 환경 변수 설정하기
3. .gitignore 파일에 .env 파일 추가해주기
4. 기존의 Firebase 파일에 있던 비밀키를 .env 파일 내의 환경 변수로 변경해주기
```
- 이때 반드시 환경 변수 앞에 process.env.를 꼭 붙여주어야 한다.<br>
→ 왜냐하면 process.env.는 다른 파일에서 환경 변수를 가져다 사용할 수 있게 해주는 역할을 하기 때문이다. 

> Router 준비하기

**1. Router란?**
- Router란 쉽게 말해서 주소를 입력했을 때 어떤 컴포넌트를 보여줄 지 결정하는 역할을 하는 라이브러리이다.
- 즉, 어떤 컴포넌트를 렌더링할지 결정하는 역할을 하는 것이다.

**2. 프로젝트 폴더 및 파일 구성해주기**
- Router를 적용해주기 위해서는 프로젝트의 폴더 및 파일을 구성해주어야 한다.
- 이번 프로젝트에서 렌더링할 페이지는 routes 폴더에 넣어주었다. 
→ [관련 커밋 : Modify App.js path](https://github.com/jsso16/nwitter/commit/1c80cb1f435e435279e60b17e5c9962a5fc71aaa)
  - App.js
- 이 외의 페이지를 이루는 구성 요소들은 components 폴더에 넣어주었다. 
→ [관련 커밋 : Add Route files](https://github.com/jsso16/nwitter/commit/e75945845c0348dec8a724dd00a06f680ebb4e62)
  - Auth.js
  - EditProfile.js
  - Home.js
  - Profile.js

**3. Router 설치 및 설정하기**
- Router를 설치하기 위해서는 아래의 명령어를 실행해주어야 한다.
```jsx
npm install react-route-dom
```
- 이후 Router 설정을 위해 react-router-dom에 있는 HashRouter, Route, Switch로 Router를 아래와 같이 구현해준다.
```jsx
import { HashRouter as Router, Route, Switch } from "react-router-dom";

const AppRouter = () => {
  return(
    <Router>
      <Switch>
        <Route />
      </Switch>
    </Router>
  )
};

export default AppRouter; 
```

> Router 적용하기

**1. React Hooks란?**
- React는 클래스형 컴포넌트와 함수형 컴포넌트 두 가지 형태의 컴포넌트를 사용할 수 있다.
- 이때 함수형 컴포넌트에서 상태 관리를 위해 사용하는 기능이 바로 Hooks이다. 
- 이와 관련된 자세한 내용은 아래의 공식 문서에서 확인할 수 있다.<br>
https://ko.reactjs.org/docs/hooks-intro.html

**2. React Hooks에서 사용하는 useState 함수**
- React Hooks를 사용하기 위해서는 useState 함수를 사용해야 한다.
- useState 함수는 아래 예시와 같이 인자로 [상태, 상태관리함수, 이름]과 같은 형태의 배열을 입력 받는다.
```jsx
const [isLoggedIn, setIsLoggedIn] = useState(false)
```
- 이 외의 useState 함수와 관련된 내용은 아래의 공식 문서에서 확인 가능하다.<br>
https://ko.reactjs.org/docs/hooks-state.html

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