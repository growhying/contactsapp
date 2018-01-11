<template>
  <div id="container">
    <div class="page-header">
      <h1 class="text-center">"연락처 관리 애플리케이션"</h1>
      <p>"(Dynamic Component + EventBus + Axios)"</p>
    </div>
    <component :is="currentView" :contact="contact"></component>
    <contactlist :contactlist="contactlist"></contactlist>
    <pagenate ref="pagebuttons"
              :page-count="totalpage"
              :page-range="7"
              :margin-pages="3"
              :click-handler="pageChanged"
              :prev-text="'이전'"
              :next-text="'다음'"
              :container-class="'pagination'"
              :page-class="'page-item'">
    </pagenate>
  </div>
</template>

<script>
  import Vue from 'vue';

  // 컴포넌트 참조
  import ContactList from './components/ContactList';
  import AddContact from './components/AddContact';
  import UpdateContact from './component/UpdateContact';
  import UpdatePhoto from './component/UpdatePhoto';

  import CONF from './Config.js';
  import eventBus from './EventBus.js';
  import Paginate from 'vuejs-paginate';

  export default {
    name: 'app',
    // 참조한 컴포넌트 사용 위해 옵션 등록
    components: { ContactList, AddContact, UpdateContact, UpdatePhoto, Paginate },
    // 하위 컴포넌트들이 필요로 하는 데이터를 이 곳에서 관리 하기 위해 모든 필요 데이터의 초기 상태 저장
    data: function () {
      return {
        currentView : null,
        contact : { no: 0, name: '', tel: '', address: '', photo: '' },
        contactlist : {
          pageno: 1, pagesize: CONF.PAGESIZE, totalcount: 0, contacts: []
        }
      }
    },

    mounted: function() {

    },
    computed: {

    },
    methods: {

    },
    watch: {

    }
  }
</script>

<style scoped>
  @import url("https://cdn.bootcss.com/bootstra/3.3.5/css/bootstrap.css");

  #container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2C3E50;
    margin-top: 60px;
  }
</style>
