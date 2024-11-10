import Vector2 from "@/game/type/Vector2";

export interface Follower {
    objectiveInTiles: Vector2 | null;
    recalculateIntervalInSeconds: number;
    path: Vector2[] | null;

    setObjective(objective: Vector2 | null): void;
    recalculatePath(deltaInSeconds: number): void;
}
