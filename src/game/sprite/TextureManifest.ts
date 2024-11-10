import { type AssetsManifest } from "pixi.js";

const BASE_URL = "https://storage.googleapis.com/pokemon-asset";

export enum TextureBundle {
    TILE = "TILE",
    ENTITY = "ENTITY",
}

export enum TextureAsset {
    GROUND = "GROUND",
    PLAYER = "PLAYER",
}

export const TextureManifest: AssetsManifest = {
    bundles: [
        {
            name: TextureBundle.TILE,
            assets: [{ alias: TextureAsset.GROUND, src: `${BASE_URL}/tileset/Ground.png`, data: { scaleMode: "nearest" } }],
        },
        {
            name: TextureBundle.ENTITY,
            assets: [{ alias: TextureAsset.PLAYER, src: `${BASE_URL}/character/trchar000.png`, data: { scaleMode: "nearest" } }],
        },
    ],
};
