<script setup lang="ts">
import { Map as YMap } from "yjs";
import Box from "./Box.vue";
import Cursor from "./Cursor.vue";
import { Position, DraggingBoxPosition, RemoteUser } from "../type";

const props = defineProps<{
  boxes: YMap<any>[];
  remoteUsers: RemoteUser[];
  dragState: "dragging" | "ready" | "none";
}>();
const emit = defineEmits<{
  pointerMove: [pos: Position];
  pointerUp: [pos: Position];
  onBoxPointerDown: [draggingBoxPos: DraggingBoxPosition];
  onBoxDoubleClick: [index: number];
}>();

const handlePointerDown = (
  pos: Position,
  index: number,
  type: "move" | "resize"
) => {
  emit("onBoxPointerDown", { type: type, index: index, position: pos });
};
</script>

<template>
  <main
    id="draw-area"
    class="flex-1 relative select-none overflow-hidden bg-left-top"
    :class="[
      props.dragState === 'dragging'
        ? 'cursor-grabbing'
        : props.dragState === 'ready'
        ? 'cursor-pointer'
        : '',
    ]"
    @pointermove="
      (event) =>
        emit('pointerMove', { top: event.clientY, left: event.clientX })
    "
    @pointerup="
      (event) => emit('pointerUp', { top: event.clientY, left: event.clientX })
    "
  >
    <Box
      v-for="(box, index) in props.boxes"
      :key="box.get('id')"
      :box="box"
      :index="index"
      :drag-state="props.dragState"
      @pointer-down="handlePointerDown"
      @double-click="emit('onBoxDoubleClick', index)"
    />
    <Cursor
      v-for="(user, index) in props.remoteUsers"
      :name="user.name"
      :index="index"
      :position="user.cursor"
    />
  </main>
</template>
