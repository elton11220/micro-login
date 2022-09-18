<template>
  <div class="container">
    <div class="aside">
      <div class="header">
        <img :src="NaiveLogo">
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
                <div class="icon">1</div>
                <div class="detail">
                  <div class="name">授权登录的应用</div>
                  <div class="value">内网管理系统</div>
                </div>
              </div>
              <div class="info">
                <div class="icon">1</div>
                <div class="detail">
                  <div class="name">授权应用唯一标识符</div>
                  <div class="value">com.yjh.managesystem</div>
                </div>
              </div>
              <div class="info">
                <div class="icon">1</div>
                <div class="detail">
                  <div class="name">应用描述</div>
                  <div class="value">用于管理企业内网系统用户、角色、权限，人事管理等功能</div>
                </div>
              </div>
            </div>
            <button class="btn-container">单点登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import NaiveLogo from "@/assets/naiveLogo.svg";
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
      color: rgba(0,0,0,.65);
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
      }
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
}
</style>
