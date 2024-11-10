import { Poke, PokemonId } from "@/game/type/Entity";
import { type AssetsManifest } from "pixi.js";

const BASE_URL = "https://storage.googleapis.com/pokemon-asset";

export enum TextureBundle {
    TILE = "TILE",
    CHARACTER = "CHARACTER",
    POKEMON = "POKEMON",
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
            name: TextureBundle.CHARACTER,
            assets: [{ alias: TextureAsset.PLAYER, src: `${BASE_URL}/character/trchar000.png`, data: { scaleMode: "nearest" } }],
        },
        {
            name: TextureBundle.POKEMON,
            assets: Object.values(Poke).map((pokemon) => ({
                alias: pokemon,
                src: `${BASE_URL}/pokemon/${PokemonId[pokemon].toString().padStart(3, "0")}.png`,
                data: { scaleMode: "nearest" },
            })),
        },
    ],
};
