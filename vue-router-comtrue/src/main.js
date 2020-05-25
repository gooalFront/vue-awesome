/*
 * @Author: your name
 * @Date: 2020-05-15 14:40:41
 * @LastEditTime: 2020-05-21 10:40:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-awesome/vue-router/src/main.js
 */
import Vue from "vue";
import App from "./App.vue";
import { router, routerTab } from "./router";
console.log(router);
Vue.config.productionTip = false;

new Vue({
  routerTab,
  router,
  render: (h) => h(App)
}).$mount("#app");
