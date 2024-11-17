import { getItemAtlas } from "@/game/system/sprite/Spritesheet";
import { Item } from "@/game/type/Item";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { Assets, Container, Sprite, Spritesheet } from "pixi.js";

export interface Props {
    item: Item;
    container: Container;
}

export default class HandItem implements Mono {
    // GLOBAL
    protected container: Container;
    protected item: Item;
    protected position: Vector2 = new Vector2(0, 0);

    // SPRITES
    protected spritesheet?: Spritesheet;
    protected sprite!: Sprite;

    // #################################################
    //   CUSTOM
    // #################################################

    protected async instantiate() {
        const asset = await Assets.load(this.item);
        this.spritesheet = new Spritesheet(asset, getItemAtlas(this.item));
        await this.spritesheet.parse();

        this.sprite = new Sprite(this.spritesheet.textures.main);
        this.sprite.anchor.set(0.5);

        this.container.addChild(this.sprite);
        this.container.zIndex = this.position.y + 10;
        this.resize(window.game.dimensions);
    }

    public moveToPosition(position: Vector2) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.container.zIndex = this.position.y + 10;

        const { tileSize } = window.game.dimensions;
        this.container.position.set(position.x * tileSize, position.y * tileSize);
    }

    // #################################################
    //   MONO
    // #################################################

    constructor({ item, container }: Props) {
        this.item = item;
        this.container = container;

        this.instantiate();
    }

    destructor() {
        this.container.removeChildren();
    }

    loop(deltaInSeconds: number): void {}

    resize(dimensions: Dimensions): void {
        const { tileSize } = dimensions;

        this.container.position.set(this.position.x * tileSize, this.position.y * tileSize);
        this.sprite.width = tileSize / 2;
        this.sprite.height = tileSize / 2;
    }
}
