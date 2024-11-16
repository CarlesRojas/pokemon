/* eslint-disable @typescript-eslint/no-explicit-any */

import { Poke, PokemonId } from "@/game/type/Entity";
import fs from "fs";
const pokemonJson = JSON.parse(fs.readFileSync("src/game/pokemon.json", "utf8"));

const findPokeByNumber = (value: number): Poke | undefined => {
    for (const [key, val] of Object.entries(PokemonId)) {
        if (val === value) return key as Poke;
    }

    return undefined;
};

// Generate the TypeScript code
const output = `
export const pokemonData: Record<Poke, PokemonInfo> = {
${pokemonJson
    .map((pokemon: any) => {
        const id: number = pokemon.id;
        const enumName = findPokeByNumber(id);
        if (!enumName) console.log(`${pokemon.id} ${pokemon.name}`);

        const types = [pokemon.type1, pokemon.type2].filter((type) => type && type !== "").map((type) => `Type.${type.toUpperCase()}`);

        return `    [Poke.${enumName}]: {
        id: ${pokemon.id},
        name: "${pokemon.name}",
        form: "${pokemon.form}",
        types: [${types.join(", ")}],
        total: ${pokemon.total},
        hp: ${pokemon.hp},
        attack: ${pokemon.attack},
        defense: ${pokemon.defense},
        specialAttack: ${pokemon["special-attack"]},
        specialDefense: ${pokemon["special-defense"]},
        speed: ${pokemon.speed},
        generation: ${pokemon.generation}
    }`;
    })
    .filter((entry: any) => entry)
    .join(",\n")}
};
`;

// Write the output to a file
fs.writeFileSync("src/game/data/pokemonNewData.ts", output);
