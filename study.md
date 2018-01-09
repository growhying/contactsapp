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
** axios(config)
** axios(url, config)

* 각 메소드별 별칭
** axios.get(url[, config])
** axios.delete(url[, config])
** axios.post(url[, data[, config]])
** axios.put(url[, data[, config]])
** axios.head(url[, data])
** axios.options(url[, data])


#### axios 요청과 config 옵션

* baseURL : 이 옵션을 이용해 공통적인 URL 앞부분을 미리 등록해두면 요청 시 나머지 부분만 요청 URL로 전달하면 된다.
가능하다면 axios.defaults.baseURL 값을 미리 바꾸는 것이 좋다.
* transformRequest : 요청 데이터를 서버로 전송하기 전에 데이터를 변환하기 위한 함수를 등록한다.
* transformResponse : 응답 데이터를 수신한 직후에 데이터를 변환하기 위한 함수를 등록한다.
* header : 요청 시에 서버로 전달하고자 하는 HTTP 헤더 정보를 설정한다.








