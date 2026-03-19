import { layer, LayerMatrix } from "@engine/core";

export const GameLayers = {
  Default: layer(0),
  Player: layer(1),
  Pickup: layer(2),
  Finish: layer(3),
  Obstacle: layer(4)
} as const;

export function setupLayerMatrix() {
  LayerMatrix.excludeAll();
  LayerMatrix.allowContactBetween(GameLayers.Player, GameLayers.Pickup);
  LayerMatrix.allowContactBetween(GameLayers.Player, GameLayers.Finish);
  LayerMatrix.allowContactBetween(GameLayers.Player, GameLayers.Obstacle);
}
