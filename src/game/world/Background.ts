import { Mono } from "@/game/type/Mono";
import { CoordsMap, TileMap } from "@/game/type/TileMap";
import Vector2 from "@/game/type/Vector2";
import Tile from "@/game/world/Tile";
import { Dimensions } from "@/util";
import * as PIXI from "pixi.js";

export default class Background implements Mono, TileMap<Tile> {
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
    //   TILE MAP
    // #################################################

    get elementAtCoords() {
        return (coords: Vector2) => {
            const key = coords.toCoords();
            return key in this.tileMap ? this.tileMap[key] : null;
        };
    }
}
