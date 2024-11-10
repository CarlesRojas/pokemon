import { Bounds } from "@/game/type/Entity";

export enum CollisionLayer {
    NONE = "none",
    PLAYER = "player",
    ENTITY = "entity",
    WORLD = "world",
}

export interface Interactive {
    shouldCollide(): boolean;
    get bounds(): Bounds;
    get collisionLayer(): CollisionLayer;
}
