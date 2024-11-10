import { getMovementAfterCollisions } from "@/game/system/Collision";
import { CHARACTER_TILE_SIZE } from "@/game/system/sprite/Spritesheet";
import { Bounds, Poke } from "@/game/type/Entity";
import { CollisionLayer, Interactive } from "@/game/type/Interactive";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { AnimatedSprite, Container, Graphics, Sprite, Spritesheet } from "pixi.js";

export interface CharacterProps {
    characterType: Poke | "player";
    positionInTiles: Vector2;
    entityContainer: Container;
}

export default class Character implements Mono, Interactive {
    // GLOBAL
    protected entityContainer: Container;
    protected characterType: Poke | "player";

    // SPRITES
    protected spritesheet?: Spritesheet;
    protected spriteContainer: Container;
    protected animations?: {
        idle: AnimatedSprite;
        left: AnimatedSprite;
        right: AnimatedSprite;
        down: AnimatedSprite;
        up: AnimatedSprite;
    };
    protected shadow!: Sprite;
    protected currentAnimation!: keyof NonNullable<typeof this.animations>;
    protected heightInTiles = 2;
    protected widthInTiles = 2;

    // MOVEMENT
    public position: Vector2 = new Vector2(0, 0);
    protected acceleration = 200;
    protected velocity: Vector2 = new Vector2(0, 0); // Tiles per second
    protected maxVelocity: Vector2 = new Vector2(10, 10); // Tiles per second

    // #################################################
    //   CUSTOM
    // #################################################

    protected async loadSpritesheet() {}

    protected async instantiate() {
        const shadowGraphic = new Graphics();
        const shadowSize = new Vector2(CHARACTER_TILE_SIZE / 2, CHARACTER_TILE_SIZE / 4);
        shadowGraphic.ellipse(0, 0, shadowSize.x, shadowSize.y);
        shadowGraphic.fill({ color: 0x000000, alpha: 0.15 });
        const shadowTexture = window.game.app.renderer.generateTexture(shadowGraphic);
        this.shadow = new Sprite(shadowTexture);
        this.shadow.anchor.set(0.5);
        this.shadow.width = shadowSize.x;
        this.shadow.height = shadowSize.y;
        this.shadow.position.set(0, (CHARACTER_TILE_SIZE / 8) * 3);
        this.spriteContainer.addChild(this.shadow);

        await this.loadSpritesheet();
        if (this.spritesheet) {
            this.animations = {
                idle: new AnimatedSprite(this.spritesheet.animations.idle),
                left: new AnimatedSprite(this.spritesheet.animations.left),
                right: new AnimatedSprite(this.spritesheet.animations.right),
                down: new AnimatedSprite(this.spritesheet.animations.down),
                up: new AnimatedSprite(this.spritesheet.animations.up),
            };

            Object.values(this.animations).forEach((animation) => {
                this.spriteContainer.addChild(animation);
                animation.animationSpeed = 1 / 6;
                animation.anchor.set(0.5);
                animation.play();
                animation.visible = false;
            });

            this.currentAnimation = "idle";
            this.animations[this.currentAnimation].visible = true;
            this.changeAnimation();
        }

        this.entityContainer.addChild(this.spriteContainer);
        this.resize(window.game.dimensions);
    }

    protected getMovementToPerform() {
        const movingLeft = false;
        const movingRight = false;
        const movingUp = false;
        const movingDown = false;

        return { movingLeft, movingRight, movingUp, movingDown };
    }

    protected updateSpeed(deltaInSeconds: number) {
        const { movingLeft, movingRight, movingUp, movingDown } = this.getMovementToPerform();

        // MOVEMENT
        if (movingLeft) this.velocity.x -= this.acceleration * deltaInSeconds;
        if (movingRight) this.velocity.x += this.acceleration * deltaInSeconds;
        if (movingUp) this.velocity.y -= this.acceleration * deltaInSeconds;
        if (movingDown) this.velocity.y += this.acceleration * deltaInSeconds;

        // FRICTION
        if (!movingLeft && !movingRight) {
            if (this.velocity.x > 0) this.velocity.x = Math.max(this.velocity.x - this.acceleration * deltaInSeconds, 0);
            if (this.velocity.x < 0) this.velocity.x = Math.min(this.velocity.x + this.acceleration * deltaInSeconds, 0);
        }
        if (!movingUp && !movingDown) {
            if (this.velocity.y > 0) this.velocity.y = Math.max(this.velocity.y - this.acceleration * deltaInSeconds, 0);
            if (this.velocity.y < 0) this.velocity.y = Math.min(this.velocity.y + this.acceleration * deltaInSeconds, 0);
        }

        // MAX VELOCITY
        this.velocity.x = Math.max(Math.min(this.velocity.x, this.maxVelocity.x), -this.maxVelocity.x);
        this.velocity.y = Math.max(Math.min(this.velocity.y, this.maxVelocity.y), -this.maxVelocity.y);
    }

    protected applyMovement(deltaInSeconds: number) {
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

    protected moveToPosition(position: Vector2) {
        this.position.x = position.x;
        this.position.y = position.y;

        const { tileSize } = window.game.dimensions;

        this.spriteContainer.position.set(position.x * tileSize, position.y * tileSize);
    }

    protected changeAnimation() {
        if (!this.animations) return;

        const { movingLeft, movingRight, movingUp, movingDown } = this.getMovementToPerform();

        let newAnimation = "idle" as keyof typeof this.animations;
        if (movingLeft) newAnimation = "left" as keyof typeof this.animations;
        else if (movingRight) newAnimation = "right" as keyof typeof this.animations;
        else if (movingUp) newAnimation = "up" as keyof typeof this.animations;
        else if (movingDown) newAnimation = "down" as keyof typeof this.animations;

        if (this.currentAnimation === newAnimation) return;
        this.animations[this.currentAnimation].visible = false;
        this.animations[newAnimation].visible = true;
        this.currentAnimation = newAnimation;
    }

    // #################################################
    //   MONO
    // #################################################

    constructor({ characterType, positionInTiles, entityContainer }: CharacterProps) {
        this.characterType = characterType;
        this.position = new Vector2(positionInTiles.x, positionInTiles.y - this.heightInTiles / 2);
        this.entityContainer = entityContainer;
        this.spriteContainer = new Container();

        this.instantiate();
    }

    destructor() {
        this.entityContainer.removeChild(this.spriteContainer);
    }

    loop(deltaInSeconds: number): void {
        this.spriteContainer.zIndex = this.position.y;

        this.updateSpeed(deltaInSeconds);
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

    public collisionLayer: CollisionLayer = CollisionLayer.ENTITY;

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

    get roundedPosition() {
        return new Vector2(Math.round(this.position.x), Math.round(this.position.y));
    }
}
