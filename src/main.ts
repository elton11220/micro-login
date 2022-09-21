import "./public-path";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import { routes } from "@/router";
import { microAppStateActions } from "./microAppStateActions";

let router = null;
// @ts-ignore
let app = null;
let history = null;
function render(props = {}) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[22.09.19] 开发环境警告：GlobalState API在qiankun 3.0版本中将会被移除\n后期版本考虑使用新的兼容方法替代"
    );
  }
  if (props) {
    microAppStateActions.setActions(props);
  }
  // @ts-ignore
  const { container } = props;
  history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? "/login" : "/");
  router = createRouter({
    history,
    routes,
  });
  app = createApp(App)
    .use(router)
    .mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_QIANKUN__) {
  if (process.env.NODE_ENV === "development") {
    render();
    console.warn(
      "\n您正在development环境中运行该应用\n以production环境运行时，将不允许脱离qiankun微前端基座访问该应用"
    );
  } else {
    console.error(
      "不允许脱离qiankun微前端基座访问该应用，请在qiankun微前端的主应用中访问"
    );
  }
}

export async function bootstrap() {
  //
}

export async function mount(props: any) {
  render(props);
}

export async function unmount() {
  // @ts-ignore
  app = null;
  history = null;
  router = null;
}
