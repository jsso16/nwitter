# Nwitter - 전소진
Twitter Clone 2022<br>
교재 참고 자료 : https://github.com/easysIT/nwitter

## 04월 27일
> 이메일, 비밀번호 인증 기능 사용해보기

**1. Firebase로 로그인과 회원가입 처리하기**
- 로그인과 회원가입을 처리하기 위해 다음과 같이 코드를 작성해준다.
- 이때 createUserWithEmailAndPassword 함수는 인자로 전달받은 이메일, 비밀번호를 Firebase의 데이터베이스에 저장한다.
- 또한 signInWithEmailAndPassword 함수는 인자로 전달받은 이메일, 비밀번호를 Firebase의 데이터베이스에 전달하여 확인 후 로그인할 수 있게 해준다.
```jsx
import { authService } from "fbase";

  ... 

  const onSubmit = async(event) => {
    event.preventDefault();

    try {
      let data;

      if (newAccount) {
        // Create New Account
        data = await authService.createUserWithEmailAndPassword(email, password);
      } else {
        // Log In
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  ... 

};

export default Auth;
```
- onSubmit 함수에 추가된 async문과 await문은 로그인 또는 회원가입 인증이 처리된 이후에 앱을 실행되게 하는 역할을 한다.
- 또한 try-catch문으로 로그인 또는 회원가입의 성공 또는 실패를 처리하도록 하여 데이터의 값을 출력하거나 오류값을 확인할 수 있다.

**+) setPersistence란?**
- setPersistence는 로그인 상태를 지속시켜주는 함수이다.
- 로그인 상태 지속을 관리하는 방법에는 아래의 3가지가 있다.
```
- local: 웹 브라우저를 종료해도 로그인 유지(기본값)
  → 웹 브라우저를 종료해도 로그인한 사용자의 정보를 기억할 수 있게 해주는 옵션
- session: 웹 브라우저의 탭을 종료하면 로그아웃
  → 기본적으로 가장 많이 사용
- none: 새로고침하면 로그아웃
  → 사용자 정보를 기억하지 않기 때문에 새로고침하면 로그인이 풀림
```

**2. 사용자 정보가 저장되어 있는 곳 살펴보기**
-  local 옵션으로 저장한 사용자 로그인 정보는 브라우저 내에 있는 IndexedDB라는 데이터베이스에 사용자 정보를 저장한다.
- 이 데이터베이스는 개발자 도구의 Application 탭에서 확인할 수 있다.<br>
→ Storage > IndexedDB > firebaseLocalStorageDB... > firebaseLocalStorage
- 이 외에도 value 항목을 펼치면 사용자 정보를 확인할 수 있다.

> 로그인, 로그아웃하기

**+) 로그인 처리 후 currentUser가 null인 이유는?**
- 로그인 처리가 반영되었다면 currentUser가 null이 아닌 다른 값이어야 하지만, 콘솔을 확인해보면 아직 null인 것을 확인할 수 있다.
- 이는 비동기 처리 과정으로 인해 발생하는 문제이다.
- Firebase에서 회원가입, 로그인 처리를 마친 후 데이터를 보내주면 그 데이터를 받아 화면을 그려주기까지 시간 간격이 생기는데, 그 사이에 currentUser 값을 확인하면 null이 출력되는 것이다.
- 따라서 이러한 문제는 React의 생명주기를 이용하면 해결할 수 있다.

**1. 딜레이 직접 확인해보기**
- 회원가입 후 로그인 처리 완료까지 걸리는 시간을 확인하기 위해서는 setInterval 함수를 사용하면 된다.  
- setInterval 함수는 지정한 두 번째 인자로 지정한 시간 간격마다 첫 번째 인자로 전달한 코드를 실행한다.
- setInterval 함수를 이용한 딜레이 확인은 아래와 같이 코드를 작성해주면 된다.
```jsx
setInterval(() => console.log(authService.currentUser), 2000);
```

**2. useEffect 함수 사용하기**
- useEffect 함수는 React 컴포넌트가 렌더링 될 때마다 특정 작업을 실행하는 함수이다.
- 이 프로젝트에서 useEffect 함수는 Firebase가 초기화되는 시점에 실행되어, 유저 상태에 따라 해당하는 화면을 보이게 설정해준다.
- 이와 관련된 코드는 다음과 같이 작성해주면 된다.<br>
→ [관련 커밋 : Edit App.js](https://github.com/jsso16/nwitter/commit/ccef50de2873e0272fe81e2f674cc19b0ec95f25)

**3. 로그아웃하기**
- 로그아웃 방법은 사용자 정보가 저장되어 있는 곳인 IndexedDB를 clear하면 된다.
- 이를 실행하면 자동으로 회원가입 창으로 돌아온다.

**4. 에러와 에러 메세지 Firebase로 처리하기**
- Firebase는 에러와 에러 메세지가 이미 준비되어 있기 때문에 간편하게 적용할 수 있다.
- 에러와 에러 메세지를 처리하기 위해서는 에러를 관리하기 위한 상태를 만들어주어야 한다.
- 상태를 만들어주기 위한 코드는 아래와 같다.
```jsx
const [error, setError] = useState("");
```

**5. 일부러 중복 회원가입 에러 발생시키기**
- 앞에서 잠깐 이야기했듯이 onSubmit 함수에는 try-catch문으로 에러를 콘솔에 출력하는 코드가 들어 있다.
- 따라서 에러 메세지를 확인하기 위해 일부러 중복 회원가입을 통해 에러를 발생시킨다.
- 이후 콘솔을 확인하면 일반적인 error를 출력하고 있어 원하는 메세지가 나오지 않는 것을 확인할 수 있다.
- 이때 error는 Firebase가 에러와 관련된 여러 내용이 자세히 적혀있는 객체를 의미한다.

**6. error.message 화면에 출력하기**
- 우리가 원하는 에러 메세지는 error.message에 들어있다.
- 이를 화면에 출력하기 위해서는 setError 함수에 error.message를 전달하여 error 상태를 변경해야 한다.
- error.message를 출력하는 코드는 아래와 같다.
```jsx

  ... 

  const onSubmit = async(event) => {
    event.preventDefault();

    try {
    
    ... 

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    
    ... 

      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
      {error}
    </div>
  )
    
  ... 

```
- 이렇게 코드를 수정하고 에러를 발생시켜야 사용자가 에러 상황을 바로 알 수 있다.

**7. 회원가입, 로그인 토글 버튼 적용하기**
- 로그인 여부에 따라 로그인, 회원가입이 전환되도록 버튼을 만들어주기 위해서는 토글 버튼을 적용해주어야 한다.
- 토글 버튼 적용하기 위한 코드는 다음과 같다.<br>
→ [관련 커밋 : Edit Auth.js](https://github.com/jsso16/nwitter/commit/c70a6afb2d5395a4b8175e748d2a6da2b894178b)
- 이렇게 usestate 함수를 이용하면 간단하게 토글 버튼을 만들 수 있다.

> 소셜 로그인 추가하기

**1. 소셜 로그인 버튼에 name 속성 사용하기**
- 소셜 로그인을 구별하기 위해서는 event.target.name 속성을 사용해주어야 한다.
- name 속성을 사용하기 위해서는 다음과 같이 코드를 작성해준다.<br>
→ [관련 커밋 : Edit Auth.js](https://github.com/jsso16/nwitter/commit/47a98fe8ba9419dfcf9d79888d61d5eb512097b9)
- 이를 통해 OnSocialClick 함수에서 소셜 로그인 버튼을 누를 때마다 발생하는 이벤트의 name 속성값이 콘솔창에 출력되는 것을 확인할 수 있다.

**2. 소셜 로그인을 위해 firebaseInstance 추가하기**
- 소셜 로그인을 사용하기 위해서는 provider가 필요하지만, export한 authService에는 provider가 없다.
- 따라서 provider를 사용하기 위해서는 firebase 전체를 export 해야 한다.
- 이때 Firebase는 아래와 같이 firebaseInstance 이름으로 export 해주어야 한다.
```jsx
export const firebaseInstance = firebase;
```

## 04월 13일
> Firebase 오류 해결하기

**1. Firebase 관련 오류 해결하기**
- 지난 강의 시간에 firebase와 관련된 다양한 오류들이 발생하였다.
- 이 프로젝트의 경우, firebase의 import 경로에 compat를 추가해주지 않아 오류가 발생하였다.
- 따라서 다음과 같이 코드를 수정하여 오류를 해결하였다.<br>
→ [관련 커밋 : Edit fbase.js](https://github.com/jsso16/nwitter/commit/41c483631cae92733ed776207d885417f4703dec)

**2. Firebase 버전 낮추기**
- 다양한 오류 중, fbase.js 파일에 auth를 import하면 화면이 출력되지 않는 문제가 있었다.
- 이런 경우에는 Firebase의 버전을 낮춰주어야 한다.
- Firebase를 다운그레이드하기 위해서는 아래의 명령어를 실행해주면 된다.
```jsx
npm install firebase @8.8.0
```

> Firebase 로그인 준비하기<br>
> +) 04월 06일 README.md 참조

**1. useState의 초기값 변경해주기**
- auth 모듈 동작 확인을 위해 사용한 currentUser는 값에 따라서 로그인 상태를 바꿔줄 수 있다.
- 따라서 이 값을 아래와 같이 useState의 초기값으로 정의해준다.
```jsx
const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
```

> Firebase 로그인 설정하기

**1. Firebase 인증 설정하기**
- Firebase 인증 설정 방법은 아래와 같다.
```
1. Firebase 홈페이지 접속하기(+ 홈페이지 링크는 하단의 03월 30일 README.md 참조)
2. 우측 상단의 콘솔로 이동 클릭 후 프로젝트 선택하기
3. 좌측 메뉴의 Authentication 클릭하기
4. 상단의 4개의 메뉴 중 Sign-in method 선택하기
5. 다양한 로그인 업체 중 사용하고 싶은 로그인 방법을 클릭하여 인증하기
```
- 기본 제공 업체로 이메일/비밀번호, 전화 등이 있다.
- 추가 제공 업체로는 이메일, 구글, 깃허브 등 다양한 소셜 로그인이 있다.
- 추가적으로 다른 로그인 방법을 사용하고 싶다면 로그인 제공업체 추가 버튼을 클릭하여 다양한 로그인 방법을 사용할 수 있다.

**2. 이메일, 비밀번호 로그인 설정하기**
- 이메일, 비밀번호 로그인 방법은 아래와 같다.
- 이때 하단의 이메일 링크(비밀번호가 없는 로그인)가 없는 로그인은 허용하지 않아야 한다.
```
1. 이메일, 비밀번호 버튼 선택하기
2. 우측 상단의 사용설정 허용 후 저장 버튼 클릭하기
```

**3. 구글 소셜 로그인 설정하기**
- 구글 소셜 로그인 방법은 아래와 같다.
```
1. Google 버튼 선택하기
2. 우측 상단의 사용설정 허용하기
3. 프로젝트 공개용 이름은 그대로 두고, 프로젝트 지원 이메일은 기본값으로 설정하기
4. 저장 버튼 클릭하기
```

**4. Github 소셜 로그인 설정하기**
- Github 소셜 로그인 설정은 앞의 두 로그인 설정과 다르게 Github에서도 몇 가지 로그인 관련 설정을 추가적으로 진행해주어야 한다.
- Github 소셜 로그인 방법은 아래와 같다.
```
1. Github 버튼 선택하기
2. 우측 상단의 사용설정 허용하기
3. 클라이언트 ID와 보안 비밀번호는 빈칸으로 두고, 하단의 승인 콜백 URL 복사하기
4. Github 접속 후, 우측 상단의 사용자 메뉴의 Settings 클릭하기
5. 좌측 메뉴의 Developer settings 클릭 후, OAuth Apps 메뉴 클릭하기
6. Register a new application 버튼 클릭하기
7. Apllication name 입력하기
8. Homepage URL에 도메인 입력해주기 
9. Authorization callback URL에 아까 복사하였던 승인 콜백 URL 입력해주기
10. Register application 버튼 클릭하기
11. 이후 생성된 클라이언트 ID를 복사하여 Firebase의 해당 빈칸에 붙여넣기
12. 다시 Github로 돌아와 Generate a new client secret 버튼을 클릭하여 보안 비밀번호 생성하기
13. 이후 생성되는 보안 비밀번호도 복사하여 Firebase의 해당 빈칸에 붙여넣기
14. 저장 버튼 클릭하기
```
- Homepage URL을 입력할 때, Firebase 설정 화면의 승인된 도메인 중 firebaseapp.com으로 끝나는 도메인을 복사해서 붙여넣어주어야 한다.
- 이때, 도메인 앞에 https:// 입력을 필수로 해주어야 한다.

**5. 로그인 폼 기본 구조 만들기**
- 앞에서 설정했던 로그인 방법들을 사용하기 위해 다음과 같이 Auth.js 파일에 로그인 폼 기본 구조를 작성해준다.
```jsx 
const Auth = () => {
  return (
    <div>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="submit" value="Log In" />
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
    </div>
  )
};

export default Auth;
```

**6. 로그인 폼이 상태를 업데이트 하도록 하기**
- 작성해놓은 폼을 사용하기 위해서는 다음과 같이 코드를 작성해주어야 한다.
- 이때 useState 함수는 상태를 만들어주고, onChange/onSubmit 함수는 이벤트를 연결해준다.<br>
→ [관련 커밋 : Edit Auth.js](https://github.com/jsso16/nwitter/commit/dc891d5b58cd88bd490322bc4267260bbf7bad97)

> 이메일, 비밀번호 인증 기능 사용해보기

**1. 로그인과 회원가입 분리하기**
- 로그인과 회원가입 기능을 분리하기 위해 다음과 같이 코드를 작성해준다.<br>
→ [관련 커밋 : Edit Auth.js](https://github.com/jsso16/nwitter/commit/0ef878fe860b773a5f9b0154d455ecfbe232147b)

**+) event.preventDefault()란?**
- submit 이벤트는 이벤트 발생 시에 페이지를 새로고침하기 때문에 React의 상태가 초기화되는 현상이 발생한다.
- 이러한 현상을 막기 위해 사용하는 것이 바로 event.preventDefault()이다.
- event.preventDefault()를 이용하면 이벤트가 발생했을 때, onSubmit 함수의 이벤트의 기본값을 막아 새로고침이 발생하지 않는다.

## 04월 06일
> Router 적용하기<br>
> +) 03월 30일 README.md 참조

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
- 다음으로, 내보낸 authService를 사용하기 위해 아래의 코드를 작성해준다.
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