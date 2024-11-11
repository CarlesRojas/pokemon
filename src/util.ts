import { HORIZONTAL_TILES_PER_SCREEN } from "@/constant";
import Vector2 from "@/game/type/Vector2";

export interface Dimensions {
    screen: Vector2;
    tileSize: number;
}

export const getGameDimensions = (dimensions: Vector2): Dimensions => ({
    screen: dimensions,
    tileSize: dimensions.x / HORIZONTAL_TILES_PER_SCREEN,
});

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
