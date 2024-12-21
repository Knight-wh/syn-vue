<script setup lang="ts">
import { Map as YMap } from "yjs";
import { Position, DrawableBox } from "../type";
import { getRPColorFromName } from "../color";
import { ref } from "vue";
import { useSyncMap2 } from "../hooks/useSync";
const props = defineProps<{
  box: YMap<any>;
  index: number;
  dragState: "dragging" | "ready" | "none";
}>();
const emit = defineEmits<{
  pointerDown: [pos: Position, index: number, type: "move" | "resize"];
  doubleClick: [index: number];
}>();

const resizeRef = ref<HTMLDivElement>();

const boxMap = useSyncMap2<DrawableBox>(props.box, [
  "size",
  "position",
  "color",
]);
</script>

<template>
  <div
    class="absolute flex items-end justify-end rounded top-0 left-0 border border-base"
    :style="{
      width: `${boxMap.size.value.width}px`,
      height: `${boxMap.size.value.height}px`,
      backgroundColor: getRPColorFromName(boxMap.color.value),
      transform: `translate(${boxMap.position.value.left}px, ${boxMap.position.value.top}px)`,
      cursor:
        props.dragState === 'dragging'
          ? 'grabbing'
          : props.dragState === 'ready'
          ? 'grab'
          : undefined,
    }"
    @dblclick="emit('doubleClick', props.index)"
    @pointerdown="
      (event) => {
        if (event.target !== resizeRef) {
          emit(
            'pointerDown',
            { top: event.clientY, left: event.clientX },
            props.index,
            'move'
          );
        }
      }
    "
  >
    <div
      ref="resizeRef"
      class="h-3 w-3 rounded-br border-r-2 border-b-2 border-base mb-1 mr-1"
      :style="{
        cursor: props.dragState === 'none' ? undefined : 'se-resize',
      }"
      @pointerdown="
        (event) => {
          emit(
            'pointerDown',
            { top: event.clientY, left: event.clientX },
            props.index,
            'resize'
          );
        }
      "
    />
  </div>
</template>
