import { SAFETY_TILES, WORLD_SIZE } from "@/constant";
import { pathToVector2Array, recalculatePathFinderMatrix } from "@/game/system/PathFind";
import { Mono } from "@/game/type/Mono";
import { Area, RenderArea } from "@/game/type/RenderArea";
import { TileMap } from "@/game/type/TileMap";
import Vector2 from "@/game/type/Vector2";
import Background from "@/game/world/Background";
import Tile from "@/game/world/Tile";
import { Dimensions } from "@/util";
import { AStarFinder } from "astar-typescript";

export default class World implements Mono {
    private background?: Mono & RenderArea & TileMap<Tile>;

    private renderArea: Area;
    private lastRenderArea: Area | null;

    async updateRenderArea() {
        const { screen, tileSize } = window.game.dimensions;
        const playerPosition = window.game.controller.entities.player.roundedPosition;

        const horizontalNumberOfTiles = Math.ceil(screen.x / tileSize / 2) + SAFETY_TILES;
        const verticalNumberOfTiles = Math.ceil(screen.y / tileSize / 2) + SAFETY_TILES;

        this.renderArea = {
            start: new Vector2(playerPosition.x - horizontalNumberOfTiles, playerPosition.y - verticalNumberOfTiles),
            end: new Vector2(playerPosition.x + horizontalNumberOfTiles, playerPosition.y + verticalNumberOfTiles),
        };

        if (
            this.lastRenderArea &&
            this.lastRenderArea.start.equals(this.renderArea.start) &&
            this.lastRenderArea.end.equals(this.renderArea.end)
        )
            return;

        this.lastRenderArea = this.renderArea;

        this.background?.updateRenderArea(this.renderArea);
    }

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.worldMatrix = Array.from({ length: WORLD_SIZE.y }, () => Array.from({ length: WORLD_SIZE.x }, () => 0));
        for (let x = 0; x < WORLD_SIZE.x; x++) {
            this.worldMatrix[0][x] = 1;
            this.worldMatrix[WORLD_SIZE.y - 1][x] = 1;
        }
        for (let y = 0; y < WORLD_SIZE.y; y++) {
            this.worldMatrix[y][0] = 1;
            this.worldMatrix[y][WORLD_SIZE.x - 1] = 1;
        }

        this.background = new Background();

        this.renderArea = { start: new Vector2(0, 0), end: new Vector2(0, 0) };
        this.lastRenderArea = null;
    }

    destructor() {
        this.background?.destructor();
    }

    loop(deltaInSeconds: number): void {
        this.updateRenderArea();
        this.background?.loop(deltaInSeconds);
        this.recalculatePathFinder(deltaInSeconds);
    }

    resize(dimensions: Dimensions): void {
        this.background?.resize(dimensions);
    }

    // #################################################
    //   PATHFINDING
    // #################################################

    public worldMatrix?: Array<Array<number>>;
    public pathFinder: AStarFinder | null = null;
    private pathFinderIntervalInSeconds: number = 3;
    private pathFinderInterval: number = this.pathFinderIntervalInSeconds;

    private recalculatePathFinder(deltaInSeconds: number) {
        this.pathFinderInterval += deltaInSeconds;
        if (!this.worldMatrix || this.pathFinderInterval < this.pathFinderIntervalInSeconds) return;

        this.pathFinder = recalculatePathFinderMatrix();
        this.pathFinderInterval = 0;
    }

    public getPath(from: Vector2, to: Vector2): Vector2[] | null {
        if (!this.pathFinder) return null;
        const path = this.pathFinder.findPath(from, to);
        return path ? pathToVector2Array(path) : null;
    }
}
