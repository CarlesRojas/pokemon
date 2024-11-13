import { getMovementAfterCollisions } from "@/game/system/Collision";
import { getPath, getRandomFreeTile } from "@/game/system/PathFind";
import { CHARACTER_TILE_SIZE } from "@/game/system/sprite/Spritesheet";
import { Bounds, Poke } from "@/game/type/Entity";
import { Follower } from "@/game/type/Follower";
import { CollisionLayer, Interactive } from "@/game/type/Interactive";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { AnimatedSprite, Container, Graphics, Sprite, Spritesheet } from "pixi.js";

export interface CharacterProps {
    characterType: Poke | "player";
    positionInTiles: Vector2;
    entityContainer: Container;
    velocity?: Vector2;
}

export default class Character implements Mono, Interactive, Follower {
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
    protected spriteBounds?: Sprite;

    // MOVEMENT
    protected currentAnimation!: keyof NonNullable<typeof this.animations>;
    protected sizeInTiles: Vector2 = new Vector2(2, 2);
    public position: Vector2 = new Vector2(0, 0);
    protected acceleration = 200;
    protected velocity: Vector2 = new Vector2(0, 0); // Tiles per second
    protected maxVelocity: Vector2 = new Vector2(5, 5); // Tiles per second

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
            this.changeAnimation(0);
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

        // SPRITE BORDER
        // this.spriteBounds = new Sprite(Texture.WHITE);
        // this.spriteBounds.tint = 0xff0000;
        // this.spriteBounds.anchor.set(0.5);
        // this.spriteBounds.alpha = 0.1;
        // this.spriteBounds.width = CHARACTER_TILE_SIZE;
        // this.spriteBounds.height = CHARACTER_TILE_SIZE;
        // this.spriteBounds.visible = window.game.debug;
        // this.spriteContainer.addChild(this.spriteBounds);

        this.entityContainer.addChild(this.spriteContainer);
        this.resize(window.game.dimensions);
    }

    protected getMovementToPerform(deltaInSeconds: number) {
        let movingLeft = false;
        let movingRight = false;
        let movingUp = false;
        let movingDown = false;

        const TOLERANCE = 0.05;

        if (this.path && this.path.length > 0) {
            let nextTile: Vector2 | null = this.path[0];
            const hasReachedNextTile = Vector2.distance(this.position, nextTile) < 0.25;
            if (hasReachedNextTile) this.path.shift();

            nextTile = this.path.length > 0 ? this.path[0] : null;

            if (nextTile) {
                movingLeft = this.position.x - nextTile.x > TOLERANCE;
                movingRight = nextTile.x - this.position.x > TOLERANCE;
                movingUp = this.position.y - nextTile.y > TOLERANCE;
                movingDown = nextTile.y - this.position.y > TOLERANCE;
            } else {
                // TODO temporary
                const map = window.game.controller.world.worldMatrix;
                if (map) this.setObjective(getRandomFreeTile(this));
            }
        }

        return { movingLeft, movingRight, movingUp, movingDown };
    }

    protected updateSpeed(deltaInSeconds: number) {
        const { movingLeft, movingRight, movingUp, movingDown } = this.getMovementToPerform(deltaInSeconds);

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
            layers: [CollisionLayer.ENTITY, CollisionLayer.WORLD],
            deltaInSeconds,
        });

        this.velocity = velocity;
        this.moveToPosition(position);
    }

    protected moveToPosition(position: Vector2) {
        this.position.x = position.x;
        this.position.y = position.y;

        const { tileSize } = window.game.dimensions;
        const { displacement } = this.getHitboxInfo();
        const scaledDisplacement = new Vector2(displacement.x * this.sizeInTiles.x, displacement.y * this.sizeInTiles.y);

        this.spriteContainer.position.set((position.x - scaledDisplacement.x) * tileSize, (position.y - scaledDisplacement.y) * tileSize);
    }

    protected changeAnimation(deltaInSeconds: number) {
        if (!this.animations) return;

        const { movingLeft, movingRight, movingUp, movingDown } = this.getMovementToPerform(deltaInSeconds);

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
        this.interactiveName = characterType.toUpperCase();
        this.position = new Vector2(positionInTiles.x, positionInTiles.y);
        this.entityContainer = entityContainer;
        this.spriteContainer = new Container();

        this.instantiate();
    }

    destructor() {
        this.entityContainer.removeChild(this.spriteContainer);
    }

    loop(deltaInSeconds: number): void {
        this.spriteContainer.zIndex = this.position.y;

        this.recalculatePath(deltaInSeconds);
        this.updateSpeed(deltaInSeconds);
        this.applyMovement(deltaInSeconds);
        this.changeAnimation(deltaInSeconds);
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
    public interactiveName = "CHARACTER";

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

    getOccupiedTiles(): Vector2[] {
        const bounds = this.getBounds();
        const minX = Math.floor(bounds.x);
        const minY = Math.floor(bounds.y);
        const maxX = Math.ceil(bounds.x + bounds.width);
        const maxY = Math.ceil(bounds.y + bounds.height);

        const result = Array.from({ length: maxY - minY }, (_, y) => new Vector2(minX, minY + y)).flatMap((tile) =>
            Array.from({ length: maxX - minX }, (_, x) => new Vector2(minX + x, tile.y)),
        );
        return result;
    }

    get roundedPosition() {
        return new Vector2(Math.round(this.position.x), Math.round(this.position.y));
    }

    // #################################################
    //   FOLLOWER
    // #################################################

    public objectiveInTiles: Vector2 | null = null;
    public recalculateIntervalInSeconds: number = 1; // TODO change to 1000 or lower
    public recalculateInterval: number = this.recalculateIntervalInSeconds;
    public path: Vector2[] | null = null;

    setObjective(objective: Vector2 | null): void {
        this.objectiveInTiles = objective;
        this.path = null;
        this.recalculateInterval = this.recalculateIntervalInSeconds;
    }

    recalculatePath(deltaInSeconds: number): void {
        if (!this.objectiveInTiles) return;
        this.recalculateInterval += deltaInSeconds;

        if (this.recalculateInterval < this.recalculateIntervalInSeconds) return;

        if (!this.roundedPosition.equals(this.objectiveInTiles)) {
            this.path = getPath(this.roundedPosition, this.objectiveInTiles, this);
            // if (this.interactiveName === Poke.CHARMANDER)
            //     console.log(
            //         this.characterType,
            //         this.roundedPosition,
            //         this.objectiveInTiles,
            //         JSON.stringify(this.path?.map((tile) => tile.toString())),
            //     );
        }
        this.recalculateInterval = 0;
    }
}
