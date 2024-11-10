import Character, { CharacterProps } from "@/game/entities/Character";
import { getCharacterAtlas } from "@/game/system/sprite/Spritesheet";
import { Poke } from "@/game/type/Entity";
import { Assets, Spritesheet } from "pixi.js";

export default class Pokemon extends Character {
    // #################################################
    //   CUSTOM
    // #################################################

    protected async loadSpritesheet() {
        const asset = await Assets.load(this.characterType);
        this.spritesheet = new Spritesheet(asset, getCharacterAtlas(this.characterType as Poke));
        await this.spritesheet.parse();
    }

    // #################################################
    //   MONO
    // #################################################

    constructor(props: CharacterProps) {
        super(props);
    }
}
