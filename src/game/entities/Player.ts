import { CHARACTER_TILE_SIZE } from "@/game/sprite/Spritesheet";
import { TextureAsset } from "@/game/sprite/TextureManifest";
import { getMovementAfterCollisions } from "@/game/system/Collision";
import { Bounds } from "@/game/type/Entity";
import { CollisionLayer, Interactive } from "@/game/type/Interactive";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { CODE_A, CODE_D, CODE_S, CODE_W } from "keycode-js";
import { AnimatedSprite, Container, Graphics, Sprite } from "pixi.js";

export default class Player implements Mono, Interactive {
    // GLOBAL
    private container: Container;

    // SPRITES
    private spriteContainer: Container;
    private animations!: {
        idle: AnimatedSprite;
        left: AnimatedSprite;
        right: AnimatedSprite;
        down: AnimatedSprite;
        up: AnimatedSprite;
    };
    private shadow!: Sprite;
    private currentAnimation!: keyof typeof this.animations;
    private heightInTiles = 2;
    private widthInTiles = 2;

    // MOVEMENT
    public position: Vector2 = new Vector2(0, 0);
    private acceleration = 200;
    private velocity: Vector2 = new Vector2(0, 0); // Tiles per second
    private maxVelocity: Vector2 = new Vector2(10, 10); // Tiles per second

    // #################################################
    //   CUSTOM
    // #################################################

    get roundedPosition() {
        return new Vector2(Math.round(this.position.x), Math.round(this.position.y));
    }

    async instantiate() {
        const shadowGraphic = new Graphics();
        const shadowSize = new Vector2(CHARACTER_TILE_SIZE / 2, CHARACTER_TILE_SIZE / 4);
        shadowGraphic.ellipse(0, 0, shadowSize.x, shadowSize.y);
        shadowGraphic.fill({ color: 0x000000, alpha: 0.15 });
        const shadowTexture = window.game.app.renderer.generateTexture(shadowGraphic);
        this.shadow = new Sprite(shadowTexture);
        this.shadow.zIndex = 0;
        this.shadow.anchor.set(0.5);
        this.shadow.width = shadowSize.x;
        this.shadow.height = shadowSize.y;
        this.shadow.position.set(0, (CHARACTER_TILE_SIZE / 8) * 3);
        this.spriteContainer.addChild(this.shadow);

        this.animations = {
            idle: new AnimatedSprite(window.game.controller.spritesheet[TextureAsset.PLAYER].animations.idle),
            left: new AnimatedSprite(window.game.controller.spritesheet[TextureAsset.PLAYER].animations.left),
            right: new AnimatedSprite(window.game.controller.spritesheet[TextureAsset.PLAYER].animations.right),
            down: new AnimatedSprite(window.game.controller.spritesheet[TextureAsset.PLAYER].animations.down),
            up: new AnimatedSprite(window.game.controller.spritesheet[TextureAsset.PLAYER].animations.up),
        };

        Object.values(this.animations).forEach((animation) => {
            this.spriteContainer.addChild(animation);
            animation.animationSpeed = 1 / 6;
            animation.anchor.set(0.5);
            animation.zIndex = 1;
            animation.play();
            animation.visible = false;
        });

        this.currentAnimation = "idle";
        this.animations[this.currentAnimation].visible = true;
        this.changeAnimation();

        this.container.addChild(this.spriteContainer);

        this.resize(window.game.dimensions);
    }

    updatePlayerSpeed(deltaInSeconds: number) {
        const leftButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_A);
        const rightButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_D);
        const upButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_W);
        const downButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_S);

        // MOVEMENT
        if (leftButtonClicked) this.velocity.x -= this.acceleration * deltaInSeconds;
        if (rightButtonClicked) this.velocity.x += this.acceleration * deltaInSeconds;
        if (upButtonClicked) this.velocity.y -= this.acceleration * deltaInSeconds;
        if (downButtonClicked) this.velocity.y += this.acceleration * deltaInSeconds;

        // FRICTION
        if (!leftButtonClicked && !rightButtonClicked) {
            if (this.velocity.x > 0) this.velocity.x = Math.max(this.velocity.x - this.acceleration * deltaInSeconds, 0);
            if (this.velocity.x < 0) this.velocity.x = Math.min(this.velocity.x + this.acceleration * deltaInSeconds, 0);
        }
        if (!upButtonClicked && !downButtonClicked) {
            if (this.velocity.y > 0) this.velocity.y = Math.max(this.velocity.y - this.acceleration * deltaInSeconds, 0);
            if (this.velocity.y < 0) this.velocity.y = Math.min(this.velocity.y + this.acceleration * deltaInSeconds, 0);
        }

        // MAX VELOCITY
        this.velocity.x = Math.max(Math.min(this.velocity.x, this.maxVelocity.x), -this.maxVelocity.x);
        this.velocity.y = Math.max(Math.min(this.velocity.y, this.maxVelocity.y), -this.maxVelocity.y);
    }

    applyMovement(deltaInSeconds: number) {
        const { position, velocity } = getMovementAfterCollisions({
            position: this.position,
            velocity: this.velocity,
            sizeInTiles: new Vector2(this.widthInTiles, this.heightInTiles),
            layers: [],
            deltaInSeconds,
        });

        this.velocity = velocity;
        this.moveToPosition(position);
    }

    moveToPosition(position: Vector2) {
        this.position.x = position.x;
        this.position.y = position.y;

        const { tileSize } = window.game.dimensions;

        this.spriteContainer.position.set(position.x * tileSize, position.y * tileSize);
    }

    changeAnimation() {
        const leftButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_A);
        const rightButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_D);
        const upButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_W);
        const downButtonClicked = window.game.controller.interaction.isKeyPressed(CODE_S);

        let newAnimation = "idle" as keyof typeof this.animations;
        if (leftButtonClicked) newAnimation = "left" as keyof typeof this.animations;
        else if (rightButtonClicked) newAnimation = "right" as keyof typeof this.animations;
        else if (upButtonClicked) newAnimation = "up" as keyof typeof this.animations;
        else if (downButtonClicked) newAnimation = "down" as keyof typeof this.animations;

        if (this.currentAnimation === newAnimation) return;
        this.animations[this.currentAnimation].visible = false;
        this.animations[newAnimation].visible = true;
        this.currentAnimation = newAnimation;
    }

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.container = new Container();
        window.game.stage.addChild(this.container);
        this.position = new Vector2(0, 1 - this.heightInTiles / 2);

        this.spriteContainer = new Container();
        this.spriteContainer.zIndex = 10;

        this.instantiate();
    }

    destructor() {
        this.container.removeChildren();
        window.game.stage.removeChild(this.container);
    }

    loop(deltaInSeconds: number): void {
        this.updatePlayerSpeed(deltaInSeconds);
        this.applyMovement(deltaInSeconds);
        this.changeAnimation();
    }

    resize(dimensions: Dimensions): void {
        const { tileSize } = dimensions;
        this.spriteContainer.position.set(this.position.x * tileSize, this.position.y * tileSize);
        this.spriteContainer.width = tileSize * this.widthInTiles;
        this.spriteContainer.height = tileSize * this.heightInTiles;
    }

    // #################################################
    //   INTERACTIVE
    // #################################################

    public collisionLayer: CollisionLayer = CollisionLayer.PLAYER;

    shouldCollide() {
        return true;
    }

    get bounds(): Bounds {
        return {
            x: this.position.x - this.widthInTiles / 2,
            y: this.position.y - this.heightInTiles / 2,
            width: this.widthInTiles,
            height: this.heightInTiles,
        };
    }
}
