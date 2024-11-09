import { Bounds } from "@/game/type/Entity";

export enum CollisionLayer {
    NONE = "none",
    PLAYER = "player",
    ENTITY = "entity",
}

export interface Interactive {
    shouldCollide(): boolean;
    get bounds(): Bounds;
    get collisionLayer(): CollisionLayer;
}
