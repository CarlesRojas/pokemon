import Character, { CharacterProps } from "@/game/entities/Character";
import { TextureAsset } from "@/game/system/sprite/TextureManifest";
import { CollisionLayer } from "@/game/type/Interactive";
import { CODE_A, CODE_D, CODE_S, CODE_W } from "keycode-js";

export default class Player extends Character {
    // #################################################
    //   CUSTOM
    // #################################################

    protected async loadSpritesheet() {
        this.spritesheet = window.game.controller.spritesheet[TextureAsset.PLAYER];
    }

    protected getMovementToPerform() {
        const movingLeft = window.game.controller.interaction.isKeyPressed(CODE_A);
        const movingRight = window.game.controller.interaction.isKeyPressed(CODE_D);
        const movingUp = window.game.controller.interaction.isKeyPressed(CODE_W);
        const movingDown = window.game.controller.interaction.isKeyPressed(CODE_S);

        return { movingLeft, movingRight, movingUp, movingDown };
    }

    // #################################################
    //   MONO
    // #################################################

    constructor(props: CharacterProps) {
        super(props);
    }

    // #################################################
    //   INTERACTIVE
    // #################################################

    public collisionLayer: CollisionLayer = CollisionLayer.PLAYER;
}
