import { Mono } from "@/game/type/Mono";
import { Dimensions } from "@/util";
import { Application } from "pixi.js";

interface Props {
    app: Application;
    dimensions: Dimensions;
}

export default class Controller implements Mono {
    constructor({ app, dimensions }: Props) {
        console.log("CONSTRUCTOR", dimensions);
    }

    destructor(): void {}

    loop(deltaInSeconds: number): void {
        console.log(deltaInSeconds);
    }

    resize(dimensions: Dimensions): void {
        console.log("RESIZE", dimensions);
    }
}
