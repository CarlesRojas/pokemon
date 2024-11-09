import { EventKey } from "@/app/context/Event";
import { Mono } from "@/game/type/Mono";
import { Dimensions } from "@/util";

export default class DevTools implements Mono {
    private frameRate: number;

    // #################################################
    //   MONO
    // #################################################

    constructor() {
        this.frameRate = 0;
    }

    destructor() {}

    loop(deltaInSeconds: number): void {
        const frameRate = Math.floor(1 / deltaInSeconds);
        if (this.frameRate === frameRate) return;

        this.frameRate = frameRate;
        window.game.events.emit(EventKey.FRAME_RATE_CHANGE, { frameRate: this.frameRate });
    }

    resize(dimensions: Dimensions): void {}
}
