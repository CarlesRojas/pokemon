import { Mono } from "@/game/type/Mono";
import { TileMap } from "@/game/type/TileMap";
import Background from "@/game/world/Background";
import Tile from "@/game/world/Tile";
import { Dimensions } from "@/util";

export default class World implements Mono {
    private layers: {
        background: Mono & TileMap<Tile>;
    };

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.layers = {
            background: new Background(),
        };
    }

    destructor() {
        Object.values(this.layers).forEach((layer) => layer.destructor());
    }

    loop(deltaInSeconds: number): void {
        Object.values(this.layers).forEach((layer) => layer.loop(deltaInSeconds));
    }

    resize(dimensions: Dimensions): void {
        Object.values(this.layers).forEach((layer) => layer.resize(dimensions));
    }
}
