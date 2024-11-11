import Vector2 from "@/game/type/Vector2";
import { transposeMatrix } from "@/game/world/map";
import { AStarFinder } from "astar-typescript";

export const recalculatePathFinderMatrix = (): AStarFinder | null => {
    if (!window.game.controller.world.worldMatrix) return null;

    const worldMatrix = transposeMatrix(window.game.controller.world.worldMatrix);

    // TOOD Mark entities as impassible in the worldMatrix

    const aStar = new AStarFinder({
        grid: { matrix: worldMatrix },
        diagonalAllowed: false,
    });

    return aStar;
};

export const pathToVector2Array = (path: number[][]): Vector2[] => {
    return path.map(([x, y]) => new Vector2(x, y));
};
