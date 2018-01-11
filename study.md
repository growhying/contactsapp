# axios를 이용한 서버통신

### axios 기능 테스트

npm install 명령어로 webpack 템플릿을 사용하기 위해 필요한 의존성 패키지들을 다운로드한다.
webpack 템플릿은 vue-router, 린팅, 단위 테스트 등이 내장되어 있다.

<pre><code>vue init webpack contactsapp</pre></code>


#### http 프록시 설정

브라우저에 기본 설정된 보안 정책 중에 SOP(Same Origin Policy)라는 것이 있다.
브라우저가 HTML 페이지를 가진 웹사이트(localhost:8080)에 접속해서 HTML 문서를 다운로드하고 화면에 보여주게 된다.
이때 브라우저의 Origin은 localhost:8080으로 자동 설정된다.
브라우저 개발자도구의 콘솔 화면에서 location.origin값을 확인해보면 알 수 있다.
이 것의 의미는 "현재 보여주고 있는 문서는 Origin에서 내려받은 것이다" 이다.

이 HTML 문서에서 현재 브라우저의 Origin과 다른 Origin에 해당하는 서버와 통신하려고 할 때 요청부터 응답 전송까지는 정상적으로 수행되지만 브라우저로 로딩하는 단계에서 오류가 발생한다. 이 문제를 크로스 도메인 문제라고 불러왔지만, 정확한 의미는 __SOP 보안 정책으로 인해 크로스 오리진으로부터 데이터를 로드할 수 없는 현상__ 이라고 말할 수 있다.

도메인명이 같아도 이 문제가 발생할 수 있는데, Origin 정보가 한 글자라도 다르면 크로스 오리진 상태이다.

이 문제를 해결하기 위한 방법이다.

* Consumer Server측에 프록시 요소 생성
* 서비스 제공자 측에서 CORS(Cross Origin Resource Sharing) 기능 제공
* 서비스 제공자 측에서 JSONP(JSON Padding) 기능을 제공

Vue.js는 컨슈머 서버를 통해 제공되는 프런트엔드 웹 개발 기술이다. 여기에서 서비스 제공자 역할은 연락처 서비스 API가 담당한다.

외부 업체가 개발한 서비스를 우리가 개발한 애플리케이션이 이용하는 경우 위의 3가지 해결 방법 중 하나를 선택해야 한다.
외부 업체의 서비스가 CORS나 JSONP와 같은 기법을 제공한다면 프런트엔드 개발자는 아무런 조치를 취하지 않아도 문제없이 서비스를 이용할 수 있다. 하지만 그렇지 않다면 컨슈머 서버에 프록시 요소를 생성해서 컨슈머를 거쳐 요청이 전달되도록 해야 한다.

Vue.js webpack 템플릿에서는 컨슈머 서버 프록시 기능을 Webpack 개발 서버에서 제공한다.
생성된 프로젝트 템플릿에서 config 디렉터리의 index.js파일을 열어서 proxiTable 설정을 한다.


#### axios 사용

현재 디렉토리에 axios 라이브러리를 다운로드 한다.

<pre><code>npm install --save axios</pre></code>

CDN으로 직접 참조도 할 수 있다. 특히 Vue-CLI에서 simple 프로젝트 템플릿을 이용하는 경우, CDN으로 직접 참조한다.

<pre><code> <script src="https://unpkg.com/axios/dist/axios.min.js"></script> </code></pre>

##### axios를 이용하는 방법
* 저수준 API
  - axios(config)
  - axios(url, config)

* 각 메소드별 별칭
  * axios.get(url[, config])
  * axios.delete(url[, config])
  * axios.post(url[, data[, config]])
  * axios.put(url[, data[, config]])
  * axios.head(url[, data])
  * axios.options(url[, data])


#### axios 요청과 config 옵션

* baseURL : 이 옵션을 이용해 공통적인 URL 앞부분을 미리 등록해두면 요청 시 나머지 부분만 요청 URL로 전달하면 된다.
  가능하다면 axios.defaults.baseURL 값을 미리 바꾸는 것이 좋다.
* transformRequest : 요청 데이터를 서버로 전송하기 전에 데이터를 변환하기 위한 함수를 등록한다.
* transformResponse : 응답 데이터를 수신한 직후에 데이터를 변환하기 위한 함수를 등록한다.
* header : 요청 시에 서버로 전달하고자 하는 HTTP 헤더 정보를 설정한다.


#### axios 사용 시 주의 사항
axios를 사용하며 then()을 처리할 때는 ES6의 화살표 함수를 사용해야 한다.
데이터를 수신한 후, Vue 인스턴스 내부 데이터를 변경해야 하는 경우가 많은 데,
데이터 옵션을 액세스하기 위해서는 this 객체가 Vue 인스턴스를 참조해야 한다.
then() 내부에서 화살표 함수를 사용하지 않으면 this가 Vue 인스턴스를 참조하지 않기 때문이다.



### 애플리케이션 구조

- 모든 데이터는 App.vue에서 관리

- 데이터를 변경하는 모든 메서드는 App.vue에 배치

- 모든 컴포넌트들의 모든 상태는 App.vue에서 관리한다.

  따라서 하위 컴포넌트에서 실행 시 필요로 하는 데이터는 모두 props를 통해 전달해주어야 한다.

- 데이터를 변경할 수 있는 메서드도 모두 App.vue에 배치할 것이기 때문에 하위 컴포넌트에서의 작업, 액션이 최상위 컴포넌트인 App.vue의 데이터를 변경하기 위해서는 이벤트 버스를 이용해 App.vue에 전달하고 이를 통해 메서드가 호출될 수 있어야 한다.

- 초기화면에는 ContactList.vue 컴포넌트를 통해 연락처 목록을 보여준다.

- AddContact.vue, UpdateContact.vue 컴포넌트는 연락처를 추가하거나 편집할 때만 화면에 나타나도록 한다.
  동적 컴포넌트를 이용하여 제어한다.



#### 기초 작업

src/components 디렉터리에 5개의 컴포넌트 파일을 생성한다.



##### 컴포넌트별 필요 데이터

- App.vue
  * currentView : 동적 컴포넌트로 보여줄 컴포넌트 지정
- ContactList.vue
  * contactlist : 연락처 목록 데이터
- AddContact.vue
- UpdateContact.vue
  * contact : 연락처 한 건 데이터
- ContactForm.vue
  - mode : 쓰기/수정 여부
- UpdatePhoto.vue
  - contact : 연락처 한 건 데이터



App.vue는 자식 컴포넌트들이 필요로 하는 데이터를 data 옵션을 이용해 중앙집중화하여 저장, 관리하며 하위 컴포넌트들에게 props를 통해 전달한다.



컴포넌트를 작성해나가는 방법은 상향식, 하향식으로 나눌 수 있다.

상향식은 하위 컴포넌트를 먼저 작성하고 상위 컴포넌트를 만들어가는 방법이며, 하향식은 그 반대이다.



페이징 처리를 위해 vuejs-paginate 라이브러리를 다운로드 한다.

```npm install --save vuejs-paginate```



axios는 Promise 기반이다. IE에서 Promise 객체를 지원하지 않으므로 별도의 polyfill 요소를 다운로드하고 참조한다.

```npm install --save es6-promise```



npm으로 설치가 완료되면 package.json이 생성된다.

dependencies 필드에 누락된 것이 없는지 확인하자.







