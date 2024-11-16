import { PokemonData } from "@/game/data/PokemonData";
import Character, { CharacterProps } from "@/game/entities/Character";
import { getCharacterAtlas } from "@/game/system/sprite/Spritesheet";
import { Poke } from "@/game/type/Entity";
import Vector2 from "@/game/type/Vector2";
import { Assets, Spritesheet } from "pixi.js";

export default class Pokemon extends Character {
    // #################################################
    //   CUSTOM
    // #################################################

    protected async loadSpritesheet() {
        const asset = await Assets.load(this.characterType);
        this.spritesheet = new Spritesheet(
            asset,
            getCharacterAtlas(this.characterType as Poke, PokemonData[this.characterType as Poke].spriteSize),
        );
        await this.spritesheet.parse();
    }

    protected getHitboxInfo() {
        return {
            scale: new Vector2(2 / 3, 2 / 3),
            displacement: new Vector2(0, 2 / 4),
        };
    }

    // #################################################
    //   MONO
    // #################################################

    constructor(props: CharacterProps) {
        super(props);

        this.maxVelocity = new Vector2(1.75, 1.75);
    }
}
