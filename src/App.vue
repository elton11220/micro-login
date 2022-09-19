<template>
  <NMessageProvider>
    <router-view />
  </NMessageProvider>
</template>

<script lang="ts" setup>
import { NMessageProvider } from "naive-ui";
import { microAppStateActions } from "./microAppStateActions";
import { onMounted, provide, reactive } from "vue";

const globalState = reactive({
  appName: "",
  appId: "",
  appDescription: "",
});

provide("globalState", globalState);

onMounted(() => {
  microAppStateActions.onGlobalStateChange((state, prev) => {
    if (
      state.appName &&
      (state.appName !== prev.appName || !globalState.appName)
    ) {
      globalState.appName = state.appName;
    }
    if (state.appId && (state.appId !== prev.appId || !globalState.appId)) {
      globalState.appId = state.appId;
    }
    if (
      state.appDescription &&
      (state.appDescription !== prev.appDescription ||
        !globalState.appDescription)
    ) {
      globalState.appDescription = state.appDescription;
    }
  }, true);
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.flex-col {
  flex-direction: column;
}

.select-none {
  user-select: none;
}
</style>
