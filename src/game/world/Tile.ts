import { TextureAsset } from "@/game/system/sprite/TextureManifest";
import { Bounds } from "@/game/type/Entity";
import { CollisionLayer, Interactive } from "@/game/type/Interactive";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { Container, Sprite, Text, Texture } from "pixi.js";

interface Props {
    coords: Vector2;
    container: Container;
    type: TileType;
    sizeInTiles: Vector2;
    isSolid: boolean;
}

export default class Tile implements Mono, Interactive {
    private container: Container;
    public coords: Vector2;
    public type: TileType;
    public sizeInTiles: Vector2;

    private text: Text | null = null;
    private sprite!: Sprite;
    private isSolid: boolean = false;

    // #################################################
    //   CUSTOM
    // #################################################

    showDebugText() {
        if (window.game.debug) {
            this.text = new Text({
                text: this.coords.toString(0),
                style: { fill: 0xffffff, fontSize: 12, stroke: { color: "#000000", width: 2.5, join: "round" } },
            });
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

    constructor({ coords, container, type, sizeInTiles, isSolid }: Props) {
        this.coords = coords;
        this.container = container;
        this.type = type;
        this.interactiveName = `TILE ${this.type}`;
        this.sizeInTiles = sizeInTiles;
        this.isSolid = isSolid;

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
        this.sprite.width = tileSize * this.sizeInTiles.x;
        this.sprite.height = tileSize * this.sizeInTiles.y;
    }

    // #################################################
    //   INTERACTIVE
    // #################################################

    public collisionLayer: CollisionLayer = CollisionLayer.WORLD;
    public interactiveName = "TILE";

    shouldCollide(): boolean {
        return this.isSolid;
    }

    getBounds(): Bounds {
        const width = this.sizeInTiles.x;
        const height = this.sizeInTiles.y;

        return {
            x: this.coords.x - width / 2,
            // XXX I DONT GET WHY WE DON?T NEED - height / 2
            y: this.coords.y,
            width: width,
            height: height,
        };
    }

    getOccupiedTiles(): Vector2[] {
        return [this.coords];
    }
}

export enum TileType {
    NONE = "NONE",
    BG_GRASS = "BG_GRASS",
    ROCK = "ROCK",
}

const getTileTexture = (type: TileType) => {
    const map: Record<TileType, Texture | undefined> = {
        [TileType.NONE]: window.game.controller.spritesheet[TextureAsset.GROUND].textures.none,
        [TileType.BG_GRASS]: window.game.controller.spritesheet[TextureAsset.GROUND].textures.bgGrass,
        [TileType.ROCK]: window.game.controller.spritesheet[TextureAsset.GROUND].textures.rock,
    };

    return map[type];
};
