<!--
 * @Author: your name
 * @Date: 2020-05-15 14:40:41
 * @LastEditTime: 2020-05-21 10:38:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-awesome/vue-router/src/App.vue
-->
<template>
  <div id="app">
    <div id="nav">
      <tab-view></tab-view>
    </div>
    <div @click="handleClick">/login/chil?name=12&age=18</div>
    <div @click="handleClick2">/login/12</div>
    <div @click="handleClick3">/login/chil?name=13&age=19/</div>
    <router-tab-view></router-tab-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$route);
  },
  methods: {
    handleClick() {
      console.log(this);
      this.$routeTab.openTab("/login/chil?name=12&age=18", "childTab");
    },
    handleClick2() {
      console.log(this);
      this.$routeTab.openTab("/login/12", "homeTab");
    },
    handleClick3() {
      console.log(this);
      this.$routeTab.openTab("/login/chil?name=13&age=19", "childTab2");
    }
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
