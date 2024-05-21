<script setup lang="ts">
import DrawArea from "./components/DrawArea.vue";
import OnlineAside from "./components/OnlineAside.vue";
import { useAppState } from "./hooks/useAppState";

const appState = useAppState();
</script>

<template>
  <div class="flex items-stretch h-screen">
    <DrawArea
      :boxes="appState.boxesState.value"
      :remote-users="appState.remoteUsers.value"
      :dragState="appState.isDragging() ? 'dragging' : appState.localUser.value ? 'ready' : 'none'"
      @pointer-move="appState.moveCursor"
      @pointer-up="appState.releaseCursor"
      @on-box-pointer-down="appState.boxCursorDown"
      @on-box-double-click="appState.boxDelete"
    />
    <OnlineAside
      :remote-users="appState.remoteUsers.value"
      :local-user="appState.localUser.value"
      @login="appState.handleLogin"
    />
  </div>
</template>

<style scoped></style>
