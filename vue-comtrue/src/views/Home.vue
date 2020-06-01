<!--
 * @Author: your name
 * @Date: 2020-05-15 14:40:41
 * @LastEditTime: 2020-05-21 10:43:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vue-awesome/vue-router/src/views/Home.vue
-->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>
