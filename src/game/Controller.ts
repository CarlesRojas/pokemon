import { Events } from "@/app/context/Event";
import Entities from "@/game/entities/Entities";
import Camera from "@/game/system/Camera";
import DevTools from "@/game/system/DevTools";
import Interaction from "@/game/system/Interaction";
import { getCharacterAtlas, getExteriorAtlas } from "@/game/system/sprite/Spritesheet";
import { TextureAsset, TextureBundle, TextureManifest } from "@/game/system/sprite/TextureManifest";
import { Mono } from "@/game/type/Mono";
import World from "@/game/world/World";
import { Dimensions } from "@/util";
import { Application, Assets, Container, Spritesheet } from "pixi.js";

interface Props {
    app: Application;
    dimensions: Dimensions;
    events: Events;
}

export default class Controller implements Mono {
    public devTools!: DevTools;
    public spritesheet!: Record<TextureAsset, Spritesheet>;
    public world!: World;
    public entities!: Entities;
    public camera!: Camera;
    public interaction!: Interaction;

    // #################################################
    //   CUSTOM
    // #################################################

    async load() {
        Assets.init({
            manifest: TextureManifest,
            defaultSearchParams: { mode: "cors" },
            preferences: { crossOrigin: "anonymous" },
        });
        await Promise.all([Assets.loadBundle(TextureBundle.TILE), Assets.loadBundle(TextureBundle.CHARACTER)]);

        const exteriorAtlas = getExteriorAtlas();
        const characterAtlas = getCharacterAtlas(TextureAsset.PLAYER);
        const groundSpritesheet = new Spritesheet(Assets.get(exteriorAtlas.meta.image), exteriorAtlas);
        const playerSpritesheet = new Spritesheet(Assets.get(characterAtlas.meta.image), characterAtlas);

        await Promise.all([groundSpritesheet.parse(), playerSpritesheet.parse()]);

        this.spritesheet = {
            [TextureAsset.GROUND]: groundSpritesheet,
            [TextureAsset.PLAYER]: playerSpritesheet,
        };
        this.devTools = new DevTools();
        this.interaction = new Interaction();
        this.world = new World();
        this.entities = new Entities();
        this.camera = new Camera();

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
        this.devTools.destructor();
        this.interaction.destructor();
        this.world.destructor();
        this.entities.destructor();
        this.camera.destructor();
    }

    loop(deltaInSeconds: number): void {
        this.devTools.loop(deltaInSeconds);
        this.interaction.loop(deltaInSeconds);
        this.world.loop(deltaInSeconds);
        this.entities.loop(deltaInSeconds);
        this.camera.loop(deltaInSeconds);
    }

    resize(dimensions: Dimensions): void {
        window.game.dimensions = dimensions;
        this.devTools.resize(dimensions);
        this.interaction.resize(dimensions);
        this.world.resize(dimensions);
        this.entities.resize(dimensions);
        this.camera.resize(dimensions);
    }
}
