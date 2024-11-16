import { PokemonData } from "@/game/data/PokemonData";
import Player from "@/game/entities/Player";
import Pokemon from "@/game/entities/Pokemon";
import { getRandomFreeTile } from "@/game/system/PathFind";
import { Poke } from "@/game/type/Entity";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { Container } from "pixi.js";

export default class Entities implements Mono {
    private container: Container;

    public player!: Player;
    public pokemons: Pokemon[] = [];

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.container = new Container();
        window.game.stage.addChild(this.container);

        const map = window.game.controller.world.worldMatrix;
        if (!map) return;
        this.player = new Player({
            characterType: "player",
            positionInTiles: new Vector2(map[0].length / 2, map.length / 2),
            entityContainer: this.container,
            scale: new Vector2(2, 2),
        });

        const charmander = new Pokemon({
            characterType: Poke.CHARIZARD,
            positionInTiles: new Vector2(20, 15),
            entityContainer: this.container,
            scale: PokemonData[Poke.CHARIZARD].spriteSize,
        });

        const squirtle = new Pokemon({
            characterType: Poke.BLASTOISE,
            positionInTiles: new Vector2(22, 22),
            entityContainer: this.container,
            scale: PokemonData[Poke.BLASTOISE].spriteSize,
        });

        const bulbasaur = new Pokemon({
            characterType: Poke.VENUSAUR,
            positionInTiles: new Vector2(3, 15),
            entityContainer: this.container,
            scale: PokemonData[Poke.VENUSAUR].spriteSize,
        });

        const pikachu = new Pokemon({
            characterType: Poke.LUGIA,
            positionInTiles: new Vector2(15, 24),
            entityContainer: this.container,
            scale: PokemonData[Poke.LUGIA].spriteSize,
        });

        const mewtwo = new Pokemon({
            characterType: Poke.KYOGRE,
            positionInTiles: new Vector2(1, 1),
            entityContainer: this.container,
            scale: PokemonData[Poke.KYOGRE].spriteSize,
        });

        this.pokemons.push(charmander, squirtle, bulbasaur, pikachu, mewtwo);

        //  TODO temporary
        charmander.setObjective(getRandomFreeTile(charmander));
        squirtle.setObjective(getRandomFreeTile(squirtle));
        bulbasaur.setObjective(getRandomFreeTile(bulbasaur));
        pikachu.setObjective(getRandomFreeTile(pikachu));
        mewtwo.setObjective(getRandomFreeTile(mewtwo));
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
