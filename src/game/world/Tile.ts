import { TextureAsset } from "@/game/system/sprite/TextureManifest";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { Container, Sprite, Text, Texture } from "pixi.js";

interface Props {
    coords: Vector2;
    container: Container;
    type: TileType;
    sizeInTiles: number;
}

export default class Tile implements Mono {
    private container: Container;
    public coords: Vector2;
    public type: TileType;
    public sizeInTiles: number;

    private text: Text | null = null;
    private sprite!: Sprite;

    // #################################################
    //   CUSTOM
    // #################################################

    showDebugText() {
        if (window.game.debug) {
            this.text = new Text({ text: this.coords.toString(0), style: { fill: 0xff0000, fontSize: 14 } });
            this.text.anchor.set(0.5);
            this.container.addChild(this.text);
        }
    }

    instantiate() {
        const texture = getTileTexture(this.type);

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);

        this.container.addChild(this.sprite);
    }

    // #################################################
    //   MONO
    // #################################################

    constructor({ coords, container, type, sizeInTiles }: Props) {
        this.coords = coords;
        this.container = container;
        this.type = type;
        this.sizeInTiles = sizeInTiles;

        this.instantiate();
        this.showDebugText();
        this.resize(window.game.dimensions);
    }

    destructor() {
        if (this.text) this.container.removeChild(this.text);
        this.container.removeChild(this.sprite);
    }

    loop(deltaInSeconds: number): void {}

    resize(dimensions: Dimensions): void {
        const { tileSize } = dimensions;
        if (this.text) this.text.position.set(this.coords.x * tileSize, this.coords.y * tileSize);

        this.sprite.position.set(this.coords.x * tileSize, this.coords.y * tileSize);
        this.sprite.width = tileSize * this.sizeInTiles;
        this.sprite.height = tileSize * this.sizeInTiles;
    }
}

export enum TileType {
    NONE = "NONE",
    BG_GRASS = "BG_GRASS",
}

const getTileTexture = (type: TileType) => {
    const map: Record<TileType, Texture | undefined> = {
        [TileType.NONE]: undefined,
        [TileType.BG_GRASS]: window.game.controller.spritesheet[TextureAsset.GROUND].textures.bgGrass,
    };

    return map[type];
};
