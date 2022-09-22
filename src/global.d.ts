declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: boolean;
  }
  interface AppInfo {
    appId: string;
    appName: string;
    appDescription: string;
  }
}

export default {};
