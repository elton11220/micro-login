<template>
  <NMessageProvider>
    <router-view />
  </NMessageProvider>
</template>

<script setup>
import { NMessageProvider } from "naive-ui";
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
