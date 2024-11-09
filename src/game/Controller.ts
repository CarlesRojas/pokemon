import { Events } from "@/app/context/Event";
import Camera from "@/game/camera/Camera";
import DevTools from "@/game/devTools/DevTools";
import Entities from "@/game/entities/Entities";
import { TextureManifest } from "@/game/sprite/TextureManifest";
import { Mono } from "@/game/type/Mono";
import World from "@/game/world/World";
import { Dimensions } from "@/util";
import { Application, Assets, Container } from "pixi.js";

interface Props {
    app: Application;
    dimensions: Dimensions;
    events: Events;
}

export default class Controller implements Mono {
    public layers!: {
        devTools: DevTools;
        world: World;
        entities: Entities;
        camera: Camera;
        // interaction: Mono;
    };

    // #################################################
    //   CUSTOM
    // #################################################

    async load() {
        Assets.init({
            manifest: TextureManifest,
            defaultSearchParams: { mode: "cors" },
            preferences: { crossOrigin: "anonymous" },
        });
        await Promise.all([Assets.loadBundle("tileSet"), Assets.loadBundle("character")]);

        this.layers = {
            devTools: new DevTools(),
            world: new World(),
            entities: new Entities(),
            camera: new Camera(),
        };

        this.resize(window.game.dimensions);

        window.game.app.ticker.add(() => this.loop(window.game.app.ticker.deltaMS / 1000));
    }

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

        this.load();
    }

    destructor(): void {
        Object.values(this.layers).forEach((layer) => layer.destructor());
    }

    loop(deltaInSeconds: number): void {
        Object.values(this.layers).forEach((layer) => layer.loop(deltaInSeconds));
    }

    resize(dimensions: Dimensions): void {
        window.game.dimensions = dimensions;
        Object.values(this.layers).forEach((layer) => layer.resize(dimensions));
    }
}
