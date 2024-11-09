import { getTileTexture } from "@/game/sprite/TextureManifest";
import { Mono } from "@/game/type/Mono";
import { TileType } from "@/game/type/Tile";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { Container, Sprite, Text } from "pixi.js";

interface Props {
    coords: Vector2;
    container: Container;
    type: TileType;
}

export default class Tile implements Mono {
    private container: Container;
    public coords: Vector2;
    public type: TileType;

    private debug = false;
    private text: Text | null = null;
    private sprite: Sprite | null = null;

    // #################################################
    //   CUSTOM
    // #################################################

    showDebugText() {
        if (this.debug) {
            this.text = new Text(this.coords.toString(0), { fill: 0x00ff00, fontSize: 14 });
            this.text.anchor.set(0.5);
            this.text.zIndex = 1;
            this.container.addChild(this.text);
        }
    }

    instantiate() {
        const texture = getTileTexture(this.type);

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.zIndex = 0;

        this.container.addChild(this.sprite);
    }

    // #################################################
    //   MONO
    // #################################################

    constructor({ coords, container, type }: Props) {
        this.coords = coords;
        this.container = container;
        this.type = type;

        this.showDebugText();
        this.instantiate();
        this.resize(window.game.dimensions);
    }

    destructor() {
        if (this.text) this.container.removeChild(this.text);
    }

    loop(deltaInSeconds: number): void {}

    resize(dimensions: Dimensions): void {
        const { tileSize } = dimensions;
        if (this.text) this.text.position.set(this.coords.x * tileSize, this.coords.y * tileSize);
    }
}
