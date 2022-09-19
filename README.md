## Introduction

A general login and authorization service developed with Vue3+TypeScript+qiankun micro front-end to provide the login page and single sign on callback page as the sub application of qiankun micro front-end

gitee (faster in China Mainland): [https://gitee.com/elton11220/micro-login](https://gitee.com/elton11220/micro-login)

Github: [https://github.com/elton11220/micro-login](https://github.com/elton11220/micro-login)

`Vue3 + TypeScript + qiankun`

## Installation

Clone the repo and install dependencies:

```shell
git clone _repoUrl_ your-project-name
cd your-project-name
yarn
```

## Starting Development

Start the app in the dev environment:

```shell
yarn serve
```

## qiankun micro-frontend

This application needs to be registered in the main application which uses 'qiankun', and does not support independent access

You need to inject the qiankun global state in the mounted hook(onMounted, useEffect) of the root component of the main application:
```TypeScript
interface MicroAppState {
  appId: string; // Fixed values need to be configured in the main application and passed while the root component is mounted
  appName?: string; // It can be obtained from the network and transferred asynchronously. It is recommended to use the cache value
  appDescription?: string; // It can be obtained from the network and transferred asynchronously. It is recommended to use the cache value
}
```

> According to [qiankun 3.0 Roadmap - BreakChanges](https://github.com/umijs/qiankun/discussions/1378)：`globalState API` will be removed. Consider providing a compatible alternative version later

## Packaging for Production

To package for production:

```shell
yarn build
```

> When running in production mode, this application can only exist in the form of micro front terminal application and cannot be accessed independently