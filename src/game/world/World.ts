import { SAFETY_TILES } from "@/constant";
import { Mono } from "@/game/type/Mono";
import { Area, RenderArea } from "@/game/type/RenderArea";
import { TileMap } from "@/game/type/TileMap";
import Vector2 from "@/game/type/Vector2";
import Background from "@/game/world/Background";
import Tile from "@/game/world/Tile";
import { Dimensions } from "@/util";

export default class World implements Mono {
    private background?: Mono & RenderArea & TileMap<Tile>;

    private renderArea: Area;
    private lastRenderArea: Area | null;

    async updateRenderArea() {
        const { screen, tileSize } = window.game.dimensions;
        const playerPosition = window.game.controller.entities.player.roundedPosition;

        const horizontalNumberOfTiles = Math.ceil(screen.x / tileSize / 2) + SAFETY_TILES;
        const verticalNumberOfTiles = Math.ceil(screen.y / tileSize / 2) + SAFETY_TILES;

        this.renderArea = {
            start: new Vector2(playerPosition.x - horizontalNumberOfTiles, playerPosition.y - verticalNumberOfTiles),
            end: new Vector2(playerPosition.x + horizontalNumberOfTiles, playerPosition.y + verticalNumberOfTiles),
        };

        if (
            this.lastRenderArea &&
            this.lastRenderArea.start.equals(this.renderArea.start) &&
            this.lastRenderArea.end.equals(this.renderArea.end)
        )
            return;

        this.lastRenderArea = this.renderArea;

        this.background?.updateRenderArea(this.renderArea);
    }

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.background = new Background();

        this.renderArea = { start: new Vector2(0, 0), end: new Vector2(0, 0) };
        this.lastRenderArea = null;
    }

    destructor() {
        this.background?.destructor();
    }

    loop(deltaInSeconds: number): void {
        this.updateRenderArea();
        this.background?.loop(deltaInSeconds);
    }

    resize(dimensions: Dimensions): void {
        this.background?.resize(dimensions);
    }
}
