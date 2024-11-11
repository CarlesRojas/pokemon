import { TextureAsset } from "@/game/system/sprite/TextureManifest";
import { Poke } from "@/game/type/Entity";

export const CHARACTER_TILE_SIZE = 64;
export const EXTERIOR_TILE_SIZE = 32;

const getFrame = (x: number, y: number, size: number) => ({
    frame: { x: x * size, y: y * size, w: size, h: size },
    sourceSize: { w: size, h: size },
    spriteSourceSize: { x: 0, y: 0, w: size, h: size },
});

export const getCharacterAtlas = (textureAsset: TextureAsset | Poke) => {
    return {
        frames: {
            down1: getFrame(0, 0, CHARACTER_TILE_SIZE),
            down2: getFrame(1, 0, CHARACTER_TILE_SIZE),
            down3: getFrame(2, 0, CHARACTER_TILE_SIZE),
            down4: getFrame(3, 0, CHARACTER_TILE_SIZE),
            left1: getFrame(0, 1, CHARACTER_TILE_SIZE),
            left2: getFrame(1, 1, CHARACTER_TILE_SIZE),
            left3: getFrame(2, 1, CHARACTER_TILE_SIZE),
            left4: getFrame(3, 1, CHARACTER_TILE_SIZE),
            right1: getFrame(0, 2, CHARACTER_TILE_SIZE),
            right2: getFrame(1, 2, CHARACTER_TILE_SIZE),
            right3: getFrame(2, 2, CHARACTER_TILE_SIZE),
            right4: getFrame(3, 2, CHARACTER_TILE_SIZE),
            up1: getFrame(0, 3, CHARACTER_TILE_SIZE),
            up2: getFrame(1, 3, CHARACTER_TILE_SIZE),
            up3: getFrame(2, 3, CHARACTER_TILE_SIZE),
            up4: getFrame(3, 3, CHARACTER_TILE_SIZE),
        },
        meta: {
            image: textureAsset,
            format: "RGBA8888",
            size: { w: CHARACTER_TILE_SIZE * 4, h: CHARACTER_TILE_SIZE * 4 },
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
            none: getFrame(4, 2, EXTERIOR_TILE_SIZE),
            bgGrass: getFrame(0, 0, EXTERIOR_TILE_SIZE * 4),
            rock: getFrame(14, 24, EXTERIOR_TILE_SIZE), // Better hitbox: 1, 8
        },
        meta: {
            image: TextureAsset.GROUND,
            format: "RGBA8888",
            size: {
                w: 1024,
                h: 1024,
            },
            scale: 1,
        },
    };
};
