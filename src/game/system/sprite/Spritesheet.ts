import { TextureAsset } from "@/game/system/sprite/TextureManifest";
import { Poke } from "@/game/type/Entity";
import { Item } from "@/game/type/Item";
import Vector2 from "@/game/type/Vector2";

export const TILE_SIZE = 32;

const getFrame = (x: number, y: number, size: Vector2) => ({
    frame: { x: x * size.x * TILE_SIZE, y: y * size.y * TILE_SIZE, w: size.x * TILE_SIZE, h: size.y * TILE_SIZE },
    sourceSize: { w: size.x * TILE_SIZE, h: size.y * TILE_SIZE },
    spriteSourceSize: { x: 0, y: 0, w: size.x * TILE_SIZE, h: size.y * TILE_SIZE },
});

export const getCharacterAtlas = (textureAsset: TextureAsset | Poke, scale: Vector2) => {
    return {
        frames: {
            down1: getFrame(0, 0, scale),
            down2: getFrame(1, 0, scale),
            down3: getFrame(2, 0, scale),
            down4: getFrame(3, 0, scale),
            left1: getFrame(0, 1, scale),
            left2: getFrame(1, 1, scale),
            left3: getFrame(2, 1, scale),
            left4: getFrame(3, 1, scale),
            right1: getFrame(0, 2, scale),
            right2: getFrame(1, 2, scale),
            right3: getFrame(2, 2, scale),
            right4: getFrame(3, 2, scale),
            up1: getFrame(0, 3, scale),
            up2: getFrame(1, 3, scale),
            up3: getFrame(2, 3, scale),
            up4: getFrame(3, 3, scale),
        },
        meta: {
            image: textureAsset,
            format: "RGBA8888",
            size: { w: TILE_SIZE * scale.x * 4, h: TILE_SIZE * scale.y * 4 },
            scale: 1,
        },
        animations: {
            down: ["down1", "down2", "down3", "down4"],
            left: ["left1", "left2", "left3", "left4"],
            right: ["right1", "right2", "right3", "right4"],
            up: ["up1", "up2", "up3", "up4"],
            idle: ["down1"],
        },
    };
};

export const getExteriorAtlas = () => {
    return {
        frames: {
            none: getFrame(4, 2, new Vector2(1, 1)),
            bgGrass: getFrame(0, 0, new Vector2(4, 4)),
            rock: getFrame(14, 24, new Vector2(1, 1)), // Better hitbox: 1, 8, Rock: 14, 24
        },
        meta: {
            image: TextureAsset.GROUND,
            format: "RGBA8888",
            size: { w: 1024, h: 1024 },
            scale: 1,
        },
    };
};

export const getItemAtlas = (item: Item) => {
    return {
        frames: {
            main: getFrame(0, 0, new Vector2(1.5, 1.5)),
        },
        meta: {
            image: item,
            format: "RGBA8888",
            size: { w: 48, h: 48 },
            scale: 1,
        },
    };
};
