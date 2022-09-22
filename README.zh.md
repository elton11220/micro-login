## 介绍

使用Vue3+TypeScript+qiankun微前端开发的通用登录、授权服务，作为qiankun微前端的子应用为主应用提供登录页面及单点登录回调页面

码云： [https://gitee.com/elton11220/micro-login](https://gitee.com/elton11220/micro-login)

Github: [https://github.com/elton11220/micro-login](https://github.com/elton11220/micro-login)

`Vue3 + TypeScript + qiankun`

## 安装

克隆仓库并安装依赖：

```shell
git clone _仓库地址_ 你的本地文件夹名称
cd 你的本地文件夹名称
yarn
```

## 开始开发

在开发环境启动服务：

```shell
yarn serve
```

## qiankun微前端

本应用需要注册到其他使用qiankun微前端的主应用，不支持独立访问

需要在主应用根组件的mounted钩子函数(onMounted, useEffect)中注入qiankun全局状态：
```TypeScript
interface MicroAppState {
  appId: string; // 需要在主应用中配置固定值，在加载根组件挂载时传递
  appName?: string; // 可以从网络获取并异步传入，建议使用缓存值
  appDescription?: string; // 可以从网络获取并异步传入，建议使用缓存值
}
```

> ~~根据 [qiankun 3.0 Roadmap - BreakChanges](https://github.com/umijs/qiankun/discussions/1378)：`globalState API` 将会被移除，后续考虑提供兼容的替代版本~~
<br/>该问题在 [commit-d861af9](https://gitee.com/elton11220/micro-login/commit/d861af93d6fe371bbf3954a95aba677d88fa3d28) 中得到了修复

## 打包项目

打包项目用于生产环境：

```shell
yarn build
```

> 以生产模式运行时本应用只能以微前端子应用形式存在，不能独立访问