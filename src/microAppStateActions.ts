import type {
  MicroAppStateActions,
  OnGlobalStateChangeCallback,
} from "qiankun";

type InnerActions = Pick<
  MicroAppStateActions,
  "onGlobalStateChange" | "setGlobalState"
>;

type emptyActions = {
  onGlobalStateChange: null;
  setGlobalState: null;
};

class Actions {
  #actions: InnerActions | emptyActions = {
    onGlobalStateChange: null,
    setGlobalState: null,
  };

  #emptyWarn() {
    console.warn("当前执行的Action为空\n您是否初始化Actions或正确配置qiankun微前端环境？");
  }

  setActions(actions: any) {
    this.#actions = actions;
  }

  onGlobalStateChange(
    callback: OnGlobalStateChangeCallback,
    fireImmediately?: boolean
  ) {
    if (this.#actions.onGlobalStateChange !== null) {
      this.#actions.onGlobalStateChange.call(this, callback, fireImmediately);
    } else {
      this.#emptyWarn();
    }
  }

  setGlobalState(state: Record<string, any>): boolean {
    if (this.#actions.setGlobalState !== null) {
      return this.#actions.setGlobalState(state);
    } else {
      this.#emptyWarn();
      return false;
    }
  }
}

export const microAppStateActions = new Actions();
