class GlobalAppInfo {
  #appId = "";
  #appName = "";
  #appDescription = "";

  setAppInfo(appInfo: Partial<AppInfo>) {
    this.#appId = appInfo.appId ?? "";
    this.#appName = appInfo.appName ?? "";
    this.#appDescription = appInfo.appDescription ?? "";
  }

  getAppInfo() {
    return {
      appId: this.#appId,
      appName: this.#appName,
      appDescription: this.#appDescription,
    };
  }
}

export const globalAppInfo = new GlobalAppInfo();
