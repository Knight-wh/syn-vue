import { RPColor } from "./color";

export type Position = { top: number; left: number };
export type Size = { width: number; height: number };

export type DrawableBox = {
  id?: string; // ! For v-for's key, to solve the rendering issue
  position: Position;
  size: Size;
  color: RPColor;
};

export type DraggingBoxPosition = {
  type: "move" | "resize";
  index: number;
  position: Position;
};

export type LocalUser = {
  name: string;
  joinedOn: number;
};

export type RemoteUser = LocalUser & {
  cursor?: Position;
};
