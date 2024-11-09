import { getCharacterAtlas } from "@/game/sprite/util";
import { getMovementAfterCollisions } from "@/game/system/Collision";
import { Bounds } from "@/game/type/Entity";
import { CollisionLayer, Interactive } from "@/game/type/Interactive";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { CODE_A, CODE_D, CODE_S, CODE_W } from "keycode-js";
import { AnimatedSprite, Assets, Container, Spritesheet } from "pixi.js";

export default class Player implements Mono, Interactive {
    // GLOBAL
    private container: Container;

    // SPRITES
    private spriteContainer: Container;
    private spriteSheet!: Spritesheet;
    private animations!: {
        idle: AnimatedSprite;
        left: AnimatedSprite;
        right: AnimatedSprite;
        down: AnimatedSprite;
        up: AnimatedSprite;
    };
    private currentAnimation!: keyof typeof this.animations;

    // MOVEMENT
    public position: Vector2 = new Vector2(0, 0);
    private acceleration = 200;
    private velocity: Vector2 = new Vector2(0, 0); // Tiles per second
    private maxVelocity: Vector2 = new Vector2(10, 20); // Tiles per second

    // #################################################
    //   CUSTOM
    // #################################################

    get middlePosition() {
        return new Vector2(this.position.x + 2 / 3, this.position.y + 2 / 3);
    }

    async instantiate() {
        const characterAtlas = getCharacterAtlas("player");

        this.spriteSheet = new Spritesheet(Assets.get(characterAtlas.meta.image), characterAtlas);
        await this.spriteSheet.parse();

        this.animations = {
            idle: new AnimatedSprite(this.spriteSheet.animations.idle),
            left: new AnimatedSprite(this.spriteSheet.animations.left),
            right: new AnimatedSprite(this.spriteSheet.animations.right),
            down: new AnimatedSprite(this.spriteSheet.animations.down),
            up: new AnimatedSprite(this.spriteSheet.animations.up),
        };

        Object.values(this.animations).forEach((animation) => {
            this.spriteContainer.addChild(animation);
            animation.animationSpeed = 1 / 6;
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
        const leftButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_A);
        const rightButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_D);
        const upButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_W);
        const downButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_S);

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
            sizeInTiles: new Vector2(1, 1),
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
        const leftButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_A);
        const rightButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_D);
        const upButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_W);
        const downButtonClicked = window.game.controller.layers.interaction.isKeyPressed(CODE_S);

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
        this.position = new Vector2(0, 0);

        this.spriteContainer = new Container();
        this.spriteContainer.zIndex = 1;

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
    }

    // #################################################
    //   INTERACTIVE
    // #################################################

    public collisionLayer: CollisionLayer = CollisionLayer.PLAYER;

    shouldCollide() {
        return true;
    }

    get bounds(): Bounds {
        return { x: this.position.x - 1 / 2, y: this.position.y - 1 / 2, width: 1, height: 1 };
    }
}
