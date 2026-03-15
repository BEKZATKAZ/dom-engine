import { Component } from "@engine/core";
import { hex, float2, type HexColor } from "low-level";
import { RenderBuffer } from "./render-buffer";

export type RendererType = "rect" | "circle" | "text" | "line";

export type RendererBaseProps = {
  fillColor?: HexColor;
  outline?: {
    color: HexColor;
    width: number;
  } | undefined;
};

export type RectRendererProps = RendererBaseProps & {
  pivot?: float2;
};

export type CircleRendererProps = RendererBaseProps & {
  radius: number;
};

export type TextRendererProps = RendererBaseProps & {
  text: string;
  font: string;
};

export type LineRendererProps = RendererBaseProps & {
  from: float2;
  to: float2;
  dash?: number[];
};

export abstract class Renderer<TProps extends RendererBaseProps = RendererBaseProps> extends Component {
  constructor(params: TProps, type: RendererType) {
    super();
    
    this.type = type;
    this.props = { ...params } as Required<TProps>;
    this.props.fillColor ??= hex("#fff");
    this.props.outline ??= undefined;
  }

  public readonly props: Required<TProps>;
  public readonly type: RendererType;

  public override update() {
    RenderBuffer.schedule(this as Renderer);
  }
}

export class RectRenderer extends Renderer<RectRendererProps> {
  constructor(params: RectRendererProps) {
    params.pivot ??= float2(0.5, 0.5);
    super(params, "rect");
  }
}

export class CircleRenderer extends Renderer<CircleRendererProps> {
  constructor(params: CircleRendererProps) {
    super(params, "circle");
  }
}

export class TextRenderer extends Renderer<TextRendererProps> {
  constructor(params: TextRendererProps) {
    super(params, "text");
  }
}

export class LineRenderer extends Renderer<LineRendererProps> {
  constructor(params: LineRendererProps) {
    params.dash ??= [];
    super(params, "line");
  }
}
