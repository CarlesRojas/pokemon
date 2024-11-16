import Character, { CharacterProps } from "@/game/entities/Character";
import { MouseButton } from "@/game/system/Interaction";
import { TILE_SIZE } from "@/game/system/sprite/Spritesheet";
import { TextureAsset } from "@/game/system/sprite/TextureManifest";
import Vector2 from "@/game/type/Vector2";
import { Dimensions, getAngle } from "@/util";
import { CODE_A, CODE_D, CODE_S, CODE_W } from "keycode-js";
import { Graphics, Sprite } from "pixi.js";

export default class Player extends Character {
    // SPRITES
    private pokeballRay!: Sprite;
    private pokeballRayScale = new Vector2(6, 0.25);

    // #################################################
    //   MONO
    // #################################################

    loop(deltaInSeconds: number): void {
        super.loop(deltaInSeconds);
        this.updatePokeballRay();
    }

    resize(dimensions: Dimensions): void {
        super.resize(dimensions);
        const { tileSize } = dimensions;

        if (this.pokeballRay) {
            this.pokeballRay.position.set(this.position.x * tileSize, this.position.y * tileSize);
            this.pokeballRay.width = tileSize * this.pokeballRayScale.x;
            this.pokeballRay.height = tileSize * this.pokeballRayScale.y;
        }
    }

    // #################################################
    //   CUSTOM
    // #################################################

    protected async loadSpritesheet() {
        this.spritesheet = window.game.controller.spritesheet[TextureAsset.PLAYER];
    }

    protected async instantiate() {
        await super.instantiate();

        const pokeballRayGraphic = new Graphics();
        const pokeballRaySize = new Vector2(TILE_SIZE * this.pokeballRayScale.x, TILE_SIZE * this.pokeballRayScale.y);
        pokeballRayGraphic.rect(pokeballRaySize.x, 0, pokeballRaySize.x, pokeballRaySize.y);
        pokeballRayGraphic.fill({ color: 0x000000, alpha: 0.25 });
        const shadowTexture = window.game.app.renderer.generateTexture(pokeballRayGraphic);
        this.pokeballRay = new Sprite(shadowTexture);
        this.pokeballRay.anchor.set(0, 0.5);
        this.pokeballRay.width = pokeballRaySize.x;
        this.pokeballRay.height = pokeballRaySize.y;
        this.pokeballRay.position.set(0, (TILE_SIZE / 8) * 3);
        this.pokeballRay.visible = false;
        this.entityContainer.addChild(this.pokeballRay);

        this.resize(window.game.dimensions);
    }

    protected getMovementToPerform() {
        const movingLeft = window.game.controller.interaction.isKeyPressed(CODE_A);
        const movingRight = window.game.controller.interaction.isKeyPressed(CODE_D);
        const movingUp = window.game.controller.interaction.isKeyPressed(CODE_W);
        const movingDown = window.game.controller.interaction.isKeyPressed(CODE_S);

        return { movingLeft, movingRight, movingUp, movingDown };
    }

    protected getHitboxInfo() {
        return {
            scale: new Vector2(2 / 3, 2 / 3),
            displacement: new Vector2(0, 2 / 4),
        };
    }

    private updatePokeballRay() {
        const { tileSize } = window.game.dimensions;
        const throwPokeball = window.game.controller.interaction.isKeyPressed(MouseButton.LEFT);
        const mousePosition = window.game.controller.interaction.mousePositionInTiles;

        if (throwPokeball && this.pokeballRay && mousePosition) {
            const direction = Vector2.direction(this.position, mousePosition);
            const angle = getAngle(direction);

            this.pokeballRay.angle = -angle;
            this.pokeballRay.visible = angle !== 360;
        } else this.pokeballRay.visible = false;

        this.pokeballRay.position.set(this.position.x * tileSize, this.position.y * tileSize);
    }

    // #################################################
    //   MONO
    // #################################################

    constructor(props: CharacterProps) {
        super(props);
    }
}
