import Player from "@/game/entities/Player";
import Pokemon from "@/game/entities/Pokemon";
import { Poke } from "@/game/type/Entity";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { Container } from "pixi.js";

export default class Entities implements Mono {
    private container: Container;

    public player: Player;
    public pokemons: Pokemon[] = [];

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.container = new Container();
        window.game.stage.addChild(this.container);

        this.player = new Player({ characterType: "player", positionInTiles: new Vector2(0, 0) });
        const charmander = new Pokemon({ characterType: Poke.CHARMANDER, positionInTiles: new Vector2(-6, 3) });
        const squirtle = new Pokemon({ characterType: Poke.SQUIRTLE, positionInTiles: new Vector2(5, -2) });
        const bulbasaur = new Pokemon({ characterType: Poke.BULBASAUR, positionInTiles: new Vector2(-1, 4) });
        const pikachu = new Pokemon({ characterType: Poke.PIKACHU, positionInTiles: new Vector2(-2, -3) });
        this.pokemons.push(charmander, squirtle, bulbasaur, pikachu);
    }

    destructor() {
        window.game.stage.removeChild(this.container);
        this.player.destructor();
        this.pokemons.forEach((pokemon) => pokemon.destructor());
    }

    loop(deltaInSeconds: number) {
        this.player.loop(deltaInSeconds);
        this.pokemons.forEach((pokemon) => pokemon.loop(deltaInSeconds));
    }

    resize(dimensions: Dimensions) {
        this.player.resize(dimensions);
        this.pokemons.forEach((pokemon) => pokemon.resize(dimensions));
    }
}
