import { Events } from "@/app/context/Event";
import DevTools from "@/game/DevTools";
import { Mono } from "@/game/type/Mono";
import { Dimensions } from "@/util";
import { Application, Container } from "pixi.js";

interface Props {
    app: Application;
    dimensions: Dimensions;
    events: Events;
}

export default class Controller implements Mono {
    private layers: {
        devTools: Mono;
        // entities: Mono;
        // world: Mono;
        // camera: Mono;
        // interaction: Mono;
    };

    // #################################################
    //   MONO
    // #################################################

    constructor({ app, dimensions, events }: Props) {
        const stage = new Container();
        app.stage.addChild(stage);

        window.game = {
            app,
            dimensions,
            controller: this,
            stage,
            events,
        };

        this.layers = {
            devTools: new DevTools(),
        };

        window.game.app.ticker.add(() => this.loop(window.game.app.ticker.deltaMS / 1000));
    }

    destructor(): void {}

    loop(deltaInSeconds: number): void {
        Object.values(this.layers).forEach((layer) => layer.loop(deltaInSeconds));
    }

    resize(dimensions: Dimensions): void {
        window.game.dimensions = dimensions;
        Object.values(this.layers).forEach((layer) => layer.resize(dimensions));
    }
}
