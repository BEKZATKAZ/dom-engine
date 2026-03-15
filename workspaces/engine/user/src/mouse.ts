import { float2, Float2 } from "low-level";

let position = Float2.zero;
let pressed = false;

export class Mouse {
  public static get position() { return position; }
  public static get pressed() { return pressed; }
}

document?.addEventListener("pointermove", (event: PointerEvent) => {
  position = float2(event.clientX, event.clientY);
});

document?.addEventListener("pointerdown", () => {
  pressed = true;
});

document?.addEventListener("pointerup", () => {
  pressed = false;
});
