import Vue from "vue";
import App from "./App.vue";
import { router, routerTab } from "./router";
import Vuex from "../lib/vuex/index";
console.log(Vuex);

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    count: 0
  },
  actions: {
    add({ commit }) {
      commit("add");
      return true;
    }
  },
  mutations: {
    add({ state }) {
      console.log(state);
      state.count += 1;
    }
  },
  getters: {
    count: (state) => state.count
  }
});

console.log(router);
Vue.config.productionTip = false;

new Vue({
  routerTab,
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
