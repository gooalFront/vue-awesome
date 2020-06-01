/*
 * @Author: your name
 * @Date: 2020-05-15 14:40:41
 * @LastEditTime: 2020-05-21 10:41:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-awesome/vue-router/src/router/index.js
 */
import Vue from "vue";
import VueRouterTab from "../../lib/vue-router-tab/index";
import Home from "../views/Home.vue";
import VueRouter from "vue-router";

Vue.use(VueRouterTab);
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Home",
    component: Home,
    tabName: "登陆",
    children: [
      {
        path: "chil",
        name: "path",
        tabName: "childTabName",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/About.vue"),
        children: [{ path: "chidchind/:id:password" }]
      }
    ]
  },
  {
    path: "/about/:id/:user",
    name: "About",
    tabName: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const routerTab = new VueRouterTab({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export { routerTab, router };
