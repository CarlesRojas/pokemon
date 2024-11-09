import { Events } from "@/app/context/Event";
import Controller from "@/game/Controller";
import { Dimensions } from "@/util";
import { Application, Container } from "pixi.js";

export interface Game {
    app: Application;
    dimensions: Dimensions;
    controller: Controller;
    stage: Container;
    events: Events;
}

declare global {
    interface Window {
        game: Game;
    }
}
