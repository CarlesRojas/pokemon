import Vector2 from "@/game/type/Vector2";

export interface CoordsMap<T> {
    [key: string]: T;
}

export interface TileMap<T> {
    tileMap: CoordsMap<T>;
    get elementAtCoords(): (coords: Vector2) => T | null;
}
