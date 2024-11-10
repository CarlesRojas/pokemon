import Player from "@/game/entities/Player";
import Pokemon from "@/game/entities/Pokemon";
import { Poke } from "@/game/type/Entity";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { map } from "@/game/world/map";
import { Dimensions, random } from "@/util";
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

        this.player = new Player({
            characterType: "player",
            positionInTiles: new Vector2(map.length / 2, map[0].length / 2),
            entityContainer: this.container,
        });

        const charmander = new Pokemon({
            characterType: Poke.CHARMANDER,
            positionInTiles: new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)),
            entityContainer: this.container,
        });

        const squirtle = new Pokemon({
            characterType: Poke.SQUIRTLE,
            positionInTiles: new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)),
            entityContainer: this.container,
        });

        const bulbasaur = new Pokemon({
            characterType: Poke.BULBASAUR,
            positionInTiles: new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)),
            entityContainer: this.container,
        });

        const pikachu = new Pokemon({
            characterType: Poke.PIKACHU,
            positionInTiles: new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)),
            entityContainer: this.container,
        });

        this.pokemons.push(charmander, squirtle, bulbasaur, pikachu);

        // TODO temporary
        charmander.setObjective(new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)));
        squirtle.setObjective(new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)));
        bulbasaur.setObjective(new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)));
        pikachu.setObjective(new Vector2(random(2, map.length - 2), random(1, map[0].length - 1)));
    }

    destructor() {
        this.player.destructor();
        this.pokemons.forEach((pokemon) => pokemon.destructor());
        window.game.stage.removeChild(this.container);
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
