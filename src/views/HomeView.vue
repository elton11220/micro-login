<template>
  <div class="container">
    <div class="aside">
      <div class="header">
        <img :src="NaiveLogo" />
        <div>#Company Name#</div>
      </div>
      <div class="slogan">#Company Slogan#</div>
      <div class="flex flex-col justify-center">
        <div class="tab">
          <div class="header">
            <div class="title select-none">内网统一认证</div>
          </div>
          <div class="content">
            <div class="infos">
              <div class="info">
                <div class="icon">
                  <NIcon color="#ccc" size="40">
                    <AppFolder24Regular />
                  </NIcon>
                </div>
                <div class="detail">
                  <div class="name">授权登录的应用</div>
                  <div class="value" v-if="globalState?.appName">
                    {{ globalState?.appName }}
                  </div>
                  <n-skeleton
                    text
                    :width="80"
                    :height="14"
                    :sharp="false"
                    v-else
                  />
                </div>
              </div>
              <div class="info">
                <div class="icon">
                  <NIcon color="#ccc" size="40">
                    <NumberSymbolSquare20Filled />
                  </NIcon>
                </div>
                <div class="detail">
                  <div class="name">授权应用唯一标识符</div>
                  <div class="value" v-if="globalState?.appId">
                    {{ globalState?.appId }}
                  </div>
                  <n-skeleton
                    text
                    :width="140"
                    :height="14"
                    :sharp="false"
                    v-else
                  />
                </div>
              </div>
              <div class="info">
                <div class="icon">
                  <NIcon color="#ccc" size="34">
                    <AppsListDetail24Regular />
                  </NIcon>
                </div>
                <div class="detail">
                  <div class="name">应用描述</div>
                  <div class="value" v-if="globalState?.appDescription">
                    {{ globalState?.appDescription }}
                  </div>
                  <n-skeleton text :height="14" :sharp="false" v-else />
                </div>
              </div>
            </div>
            <div class="auth" v-if="currentState !== CurrentState.unauthorized">
              <div class="avatars">
                <NSpin
                  :size="15"
                  stroke="#aaa"
                  v-if="currentState === CurrentState.gotSt"
                />
                <template v-else>
                  <NAvatar
                    round
                    :size="40"
                    color="#f3f4f5"
                    :src="basicUserInfo?.avatarUrl || ''"
                  />
                  <div class="dash">
                    <div
                      class="indicator"
                      :style="{
                        backgroundColor:
                          currentState === CurrentState.authorized
                            ? '#27c346'
                            : currentState === CurrentState.forbidden
                            ? '#f76965'
                            : '#eee',
                      }"
                    >
                      <NSpin
                        v-if="currentState === CurrentState.callback"
                        :size="10"
                        stroke="#aaa"
                        :stroke-width="40"
                      />
                      <NIcon color="#fff" size="13" v-else>
                        <Checkmark12Regular />
                      </NIcon>
                    </div>
                  </div>
                  <NAvatar round :size="40" color="#fff" :src="NaiveLogo" />
                </template>
              </div>
              <div class="desc select-none">
                {{ AuthResultTitle[currentState] }}
              </div>
            </div>
            <button
              class="btn-container"
              @click="btnLoginClick"
              v-if="
                currentState !== CurrentState.callback &&
                currentState !== CurrentState.gotSt
              "
              :disabled="!isAppInfoLoaded || loginBtnLoading"
            >
              <NIcon
                color="#fff"
                size="18"
                v-if="
                  currentState === CurrentState.unauthorized && !loginBtnLoading
                "
              >
                <ShieldLock16Filled />
              </NIcon>
              <NSpin v-if="loginBtnLoading" :size="14" stroke="#fff" />
              <span>{{ LoginBtnTitle[currentState] }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="footer">本系统使用qiankun微前端技术构建</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import NaiveLogo from "@/assets/naiveLogo.svg";
import { NIcon, NAvatar, NSpin, useMessage, NSkeleton } from "naive-ui";
import {
  ShieldLock16Filled,
  AppFolder24Regular,
  AppsListDetail24Regular,
  NumberSymbolSquare20Filled,
  Checkmark12Regular,
} from "@vicons/fluent";
import { ref, onMounted, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ssoServer, ssoClient, stMaxAge } from "@/utils/constants";

enum CurrentState {
  unauthorized,
  authorized,
  forbidden,
  callback,
  gotSt,
}

enum LoginBtnTitle {
  "单点登录",
  "登录",
  "切换账号",
  "请稍候",
  "",
}

enum AuthResultTitle {
  "",
  "您拥有该应用的访问权限",
  "您没有该应用的访问权限",
  "正在检查访问权限，请稍候",
  "正在验证登录信息，请稍候",
}

interface BasicUserInfo {
  identifier: string;
  nickname: string;
  lastLoginAt: string;
  lastLoginIp: string;
  avatarUrl: string;
  roles: string[];
}

const route = useRoute();
const router = useRouter();
const message = useMessage();

const currentState = ref<CurrentState>(CurrentState.unauthorized);

const basicUserInfo = ref<BasicUserInfo | null>(null);

const loginBtnLoading = ref<boolean>(false);

const globalState = inject<{
  appName: string;
  appId: string;
  appDescription: string;
}>("globalState");

const isAppInfoLoaded = computed<boolean>(
  () =>
    (globalState &&
      globalState?.appName !== "" &&
      globalState?.appId !== "" &&
      globalState?.appDescription !== "") ||
    false
);

onMounted(() => {
  const localSt = window.localStorage.getItem("st");
  const localStExpires = window.localStorage.getItem("stExpires");
  const localBasicUserInfoRaw = window.localStorage.getItem("basicUserInfo");
  const now = new Date().getTime();
  if (route.query.st && route.query.target) {
    currentState.value = CurrentState.callback;
    const { protocol, host, pathname } = window.location;
    const { st, target } = route.query;
    const currentHost = `${protocol}//${host}${pathname}`;
    if (currentHost === decodeURIComponent(target as string)) {
      // 从登录页手动登录，不自动获取token
      currentState.value = CurrentState.gotSt;
      validateSt(st as string, "com.yjh.managesystem");
    } else {
      // 从其他页面直接登录并携带st和target访问/login，自动登录
      login(st as string, "com.yjh.managesystem", target as string);
    }
  } else if (
    localSt &&
    localStExpires &&
    localBasicUserInfoRaw &&
    now + 1000 * 20 < Number.parseInt(localStExpires)
  ) {
    // 本地存在ST且非回调页面
    basicUserInfo.value = JSON.parse(localBasicUserInfoRaw);
    validateSt(localSt, "com.yjh.managesystem");
    currentState.value = CurrentState.authorized;
  }
});

const validateSt = (st: string, appId: string) => {
  fetch(`${ssoServer}/auth/validateSt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      st,
      appId: "com.yjh.managesystem",
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 200) {
        basicUserInfo.value = json.data;
        window.localStorage.setItem("basicUserInfo", JSON.stringify(json.data));
        window.localStorage.setItem("st", st as string);
        window.localStorage.setItem(
          "stExpires",
          (new Date().getTime() + stMaxAge).toString()
        );
        currentState.value = CurrentState.authorized;
      } else {
        message.error(json.msg);
        currentState.value = CurrentState.unauthorized;
        window.localStorage.clear();
        router.replace("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const login = (st: string, appId: string, target: string) => {
  loginBtnLoading.value = true;
  fetch(`${ssoServer}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    referrer: window.location.href,
    referrerPolicy: "unsafe-url",
    body: JSON.stringify({
      st,
      appId,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 200) {
        message.success("登录成功");
        window.localStorage.clear();
        window.localStorage.setItem("token", json.data.token);
        const basicUserInfo = { ...json.data };
        delete basicUserInfo.token;
        window.localStorage.setItem(
          "basicUserInfo",
          JSON.stringify(basicUserInfo)
        );
        window.location.replace(target);
      } else if (json.code === 403) {
        currentState.value = CurrentState.forbidden;
        message.error(json.msg);
        router.replace("/");
      } else {
        message.error("请重新登录");
        currentState.value = CurrentState.unauthorized;
        window.localStorage.clear();
        router.replace("/");
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loginBtnLoading.value = false;
    });
};

const btnLoginClick = () => {
  if (currentState.value === CurrentState.unauthorized) {
    window.location.href = `${ssoClient}/?redirect=${encodeURIComponent(
      window.location.href
    )}`;
  } else if (currentState.value === CurrentState.authorized) {
    const st = window.localStorage.getItem("st");
    const stExpires = window.localStorage.getItem("stExpires");
    const now = new Date().getTime();
    if (st && stExpires && now < Number.parseInt(stExpires) - 1000 * 10) {
      // st有效，进行登录并返回到首页
      const { protocol, host } = window.location;
      login(st, "com.yjh.managesystem", `${protocol}//${host}`);
    } else {
      // st过期或将要过期
      currentState.value = CurrentState.unauthorized;
      message.warning("登录已失效");
      window.localStorage.clear();
      router.replace("/");
    }
  } else if (currentState.value === CurrentState.forbidden) {
    window.location.href = `${ssoClient}/logout?redirect=${encodeURIComponent(
      window.location.href
    )}`;
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-image: url("@/assets/background.png");
  background-size: contain;
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
  > .aside {
    width: 550px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 0;
    position: relative;
    .header {
      display: flex;
      align-items: center;
      gap: 15px;
      > img {
        height: 36px;
        width: 36px;
        font-size: 14px;
      }
    }
    .slogan {
      padding: 12px 0 40px 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
    .tab {
      width: 328px;
      display: flex;
      flex-direction: column;
      > .header {
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: center;
        > .title {
          padding: 10px 0;
          font-size: 14px;
          color: #1677ff;
          position: relative;
          cursor: pointer;
          &::after {
            content: "";
            position: absolute;
            width: 100%;
            border-bottom: 2px solid #1677ff;
            bottom: -1px;
            left: 0;
          }
        }
      }
      > .content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding-top: 20px;
        > .infos {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          > .info {
            display: flex;
            gap: 10px;
            > .icon {
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            > .detail {
              display: flex;
              flex-direction: column;
              gap: 5px;
              width: calc(328px - 10px - 40px);
              > .name {
                font-size: 14px;
                color: #333639;
              }
              > .value {
                font-size: 12px;
                color: #9e9e9e;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                white-space: nowrap;
              }
            }
          }
        }
        > .auth {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          > .avatars {
            display: flex;
            justify-content: center;
            align-items: center;
            > .dash {
              width: 90px;
              border-bottom: 2px dashed #d8d8d8;
              position: relative;
              > .indicator {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);
                border-radius: 50%;
                width: 15px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
              }
            }
          }
          > .desc {
            padding: 10px;
            color: #9e9e9e;
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
    > .footer {
      position: absolute;
      width: 100%;
      height: 80px;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #9e9e9e;
      font-size: 12px;
    }
  }
}
.btn-container {
  height: 40px;
  width: 328px;
  background-color: #1677ff;
  outline: none;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 7px 15px;
  overflow: hidden;
  color: #fff;
  font-size: 14px;
  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: #3c7eff;
  }
  &:active {
    transition: background-color 0.1s ease;
    background-color: #1d4dd2;
  }
  &:disabled {
    background-color: #93beff;
  }
}
</style>
