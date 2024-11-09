import Player from "@/game/entities/Player";
import { Mono } from "@/game/type/Mono";
import { Dimensions } from "@/util";
import { Container } from "pixi.js";

export default class Entities implements Mono {
    private container: Container;

    public player: Player;

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.container = new Container();
        window.game.stage.addChild(this.container);

        this.player = new Player();
    }

    destructor() {
        window.game.stage.removeChild(this.container);
        this.player.destructor();
    }

    loop(deltaInSeconds: number) {
        this.player.loop(deltaInSeconds);
    }

    resize(dimensions: Dimensions) {
        this.player.resize(dimensions);
    }
}
