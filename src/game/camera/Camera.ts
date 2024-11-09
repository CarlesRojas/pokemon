import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";

export default class Camera implements Mono {
    private targetPositionInTiles: Vector2;
    private minTilesPerSecond = 4;

    // #################################################
    //   CUSTOM
    // #################################################

    screenToTiles = (screenPoint: Vector2): Vector2 => {
        const { tileSize, screen } = window.game.dimensions;
        return new Vector2((screenPoint.x - screen.x / 2) / tileSize, (screenPoint.y - screen.y / 2) / tileSize);
    };

    panCameraToTargetPosition(deltaInSeconds: number) {
        const targetPositionInTiles = this.targetPositionInTiles;
        const invertedPositionInTiles = Vector2.mul(this.positionInTiles, -1);

        if (targetPositionInTiles.equals(invertedPositionInTiles)) return;

        const magnitude = Vector2.sub(targetPositionInTiles, invertedPositionInTiles).magnitude;
        let stepMagnitude = Math.pow(magnitude, 2) * deltaInSeconds;
        stepMagnitude = Math.max(stepMagnitude, this.minTilesPerSecond * deltaInSeconds);

        if (magnitude < stepMagnitude) {
            this.moveCameraTo(targetPositionInTiles);
            return;
        }

        const direction = Vector2.direction(invertedPositionInTiles, targetPositionInTiles);
        const step = Vector2.mul(direction, stepMagnitude);
        const newPosition = Vector2.add(invertedPositionInTiles, step);

        this.moveCameraTo(newPosition);
    }

    moveCameraTo(newPositionInTiles: Vector2) {
        const { tileSize, screen } = window.game.dimensions;

        const newPos = new Vector2(-newPositionInTiles.x * tileSize + screen.x / 2, -newPositionInTiles.y * tileSize + screen.y / 2);

        window.game.stage.position.set(newPos.x, newPos.y);
    }

    get positionInTiles() {
        const stageX = window.game.stage.position.x;
        const stageY = window.game.stage.position.y;

        return this.screenToTiles(new Vector2(stageX, stageY));
    }

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.targetPositionInTiles = new Vector2(0, 0);
        this.moveCameraTo(this.targetPositionInTiles);
    }

    destructor() {}

    loop(deltaInSeconds: number) {
        this.targetPositionInTiles = window.game.controller.layers.entities.player.position;

        this.panCameraToTargetPosition(deltaInSeconds);
    }

    resize(dimensions: Dimensions) {
        this.moveCameraTo(this.targetPositionInTiles);
    }
}
