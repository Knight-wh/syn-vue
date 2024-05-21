<script setup lang="ts">
import { Position } from "../type";
import { getRPColorFromIndex } from "../color";
import { reactive } from "vue";
const props = defineProps<{
  name: string;
  index: number;
  position?: Position;
}>();

const styleObj = reactive({
  fill: getRPColorFromIndex(props.index),
});
</script>

<template>
  <div
    class="absolute w-5 h-5 top-0 left-0 pointer-events-none"
    :style="{
      transform: `translate(${props.position?.left}px, ${props.position?.top}px)`,
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="-rotate-45 drop-shadow"
      viewBox="0 0 32 32"
    >
      <path
        class="stroke-base"
        :style="styleObj"
        d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
      />
    </svg>
    <span class="p-1 text-sm drop-shadow">{{ props.name }}</span>
  </div>
</template>
