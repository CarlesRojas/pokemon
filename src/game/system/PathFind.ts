import Vector2 from "@/game/type/Vector2";
import { AStarFinder } from "astar-typescript";

export const recalculatePathFinderMatrix = (): AStarFinder | null => {
    if (!window.game.controller.world.worldMatrix) return null;

    const worldMatrix = window.game.controller.world.worldMatrix.map((row) => [...row]);

    // TOOD Mark entities as impassible in the worldMatrix

    const aStar = new AStarFinder({
        grid: { matrix: worldMatrix },
    });

    return aStar;
};

export const pathToVector2Array = (path: number[][]): Vector2[] => {
    return path.map(([x, y]) => new Vector2(x, y));
};
