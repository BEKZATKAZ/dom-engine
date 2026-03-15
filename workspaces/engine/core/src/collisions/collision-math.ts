import type { Collider } from "./collider";
import { float2, Float2 } from "low-level";

export function intersects(a: Collider, b: Collider): boolean {
  switch (a.props.type) {
    case "rect":
      switch (b.props.type) {
        case "rect": return OBBvsOBB(a, b);
        case "circle": return OBBvsCircle(a, b);
        default: throw new Error(`Unhandled '${b.props satisfies never}'`);
      }
    case "circle":
      switch (b.props.type) {
        case "rect": return OBBvsCircle(b, a);
        case "circle": return CirclevsCircle(a, b);
        default: throw new Error(`Unhandled '${b.props satisfies never}'`);
      }
    default: throw new Error(`Unhandled '${a.props satisfies never}'`);
  }
}

export function OBBvsOBB(a: Collider, b: Collider): boolean {
  if (a.props.type !== "rect" || b.props.type !== "rect") throw new TypeError();

  const aScale = Float2.abs(a.transform.scale);
  const bScale = Float2.abs(b.transform.scale);
  
  const aHalfSize = Float2.mul(a.props.halfSize, aScale);
  const bHalfSize = Float2.mul(b.props.halfSize, bScale);

  const aPosition = Float2.add(a.transform.position, Float2.mul(a.props.center, aScale));
  const bPosition = Float2.add(b.transform.position, Float2.mul(b.props.center, bScale));
  const distance = Float2.sub(bPosition, aPosition);

  const aRotation = (a.transform.rotation * Math.PI) / 180;
  const bRotation = (b.transform.rotation * Math.PI) / 180;

  const axX = Math.cos(aRotation), axY = Math.sin(aRotation);
  const ayX = -Math.sin(aRotation), ayY = Math.cos(aRotation);

  const bxX = Math.cos(bRotation), bxY = Math.sin(bRotation);
  const byX = -Math.sin(bRotation), byY = Math.cos(bRotation);

  const Rxx = axX * bxX + axY * bxY;
  const Rxy = axX * byX + axY * byY;
  const Ryx = ayX * bxX + ayY * bxY;
  const Ryy = ayX * byX + ayY * byY;

  const AbsRxx = Math.abs(Rxx) + 1e-9;
  const AbsRxy = Math.abs(Rxy) + 1e-9;
  const AbsRyx = Math.abs(Ryx) + 1e-9;
  const AbsRyy = Math.abs(Ryy) + 1e-9;

  let d = Math.abs(Float2.x(distance) * axX + Float2.y(distance) * axY);
  let r = Float2.x(aHalfSize) + (Float2.x(bHalfSize) * AbsRxx + Float2.y(bHalfSize) * AbsRxy);
  if (d > r) return false;

  d = Math.abs(Float2.x(distance) * ayX + Float2.y(distance) * ayY);
  r = Float2.y(aHalfSize) + (Float2.x(bHalfSize) * AbsRyx + Float2.y(bHalfSize) * AbsRyy);
  if (d > r) return false;

  d = Math.abs(Float2.x(distance) * bxX + Float2.y(distance) * bxY);
  r = Float2.x(bHalfSize) + (Float2.x(aHalfSize) * AbsRxx + Float2.y(aHalfSize) * AbsRyx);
  if (d > r) return false;

  d = Math.abs(Float2.x(distance) * byX + Float2.y(distance) * byY);
  r = Float2.y(bHalfSize) + (Float2.x(aHalfSize) * AbsRxy + Float2.y(aHalfSize) * AbsRyy);
  if (d > r) return false;

  return true;
}

export function OBBvsCircle(a: Collider, b: Collider): boolean {
  if (a.props.type !== "rect" || b.props.type !== "circle") throw new TypeError();

  const aScale = a.transform.scale;
  const bScale = b.transform.scale;

  const aPosition = Float2.add(a.transform.position, Float2.mul(a.props.center, aScale));
  const bPosition = Float2.add(b.transform.position, Float2.mul(b.props.center, bScale));
  const distance = Float2.sub(bPosition, aPosition);

  const angle = -(a.transform.rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const localX = Float2.x(distance) * cos + Float2.y(distance) * sin;
  const localY = -Float2.x(distance) * sin + Float2.y(distance) * cos;
  const local = float2(localX, localY);

  const aHalfScale = Float2.mul(a.props.halfSize, Float2.abs(aScale));
  const clamped = Float2.clamp(local, Float2.negate(aHalfScale), aHalfScale);

  const boxRadius = Float2.sub(local, clamped);
  const circleRadius = b.props.radius * Float2.cmax(Float2.abs(bScale));

  return Float2.lengthsq(boxRadius) <= circleRadius * circleRadius;
}

export function CirclevsCircle(a: Collider, b: Collider): boolean {
  if (a.props.type !== "circle" || b.props.type !== "circle") throw new TypeError();

  const aScale = a.transform.scale;
  const bScale = b.transform.scale;

  const aPosition = Float2.add(a.transform.position, Float2.mul(a.props.center, aScale));
  const bPosition = Float2.add(b.transform.position, Float2.mul(b.props.center, bScale));
  const distance = Float2.sub(bPosition, aPosition);

  const aRadius = a.props.radius * Float2.cmax(Float2.abs(aScale));
  const bRadius = b.props.radius * Float2.cmax(Float2.abs(bScale));
  const combinedRadius = aRadius + bRadius;

  return Float2.lengthsq(distance) <= combinedRadius * combinedRadius;
}
