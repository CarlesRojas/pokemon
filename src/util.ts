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

export const getAngle = (direction: Vector2) => {
    if (!direction) return 0;

    const angle = Math.atan2(direction.y, direction.x);
    return 360 - (((angle * 180) / Math.PI + 360) % 360);
};
