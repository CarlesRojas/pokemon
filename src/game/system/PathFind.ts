import { Interactive } from "@/game/type/Interactive";
import Vector2 from "@/game/type/Vector2";
import { transposeMatrix } from "@/game/world/map";
import { random } from "@/util";
import { AStarFinder } from "astar-typescript";

export enum PathFinderTile {
    BLOCKED = 1,
    FREE = 0,
}

const recalculatePathFinderMatrix = (interactive: Interactive, from: Vector2, to: Vector2): AStarFinder | null => {
    if (!window.game.controller.world.worldMatrix) return null;

    const worldMatrix = transposeMatrix(window.game.controller.world.worldMatrix);

    const entities = [window.game.controller.entities.player, ...window.game.controller.entities.pokemons] as Interactive[];
    for (const entity of entities) {
        if (entity === interactive) continue;

        const coords = entity.getOccupiedTiles();
        for (const coord of coords) worldMatrix[coord.y][coord.x] = PathFinderTile.BLOCKED;
    }

    worldMatrix[from.y][from.x] = PathFinderTile.FREE;
    worldMatrix[to.y][to.x] = PathFinderTile.FREE;

    const aStar = new AStarFinder({
        grid: { matrix: worldMatrix },
        diagonalAllowed: false,
        includeStartNode: false,
        heuristic: "Euclidean",
        weight: 0.5,
    });

    return aStar;
};

export const getPath = (from: Vector2, to: Vector2, interactive: Interactive): Vector2[] | null => {
    const pathFinder = recalculatePathFinderMatrix(interactive, from, to);
    if (!pathFinder) return null;

    // if (interactive.interactiveName === Poke.CHARMANDER) printPathFindGrid(pathFinder.getGrid());
    const path = pathFinder.findPath(from, to);

    return pathToVector2Array(path);
};

export const pathToVector2Array = (path: number[][]): Vector2[] => {
    return path.map(([x, y]) => new Vector2(x, y));
};

export const getRandomFreeTile = (interactive: Interactive): Vector2 | null => {
    if (!window.game.controller.world.worldMatrix) return null;
    const worldMatrix = window.game.controller.world.worldMatrix;

    let nextObjective = new Vector2(random(2, worldMatrix.length - 2), random(1, worldMatrix[0].length - 1));
    while (worldMatrix[nextObjective.x][nextObjective.y] === PathFinderTile.BLOCKED)
        nextObjective = new Vector2(random(2, worldMatrix.length - 2), random(1, worldMatrix[0].length - 1));

    // if (interactive.interactiveName === Poke.CHARMANDER) console.log(interactive.interactiveName, nextObjective.toString());
    return nextObjective;
};
