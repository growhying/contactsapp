// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import App from './App'
import App from './AppAxiosTest.vue'
import axios from 'axios';

// prototype에 axios를 추가하면 Vue 인스턴스 내부에서 axios를 더 간단하게 사용할 수 있다.
Vue.prototype.$axios = axios;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
