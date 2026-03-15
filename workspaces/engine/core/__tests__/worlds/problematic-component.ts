import { Component } from "component";

export class ProblematicComponent extends Component {
  public override update(): void {
    throw new Error("Not implemented");
  }

  public override onDestroy(): void {
    throw new Error("Not implemented");
  }
}
