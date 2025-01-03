import { Mono } from "@/game/type/Mono";
import { Area, RenderArea } from "@/game/type/RenderArea";
import { CoordsMap, TileMap } from "@/game/type/TileMap";
import Vector2 from "@/game/type/Vector2";
import Tile, { TileType } from "@/game/world/Tile";
import { Dimensions } from "@/util";
import * as PIXI from "pixi.js";

export default class Background implements Mono, RenderArea, TileMap<Tile> {
    private container: PIXI.Container;

    public tileMap: CoordsMap<Tile>;

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        window.game.stage.addChild(this.container);

        this.tileMap = {};
    }

    destructor() {
        Object.values(this.tileMap).forEach((tile) => tile.destructor());
        window.game.stage.removeChild(this.container);
    }

    loop(deltaInSeconds: number): void {
        Object.values(this.tileMap).forEach((tile) => tile?.loop(deltaInSeconds));
    }

    resize(dimensions: Dimensions): void {
        Object.values(this.tileMap).forEach((tile) => tile.resize(dimensions));
    }

    // #################################################
    //   RENDER AREA
    // #################################################

    async instantiateTile(key: string, coords: Vector2) {
        this.tileMap[key] = new Tile({
            coords,
            container: this.container,
            type: TileType.BG_GRASS,
            scale: new Vector2(4, 4),
            isSolid: false,
        });
    }

    updateRenderArea(renderArea: Area) {
        const { start, end } = renderArea;
        const { x: startX, y: startY } = start;
        const { x: endX, y: endY } = end;

        // Remove tiles that are no longer in the render area
        for (const key in this.tileMap) {
            const tile = this.tileMap[key];

            const { x, y } = tile.coords;
            if (x < startX || x > endX || y < startY || y > endY) {
                tile.destructor();
                delete this.tileMap[key];
            }
        }

        // Add tiles that are in the render area but not rendered
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (x % 4 !== 0 || y % 4 !== 0) continue;
                const coords = new Vector2(x, y);
                const key = coords.toCoords();
                if (this.tileMap[key]) continue;
                this.instantiateTile(key, coords);
            }
        }
    }

    // #################################################
    //   TILE MAP
    // #################################################

    get elementAtCoords() {
        return (coords: Vector2) => {
            const key = coords.toCoords();
            return key in this.tileMap ? this.tileMap[key] : null;
        };
    }
}
