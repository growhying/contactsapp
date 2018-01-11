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
      // 전체 연락처 건수를 페이지 사이즈로 나누어 계산해야 하므로 계산형 속성이 적합
      totalpage: function() {
        return Math.floor((this.contactlist.totalcount - 1) / this.contactlist.pagesize) + 1;
      }
    },
    methods: {
      /*
      * - 필요 인자 : page
      * - 보여줄 페이지를 변경.
      * - data 속성의 contactlist 정보 변경 후 fetchContacts 호출
      * - Paginate에서 이 함수를 바인딩함
      * */
      pageChanged : function(page) {
        this.contactlist.pageno = page;
        this.fetchContacts();
      },

      /*
      * - 필요 인자 : pageno, pagesize
      * - 전체 연락처 데이터를 페이징하여 조회
      * - pageno, pagesize는 data 속성의 contactlist 활용
      * */
      fetchContacts: function() {
        this.$axios.get(CONF.FETCH, {
          params: {
            pageno: this.contactlist.pageno,
            pagesize: this.contactlist.pagesize
          }
        }).then((response) => {
          this.contactlist = response.data;
        }).catch((ex) => {
          console.log('fetchContacts failed : ', ex);
          this.contactlist.contacts = [];
        })
      },

      addContact: function(contact) {
        this.$axios.post(CONF.ADD, contact)
        .then((response) => {
          this.contactlist.pageno = 1;
          this.fetchContacts();
        })
        .catch((ex) => {
          console.log('addContact failed : ', ex);
        })
      },

      updateContact: function(contact) {
        this.$axios.put(CONF.UPDATE.replace("${no}", contact.no), contact)
        .then((response) => {
          this.fetchContacts();
        })
        .catch((ex) => {
          console.log('updateContact failed : ', ex);
        })
      },

      fetchContactOne: function(no) {
        this.$axios.get(CONF.FETCH_ONE.replace("${no}", no))
        .then((response) => {
          this.contact = response.data;
        })
        .catch((ex) => {
          console.log('fetchContactOne failed : ', ex);
        })
      },

      deleteContact: function(no) {
        this.$axios.delete(CONF.DELETE.replace('${no}', no))
        .then((response) => {
          this.fetchContacts();
        })
        .catch((ex) => {
          console.log('deleteContact failed : ', ex);
        })
      },

      updatePhoto: function(no, file) {
        var data = new FormData();
        data.append('photo', file);

        this.$axios.post(CONF.UPDATE_PHOTO.replace("${no}", no), data)
        .then((response) => {
          this.fetchContacts();
        })
        .catch((ex) => {
          console.log('updatePhoto failed: ', ex);
        })
      }

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
