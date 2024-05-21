import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { Doc, Map as YMap } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import { DraggingBoxPosition, LocalUser, Position, RemoteUser } from "../type";
import { getRandomRPColorName } from "../color";

export const useAppState = () => {
  const doc = new Doc();
  const networkProvider = new WebrtcProvider("syn-global-room", doc);
  new IndexeddbPersistence("syn-index-db", doc);

  const { localUser, remoteUsers, handleLogin, handleCursorPositionChange } =
    createAwarenessUsers(networkProvider);
  const boxes = doc.getArray<YMap<any>>("boxes");
  const draggingBoxPosition = ref<null | DraggingBoxPosition>(null);

  const boxesState = shallowRef<YMap<any>[]>(boxes.toArray());
  const handler = () => {
    boxesState.value = boxes.toArray();
  };
  onMounted(() => {
    boxes.observe(handler);
  });
  onUnmounted(() => {
    boxes.unobserve(handler);
  });

  return {
    localUser,
    remoteUsers,
    handleLogin,
    boxesState,
    isDragging: () => draggingBoxPosition.value !== null,
    boxCursorDown: (newDraggingPosition: DraggingBoxPosition) => {
      if (localUser.value !== null) {
        draggingBoxPosition.value = newDraggingPosition;
      }
    },
    boxDelete: (index: number) => {
      if (localUser.value !== null) {
        boxes.delete(index);
      }
    },
    moveCursor(newPosition: Position) {
      handleCursorPositionChange(newPosition);
      if (localUser.value === null) return;
      if (draggingBoxPosition.value === null) return;
      const { type, index, position } = draggingBoxPosition.value;
      const box = boxes.get(index);
      if (type === "move") {
        const boxPosition = box.get("position");
        box.set("position", {
          top: boxPosition.top + (newPosition.top - position.top),
          left: boxPosition.left + (newPosition.left - position.left),
        });
      } else if (type === "resize") {
        const boxSize = box.get("size");
        box.set("size", {
          width: Math.max(
            50,
            boxSize.width + (newPosition.left - position.left)
          ),
          height: Math.max(
            50,
            boxSize.height + (newPosition.top - position.top)
          ),
        });
      }
      draggingBoxPosition.value.position = newPosition;
    },
    releaseCursor(position: Position) {
      if (localUser.value === null) return;
      if (draggingBoxPosition.value !== null) {
        draggingBoxPosition.value = null;
        return;
      }
      boxes.push([
        new YMap([
          ["position" as const, position],
          ["size" as const, { width: 100, height: 100 }],
          ["color" as const, getRandomRPColorName()],
        ]),
      ]);
    },
  };
};

function createAwarenessUsers({ awareness }: WebrtcProvider) {
  const { getLocalUser, getRemoteUsers } = usersFromAwareness(awareness);
  const localUser = ref<LocalUser | null>(getLocalUser());
  const remoteUsers = ref<RemoteUser[]>(getRemoteUsers());
  const handler = (
    _changes: unknown[],
    event: "local" | Record<string, unknown>
  ) => {
    if (event === "local") {
      localUser.value = getLocalUser();
    } else {
      remoteUsers.value = getRemoteUsers();
    }
  };
  onMounted(() => {
    awareness.on("change", handler);
  });
  onUnmounted(() => {
    awareness.off("change", handler);
  });

  const handleCursorPositionChange = (newPosition: Position) => {
    awareness.setLocalStateField("cursor", newPosition);
  };

  const handleLogin = (name: string) => {
    awareness.setLocalState({
      ...awareness.getLocalState(),
      name,
      joinedOn: Date.now(),
    });
  };

  return {
    localUser,
    remoteUsers,
    handleLogin,
    handleCursorPositionChange,
  };
}

function usersFromAwareness(awareness: WebrtcProvider["awareness"]) {
  const { clientID } = awareness;
  return {
    getLocalUser: () => {
      const local = awareness.getLocalState();
      return local?.name ? (local as LocalUser) : null;
    },

    getRemoteUsers: () =>
      Array.from(awareness.getStates().entries())
        .flatMap(([key, value]) =>
          key !== clientID && value.name ? [value as RemoteUser] : []
        )
        .sort((a, b) => a.joinedOn - b.joinedOn),
  };
}
