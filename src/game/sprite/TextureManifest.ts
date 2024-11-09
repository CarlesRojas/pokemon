import { TileType } from "@/game/type/Tile";
import { Assets, Texture, type AssetsManifest } from "pixi.js";

const BASE_URL = "https://storage.googleapis.com/pokemon-asset";

export const TextureManifest: AssetsManifest = {
    bundles: [
        {
            name: "tileSet",
            assets: [{ alias: "exterior", src: `${BASE_URL}/tileset/Exterior1.png` }],
        },
        {
            name: "character",
            assets: [{ alias: "player", src: `${BASE_URL}/character/trchar000.png` }],
        },
    ],
};

export const getTileTexture = (name: TileType) => {
    const texture = Assets.get(name) as Texture;
    texture.source.scaleMode = "nearest";
    return texture;
};
