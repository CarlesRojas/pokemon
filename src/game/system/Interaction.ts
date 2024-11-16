import { DirectionalButtonAction } from "@/app/component/DirectionalButton";
import { EventKey } from "@/app/context/Event";
import { screenToTiles } from "@/game/system/Camera";
import { Mono } from "@/game/type/Mono";
import Vector2 from "@/game/type/Vector2";
import { Dimensions, getAngle } from "@/util";
import { CODE_A, CODE_D, CODE_S, CODE_W } from "keycode-js";

export enum MouseButton {
    LEFT = "mouseLeft",
    MIDDLE = "mouseMiddle",
    RIGHT = "mouseRight",
}

export default class Interaction implements Mono {
    private prevKeyPressed: { [key: string]: boolean } = {};
    private keyPressed: { [key: string]: boolean } = {};
    public mousePosition: Vector2 | null;
    private mouseScreenPosition: Vector2 | null;

    private usingDirectionalButton = false;
    private movingDirectionalButton = false;
    private directionalButtonDirection = new Vector2(0, 0);

    constructor() {
        window.game.app.stage.interactive = false;

        this.mousePosition = null;
        this.mouseScreenPosition = null;

        window.game.events.sub(EventKey.MOUSE_MOVE, this.handleMouseMove.bind(this));
        window.game.events.sub(EventKey.KEY_DOWN, this.handleKeyDown.bind(this));
        window.game.events.sub(EventKey.KEY_UP, this.handleKeyUp.bind(this));
        window.game.events.sub(EventKey.MOUSE_DOWN, this.handleMouseDown.bind(this));
        window.game.events.sub(EventKey.MOUSE_UP, this.handleMouseUp.bind(this));
        window.game.events.sub(EventKey.JOYSTICK_MOVE, this.handleJoystickMove.bind(this));
        window.game.events.sub(EventKey.JOYSTICK_UP, this.handleJoystickUp.bind(this));
        window.game.events.sub(EventKey.DIRECTIONAL_BUTTON_MOVE, this.handleDirectionalButtonMove.bind(this));
        window.game.events.sub(EventKey.DIRECTIONAL_BUTTON_UP, this.handleDirectionalButtonUp.bind(this));
    }

    destructor() {
        window.game.events.unsub(EventKey.MOUSE_MOVE, this.handleMouseMove.bind(this));
        window.game.events.unsub(EventKey.KEY_DOWN, this.handleKeyDown.bind(this));
        window.game.events.unsub(EventKey.KEY_UP, this.handleKeyUp.bind(this));
        window.game.events.unsub(EventKey.MOUSE_DOWN, this.handleMouseDown.bind(this));
        window.game.events.unsub(EventKey.MOUSE_UP, this.handleMouseUp.bind(this));
        window.game.events.unsub(EventKey.JOYSTICK_MOVE, this.handleJoystickMove.bind(this));
        window.game.events.unsub(EventKey.JOYSTICK_UP, this.handleJoystickUp.bind(this));
        window.game.events.unsub(EventKey.DIRECTIONAL_BUTTON_MOVE, this.handleDirectionalButtonMove.bind(this));
        window.game.events.unsub(EventKey.DIRECTIONAL_BUTTON_UP, this.handleDirectionalButtonUp.bind(this));
    }

    loop(deltaInSeconds: number): void {
        this.prevKeyPressed = { ...this.keyPressed };
        this.getMousePositionInTiles();
        this.handleDirectionalPositionState();
    }

    resize(dimensions: Dimensions): void {}

    getMousePositionInTiles() {
        if (!this.mouseScreenPosition) return;

        const mousePositionInTiles = screenToTiles(new Vector2(this.mouseScreenPosition.x, this.mouseScreenPosition.y));
        const cameraPosition = window.game.controller.camera.positionInTiles;

        this.mousePosition = new Vector2(mousePositionInTiles.x - cameraPosition.x, mousePositionInTiles.y - cameraPosition.y);
    }

    handleDirectionalPositionState() {
        if (!this.usingDirectionalButton) return;

        if (this.movingDirectionalButton) {
            const playerPositionInTiles = window.game.controller.entities.player.position;
            this.mousePosition = new Vector2(
                playerPositionInTiles.x + this.directionalButtonDirection.x,
                playerPositionInTiles.y + this.directionalButtonDirection.y,
            );
        } else {
            this.mousePosition = null;
        }
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
        const angle = getAngle(direction);

        if (direction.x === 0 && direction.y === 0) {
            this.keyPressed[CODE_W] = false;
            this.keyPressed[CODE_A] = false;
            this.keyPressed[CODE_S] = false;
            this.keyPressed[CODE_D] = false;
            return;
        }

        this.keyPressed[CODE_W] = angle >= (1 / 16) * 360 && angle < (7 / 16) * 360;
        this.keyPressed[CODE_A] = angle >= (5 / 16) * 360 && angle < (11 / 16) * 360;
        this.keyPressed[CODE_S] = angle >= (9 / 16) * 360 && angle < (15 / 16) * 360;
        this.keyPressed[CODE_D] = angle >= (13 / 16) * 360 || angle < (3 / 16) * 360;
    }

    handleJoystickUp() {
        this.keyPressed[CODE_A] = false;
        this.keyPressed[CODE_D] = false;
        this.keyPressed[CODE_W] = false;
        this.keyPressed[CODE_S] = false;
    }

    handleDirectionalButtonMove({ action, direction }: { action: DirectionalButtonAction; direction: Vector2 }) {
        if (action === DirectionalButtonAction.POKEBALL) this.keyPressed[MouseButton.LEFT] = true;
        this.usingDirectionalButton = true;
        this.movingDirectionalButton = true;
        this.directionalButtonDirection = direction;
    }

    handleDirectionalButtonUp({ action, canceled }: { action: DirectionalButtonAction; canceled: boolean }) {
        // TODO Handle cancelled action
        if (action === DirectionalButtonAction.POKEBALL) this.keyPressed[MouseButton.LEFT] = false;
        this.movingDirectionalButton = false;
        this.directionalButtonDirection = new Vector2(0, 0);
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

    get mousePositionInTiles() {
        return this.mousePosition;
    }
}
