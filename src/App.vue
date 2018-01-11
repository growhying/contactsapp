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
  import UpdateContact from './components/UpdateContact';
  import UpdatePhoto from './components/UpdatePhoto';

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
      // 이벤트 버스에 전달될 이벤트 작성

      // 처음 실행시 첫 번째 페이지 데이터를 보여주기
      this.fetchContacts();

      // 모든 입력 폼에서 취소 버튼을 누르면 발생
      eventBus.$on("cancel", () => {
        this.currentView = null;
      });

      // 연락처 추가 이벤트
      eventBus.$on("addSubmit", (contact) => {
        this.currentView = null;
        this.addContact(contact);
      });

      // 연락처 수정 이벤트
      eventBus.$on("updateSubmit", (contact) => {
        this.currentView = null;
        this.updateContact(contact);
      });

      // 연락처 추가 폼 나타날 수 있도록 currentView를 addContact로 변경함
      eventBus.$on("addContactForm", () => {
        this.currentView = 'addContact';
      });

      // 변경 폼에 기존 연락처 데이터가 나타날 수 있도록 하며, currentView를 연락처 변경 폼으로 변경함
      eventBus.$on("editContactForm", () => {
        this.fetchContactOne(no);
        this.currentView = 'updateContact';
      });

      eventBus.$on("deleteContact", (no) => {
        this.deleteContact(no);
      });

      // currentView를 updatePhoto로 변경함
      eventBus.$on("editPhoto", (no) => {
        this.fetchContactOne(no);
        this.currentView = 'updatePhoto';
      });

      eventBus.$on("updatePhoto", (no, file) => {
        if (typeof file !== 'undefined') {
          this.updatePhoto(no, file);
        }
        this.currentView = null;
      });

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
      // 관찰 속성 작성
      // 다른 페이지를 조회하던 중 새로운 연락처를 추가하면 방금 추가한 연락처를 확인할 수 있도록 첫 번째 페이지로 이동
      // vuejs-paginate 컴포넌트는 pageno를 바인딩하지 않도록 만들어져 있으므로,
      // 관찰 속성을 이용해 직접 선택된 페이지 번호를 변경해 주어야 함
      ['contactlist.pageno'] : function() {
        this.$refs.pagebuttons.selected = this.contactlist.pageno - 1;
      }
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
