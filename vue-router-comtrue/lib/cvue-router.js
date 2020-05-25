/**
 * VueRouter 实现
 * 解析routes
 * 监听事件
 * 声明组件
 */
let Vue;
class VueRouter {
  constructor(options) {
    this.$options = options;
    this.current = new Vue({
      data: {
        path: window.location.hash.slice(1) || "/"
      }
    });
    this.routeMaps = {};
  }

  bindEvents() {
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.current.path = window.location.hash.slice(1) || "/";
  }

  createRouteMap() {
    this.$options.routes.forEach((route) => {
      this.routeMaps[route.path] = route;
    });
  }

  initComponent() {
    const _this = this;
    Vue.component("router-link", {
      name: "router-link",
      props: {
        to: String
      },
      render() {
        return (
          /**
           * compile router-link as a;
           * computed actived class as "router-link-exact-active";
           */
          <a
            class={
              _this.current.path === this.to ? "router-link-exact-active" : ""
            }
            href={"#" + this.to}>
            {this.$slots.default}
          </a>
        );
      }
    });

    Vue.component("router-view", {
      name: "router-view",
      render: (h) => {
        const component = this.routeMaps[this.current.path].component;
        return h(component);
      }
    });
  }

  init() {
    this.bindEvents();
    this.createRouteMap();
    this.initComponent();
  }
}

VueRouter.install = function(_vue) {
  Vue = _vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
        this.$options.router.init();
      }
    }
  });
};

export default VueRouter;
