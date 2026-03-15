import type { Camera } from "@engine/core";
import type { CircleRenderer, LineRenderer, RectRenderer, Renderer, TextRenderer } from "./renderer";
import { float2, Float2 } from "low-level";
import { Screen } from "@engine/user";

let context: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;

window.addEventListener("load", () => {
  canvas = document.querySelector("canvas")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d")!;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

export function clear(camera: Camera) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const color = camera.backgroundColor;
  
  if (!color) return;
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
}

export function draw(renderer: Renderer, camera: Camera) {
  if (!context) {
    console.error("No canvas found");
    return;
  }

  const props = renderer.props;
  context.save();
  context.beginPath();

  context.fillStyle = props.fillColor;
  context.strokeStyle = props.outline?.color ?? "";
  context.lineWidth = props.outline?.width || 0;

  switch (renderer.type) {
    case "rect": drawRect(renderer as RectRenderer, camera); break;
    case "circle": drawCircle(renderer as CircleRenderer, camera); break;
    case "text": drawText(renderer as TextRenderer, camera); break;
    case "line": drawLine(renderer as LineRenderer, camera); break;
    default: throw new Error(`Unhandled '${renderer.type satisfies never}'`);
  }
  
  context.resetTransform();
  context.closePath();
  context.restore();
}

function drawRect(renderer: RectRenderer, camera: Camera) {
  const multiplier = calculateSizeMultiplier(context, camera);
  const pivot = renderer.props.pivot;

  const size = Float2.mul(renderer.transform.scale, float2(multiplier));
  const rotation = renderer.transform.rotation;
  const screen = Screen.toScreenCoords(renderer.transform.position, camera);
  const position = Float2.mul(Float2.negate(size), float2(Float2.x(pivot), 1 - Float2.y(pivot)));

  context.translate(Float2.x(screen), Float2.y(screen));
  context.rotate(Math.PI * rotation / 180);
  
  context.rect(Float2.x(position), Float2.y(position), Float2.x(size), Float2.y(size));
  context.clip();

  if (renderer.props.fillColor) context.fill();
  if (renderer.props.outline) context.stroke();
}

function drawCircle(renderer: CircleRenderer, camera: Camera) {
  const multiplier = calculateSizeMultiplier(context, camera);
  const rotation = renderer.transform.rotation;
  const screen = Screen.toScreenCoords(renderer.transform.position, camera);

  const scale = renderer.transform.scale;
  const scaledRadius = Float2.mul(float2(renderer.props.radius), scale);
  const radius = Float2.mul(scaledRadius, float2(multiplier));

  context.translate(Float2.x(screen), Float2.y(screen));
  context.rotate(Math.PI * rotation / 180);

  context.ellipse(0, 0, Float2.x(radius), Float2.y(radius), 0, 0, Math.PI * 2);
  context.clip();

  if (renderer.props.fillColor) context.fill();
  if (renderer.props.outline) context.stroke();
}

function drawText(renderer: TextRenderer, camera: Camera) {
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = renderer.props.font;

  const multiplier = calculateSizeMultiplier(context, camera);
  const rotation = renderer.transform.rotation;
  const screen = Screen.toScreenCoords(renderer.transform.position, camera);
  const scale = Float2.mul(renderer.transform.scale, float2(multiplier));

  context.translate(Float2.x(screen), Float2.y(screen));
  context.rotate(Math.PI * rotation / 180);
  context.scale(Float2.x(scale), Float2.y(scale));

  if (renderer.props.fillColor) context.fillText(renderer.props.text, 0, 0);
  if (renderer.props.outline) context.strokeText(renderer.props.text, 0, 0);
}

function drawLine(renderer: LineRenderer, camera: Camera) {
  const screenFrom = Screen.toScreenCoords(renderer.props.from, camera);
  const screenTo = Screen.toScreenCoords(renderer.props.to, camera);
  
  context.lineCap = "round";
  context.moveTo(Float2.x(screenFrom), Float2.y(screenFrom));
  context.lineTo(Float2.x(screenTo), Float2.y(screenTo));
  context.setLineDash(renderer.props.dash);

  if (renderer.props.outline) context.stroke();
}

function calculateSizeMultiplier(context: CanvasRenderingContext2D, camera: Camera) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  return Math.min(width, height) / camera.size;
}
