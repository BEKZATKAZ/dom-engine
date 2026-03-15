import { Color, float2, Float2, hex, type color } from "low-level";
import { Component, Time } from "@engine/core";
import { RectRenderer } from "../renderer";

export class Particle extends Component {
  public linearVelocity: float2 = Float2.zero;
  public angularVelocity = 0;
  public startTime = -99999;
  public lifeTime = 1;

  private color = Color.white;
  private maxAlpha = 255;

  public get progress(): number {
    const now = Time.timeSinceStart;
    return Math.min((now - this.startTime) / this.lifeTime, 1);
  }

  public set baseColor(value: color) {
    this.color = value;
    this.maxAlpha = Color.a(value);
  }

  public isDead(): boolean {
    return this.progress >= 1;
  }

  public override update(): void {
    const transform = this.transform;
    
    transform.rotation += this.angularVelocity * Time.deltaTime;
    transform.position = Float2.add(
      transform.position,
      Float2.mul(this.linearVelocity, float2(Time.deltaTime))
    );

    const alpha = Math.sin(Math.sin(this.progress * Math.PI) * Math.PI) * this.maxAlpha;
    this.color = Color.withA(this.color, alpha);
    this.gameObject.getComponent(RectRenderer).props.fillColor = hex(this.color);
  }
}
