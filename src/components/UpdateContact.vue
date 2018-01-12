<template>
  <contactForm mode="update" :contact="contact" />
</template>

<script>
  import ContactForm from './ContactForm.vue';

  // App.vue로부터 전달받은 속성을 ContactForm.vue에 다시 전달함
  // ContactForm.vue는 mode가 'update'인 경우에 contact 속성을 전달받아 화면에 뿌려주고 값을 수정할 수 있도록 함
  export default {
    name: "updateContact",
    components: { ContactForm },
    props: ['contact']
  }
</script>
