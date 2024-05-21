<script setup lang="ts">
import { Map as YMap, YMapEvent } from "yjs";
import { Position, DrawableBox } from "../type";
import { getRPColorFromName } from "../color";
import { onMounted, onUnmounted, ref } from "vue";
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
const boxMap = ref<DrawableBox>({
  size: props.box.get("size"),
  position: props.box.get("position"),
  color: props.box.get("color"),
});
const handler = ({ changes }: YMapEvent<any>) => {
  // @ts-ignore
  changes.keys.forEach((change, key) => {
    // @ts-ignore
    boxMap.value[key] = props.box.get(key);
  });
};
onMounted(() => {
  props.box.observe(handler);
});
onUnmounted(() => {
  props.box.unobserve(handler);
});
</script>

<template>
  <div
    class="absolute flex items-end justify-end rounded top-0 left-0 border border-base"
    :style="{
      width: `${boxMap.size.width}px`,
      height: `${boxMap.size.height}px`,
      backgroundColor: getRPColorFromName(boxMap.color),
      transform: `translate(${boxMap.position.left}px, ${boxMap.position.top}px)`,
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
