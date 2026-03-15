import { GamingMath } from "math";
import type { Ease } from "./ease";

function easeInOut(value: number): number {
  return value < 0.5
    ? 2 * value * value
    : 1 - Math.pow(-2 * value + 2, 2) * 0.5;
}

function exponentialInOut(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  if (value < 0.5) return Math.pow(2, 20 * value - 10) * 0.5;
  return (2 - Math.pow(2, -20 * value + 10)) * 0.5;
}

export function evaluateWithEase(value: number, ease: Ease = "linear") {
  value = GamingMath.clamp(value, 0, 1);

  switch (ease) {
    case "linear": return value;
    case "ease-in-out": return easeInOut(value); 
    case "ease-in": return value * value;
    case "ease-out": return 1 - (1 - value) * (1 - value);
    case "sine-in-out": return 1 - Math.cos((value * Math.PI) * 0.5);
    case "sine-in": return 1 - Math.sin((value * Math.PI) * 0.5);
    case "sine-out": return -(Math.cos(value * Math.PI) - 1) * 0.5;
    case "exponential-in-out": return value <= 0 ? 0 : Math.pow(2, 10 * (value - 1));
    case "exponential-in": return value == 1 ? 1 : 1 - Math.pow(2, -10 * value);
    case "exponential-out": return exponentialInOut(value);
    default: throw new Error(`Unhandled '${ease satisfies never}'`);
  }
}
