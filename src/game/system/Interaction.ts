import { EventKey } from "@/app/context/Event";
import { screenToTiles } from "@/game/system/Camera";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions } from "@/util";
import { CODE_A, CODE_D, CODE_S, CODE_W } from "keycode-js";

export enum MouseButton {
    LEFT = "mouseLeft",
    MIDDLE = "mouseMiddle",
    RIGHT = "mouseRight",
}

export default class Interaction implements Mono {
    private prevKeyPressed: { [key: string]: boolean } = {};
    private keyPressed: { [key: string]: boolean } = {};
    public mousePositionInTiles: Vector2 | null;
    private mouseScreenPosition: Vector2 | null;

    constructor() {
        window.game.app.stage.interactive = false;

        this.mousePositionInTiles = null;
        this.mouseScreenPosition = null;

        window.game.events.sub(EventKey.MOUSE_MOVE, this.handleMouseMove.bind(this));
        window.game.events.sub(EventKey.KEY_DOWN, this.handleKeyDown.bind(this));
        window.game.events.sub(EventKey.KEY_UP, this.handleKeyUp.bind(this));
        window.game.events.sub(EventKey.MOUSE_DOWN, this.handleMouseDown.bind(this));
        window.game.events.sub(EventKey.MOUSE_UP, this.handleMouseUp.bind(this));
        window.game.events.sub(EventKey.JOYSTICK_MOVE, this.handleJoystickMove.bind(this));
        window.game.events.sub(EventKey.JOYSTICK_UP, this.handleJoystickUp.bind(this));
    }

    destructor() {
        window.game.events.unsub(EventKey.MOUSE_MOVE, this.handleMouseMove.bind(this));
        window.game.events.unsub(EventKey.KEY_DOWN, this.handleKeyDown.bind(this));
        window.game.events.unsub(EventKey.KEY_UP, this.handleKeyUp.bind(this));
        window.game.events.unsub(EventKey.MOUSE_DOWN, this.handleMouseDown.bind(this));
        window.game.events.unsub(EventKey.MOUSE_UP, this.handleMouseUp.bind(this));
        window.game.events.unsub(EventKey.JOYSTICK_MOVE, this.handleJoystickMove.bind(this));
        window.game.events.unsub(EventKey.JOYSTICK_UP, this.handleJoystickUp.bind(this));
    }

    loop(deltaInSeconds: number): void {
        this.prevKeyPressed = { ...this.keyPressed };
        this.getMousePositionInTiles();
    }

    resize(dimensions: Dimensions): void {}

    getMousePositionInTiles() {
        if (!this.mouseScreenPosition) return;

        const mousePositionInTiles = screenToTiles(new Vector2(this.mouseScreenPosition.x, this.mouseScreenPosition.y));
        const cameraPosition = window.game.controller.camera.positionInTiles;

        this.mousePositionInTiles = new Vector2(mousePositionInTiles.x - cameraPosition.x, mousePositionInTiles.y - cameraPosition.y);
    }

    // #################################################
    //   EVENTS
    // #################################################

    handleMouseMove({ position }: { position: Vector2 }) {
        this.mouseScreenPosition = position;
    }

    handleKeyDown({ keyCode }: { keyCode: string }) {
        this.keyPressed[keyCode] = true;
    }

    handleKeyUp({ keyCode }: { keyCode: string }) {
        this.keyPressed[keyCode] = false;
    }

    handleMouseDown({ mouseButton }: { mouseButton: number }) {
        const code = mouseButton === 0 ? MouseButton.LEFT : mouseButton === 1 ? MouseButton.MIDDLE : MouseButton.RIGHT;
        this.keyPressed[code] = true;
    }

    handleMouseUp({ mouseButton }: { mouseButton: number }) {
        const code = mouseButton === 0 ? MouseButton.LEFT : mouseButton === 1 ? MouseButton.MIDDLE : MouseButton.RIGHT;
        this.keyPressed[code] = false;
    }

    handleJoystickMove({ direction }: { direction: Vector2 }) {
        const angle = Math.atan2(direction.y, direction.x);
        const degrees = 360 - (((angle * 180) / Math.PI + 360) % 360);

        if (direction.x === 0 && direction.y === 0) {
            this.keyPressed[CODE_W] = false;
            this.keyPressed[CODE_A] = false;
            this.keyPressed[CODE_S] = false;
            this.keyPressed[CODE_D] = false;
            return;
        }

        this.keyPressed[CODE_W] = degrees >= (1 / 16) * 360 && degrees < (7 / 16) * 360;
        this.keyPressed[CODE_A] = degrees >= (5 / 16) * 360 && degrees < (11 / 16) * 360;
        this.keyPressed[CODE_S] = degrees >= (9 / 16) * 360 && degrees < (15 / 16) * 360;
        this.keyPressed[CODE_D] = degrees >= (13 / 16) * 360 || degrees < (3 / 16) * 360;
    }

    handleJoystickUp() {
        this.keyPressed[CODE_A] = false;
        this.keyPressed[CODE_D] = false;
        this.keyPressed[CODE_W] = false;
        this.keyPressed[CODE_S] = false;
    }

    // #################################################
    //   GETTERS
    // #################################################

    get isKeyFirstPressed() {
        return (key: string) => this.keyPressed[key] && !this.prevKeyPressed[key];
    }

    get isKeyPressed() {
        return (key: string) => this.keyPressed[key];
    }
}
