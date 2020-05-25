/**
 * @project vue-router-tab
 * @author joke
 * @email wendianyang@gmail.com
 * @description 重写路由，能够打开新标签
 * @time 2020-05-21
 * vue-router-tab
 * 点击router-link生成一个新标签，需要重写router-link
 *
 * 1,install 收集路由，生成路由映射表
 * 2,openTab 找到对应的组件，渲染输出，收集所有的组件容器，当前组件容器显示，其他隐藏
 * 3,closeTab 恢复显示已显示容器的最后一个，如果是最后一个不允许删除
 * 4,设置tab右键菜单
 *
 * TODO globalConfig
 *  alwaysOpenTab:false, 是否总是重开tab，
 *    false：当url参数一致时不重开只切换tab，query不一致打开新页面
 *    true：总是重开
 *  toggleRefresh:false 切换tab是否刷新页面，考虑可在路由信息里单独配置，单独配置大于全局配置
 *    false 不刷新，保留历史记录
 *    true 总是刷新
 */
let Vue;
class VueRouterTab {
  constructor({ mode, base, routes }) {
    /**
     * cacheRouteWraps<Object>[]
     * tabName:'',          // tab名称
     * icon:'',             // icon class
     * url:'',              // url地址
     * encodeHash:'',       // 加密后的hash 用作id
     * openId:'', // 全路径带参数加密id
     * id:'',
     * query:{},            // url 参数 ?name=joke {name:joke}
     * params:{},           // url 参数 /url/123  {param:123}
     * fullPath:'',         // 匹配的全路径
     * path:''              // route路径
     */
    this.routes = routes;
    this.cacheRouteWraps = [];
    this.cacheRouteMaps = {};
    this.routeMap = {};
    // 当前激活的路由信息
    this.current = null;
  }

  init() {
    // set data reactive
    this.setReactiveData();
    this.initRouterTabView();
    this.createRouteMap();
    this.initLocation();
  }

  /**
   * 打开新的标签页
   * @param {String} url
   * @param {String} name
   * @param {String} icon
   */
  openTab(url, tabName = "", icon = "") {
    const matchUrlItem = this._parse(url);
    if (
      !matchUrlItem ||
      (matchUrlItem.fullPath === "/" &&
        url !== "/" &&
        !matchUrlItem.args.length)
    ) {
      // Redirect to 404 or first route page
      throw new Error(`${url}(Page Not Found)`);
    }
    const matchItem = {
      tabName: tabName || matchUrlItem.tabName || "未命名标签",
      openId: window.btoa(url), // 用全路径作为id，当query不一致时也重开tab
      openPath: url,
      url: matchUrlItem.fullPath,
      icon,
      query: matchUrlItem.query,
      params: matchUrlItem.params,
      id: matchUrlItem.id,
      component: matchUrlItem.component
    };

    this.current.data = matchItem;

    if (!this.cacheRouteMaps[matchItem.openId]) {
      this.current.data = matchItem;
      this.cacheRouteMaps[matchItem.openId] = matchItem;
      this.cacheRouteWraps.data.push(matchItem);
    } else {
      // TODO toggle wrap
    }
    window.location.hash = url;
  }

  /**
   * 关闭标签页
   */
  closeTab(tabItem, index) {
    if (this.cacheRouteWraps.data.length === 1) return;
    let activeIndex = this.cacheRouteWraps.data.findIndex(
      (v) => v.openId === this.current.data.openId
    );
    if (activeIndex !== -1) {
      this.cacheRouteWraps.data.splice(index, 1);
      delete this.cacheRouteMaps[tabItem.openId];
      if (this.current.data.openId === tabItem.openId) {
        this.current.data =
          this.cacheRouteWraps.data[activeIndex] ||
          this.cacheRouteWraps.data[this.cacheRouteWraps.data.length - 1];
      }
    }
  }

  /**
   *设置响应式数据
   */
  setReactiveData() {
    this.cacheRouteWraps = new Vue({
      data: {
        data: []
      }
    });
    this.current = new Vue({
      data: {
        data: null
      }
    });
  }

  /**
   * 解析urlmap
   * 初始化创建路由映射表
   * reg /:[\S]+/ = :id:user querys = str.split(':')
   */
  createRouteMap() {
    let stack = [];
    let map = {};
    if (!this.routes || !this.routes.length) return;
    for (let i = 0; i < this.routes.length; i++) {
      this.routes[i].root = true;
      stack.push(this.routes[i]);
    }
    let fullPath = "";
    while (stack.length) {
      let item = stack.shift();
      const url = this._formatInitRouteConfig(item.path).url;
      if (item.root) {
        fullPath = url;
      } else {
        fullPath === "/" ? (fullPath += url) : (fullPath += "/" + url);
      }
      // get fullPath
      item.fullPath = fullPath;
      // encode url to id
      item.id = window.btoa(fullPath);

      const routeItem = Object.assign(
        item,
        this._formatInitRouteConfig(item.path)
      );
      map[routeItem.fullPath] = item;

      if (item.children && item.children.length) {
        stack.unshift(...item.children);
      }
    }
    this.routeMap = map;
  }

  /**
   * 初始化格式url，提取params 和 query，params的key用args标记
   */
  _formatInitRouteConfig(url) {
    let obj = {
      url,
      params: {},
      query: {},
      args: []
    };
    if (url.indexOf(":") !== -1) {
      const regMatch = url.match(/:[\S]+/);
      regMatch[0] = regMatch[0].replace("/", "");
      obj.url = url.substring(
        0,
        regMatch.index === 1 ? regMatch.index : regMatch.index - 1
      );
      const keys = regMatch[0].split(":").filter((v) => v);
      keys.forEach((v) => {
        obj.params[v] = null;
      });
      obj.args = keys;
    }
    return obj;
  }

  /**
   * 跳转的时候解析url，收集query，params
   */
  _parse(url) {
    const allMatchUrls = Object.keys(this.routeMap)
      .filter((v) => url.startsWith(v))
      .sort((a, b) => b.length - a.length);

    let currentMatchItem = this.routeMap[allMatchUrls[0]] || null;
    if (currentMatchItem) {
      // parse query
      if (window.location.href.indexOf("?") !== -1) {
        let query = window.location.hash.split("?")[1];
        let queryString = query.split("&");
        let obj = {};
        query = queryString.forEach((v) => {
          const item = v.split("=");
          obj[item[0]] = item[1];
        });
        currentMatchItem.query = obj;
      } else if (
        // parse params
        window.location.hash !== currentMatchItem.url &&
        window.location.hash.substring(1).startsWith(currentMatchItem.url)
      ) {
        const params = window.location.hash
          .split(currentMatchItem.url)[1]
          .split("/")
          .filter((v) => v);
        currentMatchItem.args.forEach((v, index) => {
          currentMatchItem.params[v] = params[index];
        });
      }
    }
    // else to 404

    return currentMatchItem;
  }

  /**
   * 初始化app时，解析url
   */
  initLocation() {
    const hash = window.location.hash;
    const firshRoute = this.routes[0];
    let path = "";
    let tabName = "";
    if (!hash) {
      window.location.href += "#" + firshRoute.path;
      path = firshRoute.path;
      tabName = firshRoute.tabName || "未命名标签";
    } else {
      path = window.location.hash.substring(1);
    }
    this.openTab(path, tabName, "");
  }

  /**
   * 初始化容器
   */
  initRouterTabView() {
    const _this = this;
    Vue.component("router-tab-view", {
      name: "router-tab-view",
      props: {
        extendCalss: String
      },
      render(h) {
        return (
          <div class="router-tab-item-wrap">
            {_this.cacheRouteWraps.data.map((v) => {
              return (
                <div
                  class="vue-router-tab-item"
                  {...this.$attrs}
                  style={
                    _this.current.data.openId === v.openId
                      ? { display: "block" }
                      : { display: "none" }
                  }>
                  {h(v.component)}
                </div>
              );
            })}
          </div>
        );
      }
    });

    Vue.component("tab-view", {
      name: "tab-view",
      methods: {
        handleTabCick({ openPath, tabName, icon }) {
          _this.openTab(openPath, tabName, icon);
        },
        handleCloseTab(cacheWrap, index) {
          _this.closeTab(cacheWrap, index);
        }
      },
      data() {
        return {
          ulStyle: {
            width: "100%",
            boxSizing: "border-box",
            listStyle: "none",
            padding: "0",
            margin: "0",
            overflow: "hidden",
            display: "block",
            clear: "both",
            content: ""
          },
          style: {
            float: "left",
            width: "120px",
            height: "34px",
            padding: "0 6px",
            lineHeight: "34px",
            borderRight: "1px solid #eee",
            background: "#eee",
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }
        };
      },
      render() {
        return (
          <ul class="tab-view" style={this.ulStyle}>
            {_this.cacheRouteWraps.data.map((cacheWrap, index) => {
              return (
                <li
                  style={this.style}
                  class={
                    _this.current.data.openPath === cacheWrap.openPath
                      ? "active"
                      : ""
                  }>
                  <span onClick={this.handleTabCick.bind(this, cacheWrap)}>
                    {cacheWrap.tabName || "未命名标签"}
                  </span>
                  <span
                    onClick={this.handleCloseTab.bind(this, cacheWrap, index)}>
                    x
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }
    });
  }

  /**
   * 设置数据响应
   * @param {any}} data
   */
  _setReactive(data) {
    const vm = new Vue({
      data: {
        data
      }
    });
    return vm;
  }
}

VueRouterTab.install = function(_vue) {
  Vue = _vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.routerTab) {
        Vue.prototype.$routeTab = this.$options.routerTab;
        this.$options.routerTab.init();
        console.log(this.$routeTab);
      }
    }
  });
};

export default VueRouterTab;
