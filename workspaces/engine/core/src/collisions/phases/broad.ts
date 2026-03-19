import { float2, Float2 } from "low-level";
import type { Collider } from "collisions/collider";

export function getAABBHalfScale(collider: Collider): float2 {
  switch (collider.props.type) {
    case "rect": return float2(Float2.lengthsq(collider.props.halfSize));
    case "circle": return float2(collider.props.radius);
    default: throw new Error(`Unhandled '${collider.props satisfies never}'`);
  }
}

export function broadIntersects(a: Collider, b: Collider) {
  const aScale = a.transform.scale;
  const bScale = b.transform.scale;

  const aPosition = Float2.add(a.transform.position, Float2.mul(a.props.center, aScale));
  const bPosition = Float2.add(b.transform.position, Float2.mul(b.props.center, bScale));

  const aHalfScale = Float2.mul(aScale, getAABBHalfScale(a));
  const bHalfScale = Float2.mul(bScale, getAABBHalfScale(b));

  const aMin = Float2.sub(aPosition, aHalfScale);
  const aMax = Float2.add(aPosition, aHalfScale);

  const bMin = Float2.sub(bPosition, bHalfScale);
  const bMax = Float2.add(bPosition, bHalfScale);

  return (
    Float2.x(aMax) >= Float2.x(bMin) &&
    Float2.x(aMin) <= Float2.x(bMax) &&
    Float2.y(aMax) >= Float2.y(bMin) &&
    Float2.y(aMin) <= Float2.y(bMax)
  );
}
