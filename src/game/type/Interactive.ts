import { Bounds } from "@/game/type/Entity";
import Vector2 from "@/game/type/Vector2";

export enum CollisionLayer {
    NONE = "NONE",
    ENTITY = "ENTITY",
    WORLD = "WORLD",
}

export interface Interactive {
    interactiveName: string;
    shouldCollide(): boolean;
    getBounds(newPosition?: Vector2): Bounds;
    getOccupiedTiles(): Vector2[];
    get collisionLayer(): CollisionLayer;
}
