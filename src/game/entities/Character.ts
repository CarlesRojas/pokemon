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
    protected hitbox?: Sprite;

    // MOVEMENT
    protected currentAnimation!: keyof NonNullable<typeof this.animations>;
    protected sizeInTiles: Vector2 = new Vector2(2, 2);
    public position: Vector2 = new Vector2(0, 0);
    protected acceleration = 200;
    protected velocity: Vector2 = new Vector2(0, 0); // Tiles per second
    protected maxVelocity: Vector2 = new Vector2(6, 6); // Tiles per second

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

        const hitboxGraphic = new Graphics();
        const hitboxInfo = this.getHitboxInfo();
        const width = hitboxInfo.sizeScale.x * CHARACTER_TILE_SIZE;
        const height = hitboxInfo.sizeScale.y * CHARACTER_TILE_SIZE;
        hitboxGraphic
            .beginPath()
            .moveTo(-width / 2, -height / 2)
            .lineTo(-width / 2, height / 2)
            .lineTo(width / 2, height / 2)
            .lineTo(width / 2, -height / 2)
            .lineTo(-width / 2, -height / 2)
            .stroke({ width: 2, color: 0x0000ff, alpha: 1 });
        const hitboxTexture = window.game.app.renderer.generateTexture(hitboxGraphic);
        this.hitbox = new Sprite(hitboxTexture);
        this.hitbox.anchor.set(0.5);
        this.hitbox.visible = window.game.debug;
        this.hitbox.position.set(hitboxInfo.displacement.x * CHARACTER_TILE_SIZE, hitboxInfo.displacement.y * CHARACTER_TILE_SIZE);
        this.spriteContainer.addChild(this.hitbox);

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
            interactive: this,
            position: this.position,
            velocity: this.velocity,
            sizeInTiles: this.sizeInTiles,
            layers: [CollisionLayer.ENTITY],
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

    protected getHitboxInfo() {
        return {
            sizeScale: new Vector2(1, 1),
            displacement: new Vector2(0, 0),
        };
    }

    // #################################################
    //   MONO
    // #################################################

    constructor({ characterType, positionInTiles, entityContainer }: CharacterProps) {
        this.characterType = characterType;
        this.position = new Vector2(positionInTiles.x, positionInTiles.y - this.sizeInTiles.y / 2);
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
        this.spriteContainer.width = tileSize * this.sizeInTiles.x;
        this.spriteContainer.height = tileSize * this.sizeInTiles.y;
    }

    // #################################################
    //   INTERACTIVE
    // #################################################

    public collisionLayer: CollisionLayer = CollisionLayer.ENTITY;

    shouldCollide() {
        return true;
    }

    getBounds(newPosition?: Vector2): Bounds {
        const { sizeScale, displacement } = this.getHitboxInfo();
        const width = sizeScale.x * this.sizeInTiles.x;
        const height = sizeScale.y * this.sizeInTiles.y;

        const pos = newPosition ?? this.position;

        return {
            x: pos.x - width / 2 + displacement.x * this.sizeInTiles.x,
            y: pos.y - height / 2 + displacement.y * this.sizeInTiles.y,
            width: width,
            height: height,
        };
    }

    get roundedPosition() {
        return new Vector2(Math.round(this.position.x), Math.round(this.position.y));
    }
}
