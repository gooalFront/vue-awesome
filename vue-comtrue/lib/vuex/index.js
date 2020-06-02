/*
 * @author joke
 * @time 2020-06-01 14:14:11 周一
 * @desc vuex核心实现
 */
let Vue;
class Store {
  constructor(options) {
    this.state = new Vue({
      data: options.state
    });
    this.mutations = options.mutations || {};
    this.handleGetters(options.getters);
    this.actions = options.actions || {};
  }
  // add commit
  commit = (type, arg) => {
    console.log(this);
    this.mutations[type]({ state: this.state }, arg);
  };

  // add dispatch
  dispatch = (type, arg) => {
    const res = this.actions[type](
      {
        commit: this.commit,
        state: this.state,
        getters: this.getters
      },
      arg
    );
    return Promise.resolve(res);
  };

  // 创建只读getters
  handleGetters(getters) {
    this.getters = {};
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        }
      });
    });
  }
}

const install = function(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
};
export default { Store, install };
