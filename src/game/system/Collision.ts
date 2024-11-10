import { Bounds } from "@/game/type/Entity";
import { CollisionLayer, Interactive } from "@/game/type/Interactive";
import Vector2 from "@/game/type/Vector2";

interface EntityMovement {
    interactive: Interactive;
    position: Vector2;
    velocity: Vector2;
    layers: CollisionLayer[];
    deltaInSeconds: number;
}

export interface Collision {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
    correction: Vector2;
}

const EXTRA_CORRECTION = 0.001; // In tiles
const COLLISION_STEP = 0.01; // In tiles

export const getMovementAfterCollisions = (movement: EntityMovement) => {
    const movementAfterVertical = applyVerticalMovement(movement);
    const movementAfterHorizontal = applyHorizontalMovement(movementAfterVertical);

    return movementAfterHorizontal;
};

const applyVerticalMovement = (movement: EntityMovement) => {
    const { velocity, position, deltaInSeconds, layers, interactive } = movement;
    if (velocity.y === 0) return movement;

    const sign = velocity.y > 0 ? 1 : -1;
    const totalDeltaYPosition = Math.abs(velocity.y * deltaInSeconds);

    for (let deltaYPosition = COLLISION_STEP; deltaYPosition <= totalDeltaYPosition; deltaYPosition += COLLISION_STEP) {
        if (deltaYPosition > totalDeltaYPosition) deltaYPosition = totalDeltaYPosition;

        const newPosition = new Vector2(position.x, position.y + deltaYPosition * sign);
        const newBounds = interactive.getBounds(newPosition);
        const collision = isCollidingWithLayers(newBounds, layers, interactive);

        if (!!collision) {
            const newMovement: EntityMovement = {
                ...movement,
                position: new Vector2(position.x, position.y + collision.correction.y),
                velocity: new Vector2(velocity.x, 0),
            };

            return newMovement;
        }

        if (deltaYPosition >= totalDeltaYPosition) break;
    }

    const newMovement: EntityMovement = {
        ...movement,
        position: new Vector2(position.x, position.y + velocity.y * deltaInSeconds),
    };

    return newMovement;
};

const applyHorizontalMovement = (movement: EntityMovement) => {
    const { velocity, position, deltaInSeconds, layers, interactive } = movement;
    if (velocity.x === 0) return movement;

    const sign = velocity.x > 0 ? 1 : -1;
    const totalDeltaXPosition = Math.abs(velocity.x * deltaInSeconds);

    for (let deltaXPosition = COLLISION_STEP; deltaXPosition <= totalDeltaXPosition; deltaXPosition += COLLISION_STEP) {
        if (deltaXPosition > totalDeltaXPosition) deltaXPosition = totalDeltaXPosition;

        const newPosition = new Vector2(position.x + deltaXPosition * sign, position.y);
        const newBounds = interactive.getBounds(newPosition);
        const collision = isCollidingWithLayers(newBounds, layers, interactive);

        if (!!collision) {
            const newMovement: EntityMovement = {
                ...movement,
                position: new Vector2(position.x + collision.correction.x, position.y),
                velocity: new Vector2(0, velocity.y),
            };

            return newMovement;
        }

        if (deltaXPosition >= totalDeltaXPosition) break;
    }

    const newMovement: EntityMovement = {
        ...movement,
        position: new Vector2(position.x + velocity.x * deltaInSeconds, position.y),
    };

    return newMovement;
};

export const isCollidingWithLayers = (bounds: Bounds, layers: CollisionLayer[], interactive: Interactive) => {
    const entitiesCollision = isCollidingWithEntities(bounds, layers, interactive);
    if (!!entitiesCollision) return entitiesCollision;

    return false;
};

const isCollidingWithEntities = (bounds: Bounds, layers: CollisionLayer[], interactive: Interactive) => {
    const interactiveObjects: Interactive[] = [window.game.controller.entities.player, ...window.game.controller.entities.pokemons];
    if (window.game.controller.world.ground) interactiveObjects.push(...Object.values(window.game.controller.world.ground.tileMap));

    for (const interactiveObject of interactiveObjects) {
        if (layers.includes(interactiveObject.collisionLayer) && interactive !== interactiveObject) {
            const entityBounds = interactiveObject.getBounds();
            const collision = areBoundsColliding(bounds, entityBounds);
            if (!!collision) return collision;
        }
    }

    return false;
};

export const areBoundsColliding = (bounds1: Bounds, bounds2: Bounds) => {
    const entity1 = {
        x: bounds1.x + bounds1.width / 2,
        y: bounds1.y + bounds1.height / 2,
        width: bounds1.width,
        height: bounds1.height,
        halfWidth: bounds1.width / 2,
        halfHeight: bounds1.height / 2,
    };

    const entity2 = {
        x: bounds2.x + bounds2.width / 2,
        y: bounds2.y + bounds2.height / 2,
        width: bounds2.width,
        height: bounds2.height,
        halfWidth: bounds2.width / 2,
        halfHeight: bounds2.height / 2,
    };

    const collides =
        entity1.x - entity1.halfWidth < entity2.x + entity2.halfWidth &&
        entity1.x + entity1.halfWidth > entity2.x - entity2.halfWidth &&
        entity1.y - entity1.halfHeight < entity2.y + entity2.halfHeight &&
        entity1.y + entity1.halfHeight > entity2.y - entity2.halfHeight;

    if (!collides) return false;

    const horizontal = entity1.x - entity2.x;
    const vertical = entity1.y - entity2.y;

    const overlapX =
        horizontal > 0
            ? entity2.x + entity2.halfWidth - (entity1.x - entity1.halfWidth)
            : entity2.x - entity2.halfWidth - (entity1.x + entity1.halfWidth);
    const overlapY =
        vertical > 0
            ? entity2.y + entity2.halfHeight - (entity1.y - entity1.halfHeight)
            : entity2.y - entity2.halfHeight - (entity1.y + entity1.halfHeight);

    const useHorizontal = Math.abs(overlapX) < Math.abs(overlapY);

    const left = useHorizontal && horizontal < 0;
    const right = useHorizontal && horizontal > 0;
    const top = !useHorizontal && vertical < 0;
    const bottom = !useHorizontal && vertical > 0;

    let correctionX = 0;
    let correctionY = 0;

    if (useHorizontal) correctionX = overlapX - (horizontal < 0 ? -EXTRA_CORRECTION : EXTRA_CORRECTION);
    else correctionY = overlapY - (vertical < 0 ? -EXTRA_CORRECTION : EXTRA_CORRECTION);

    return {
        left,
        right,
        top,
        bottom,
        correction: new Vector2(correctionX, correctionY),
    } as Collision;
};
