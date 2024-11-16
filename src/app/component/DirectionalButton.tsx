import { EventKey, useEvents } from "@/app/context/Event";
import { cn } from "@/app/lib/util";
import button from "@/asset/ui/Button.png";
import buttonArrow from "@/asset/ui/ButtonIndicator.png";
import buttonShadow from "@/asset/ui/ButtonShadow.png";
import buttonPokeball from "@/asset/ui/Pokeball.png";
import Vector2 from "@/game/type/Vector2";
import { useInsideArea } from "@/hook/useInsideArea";
import { TouchEvent, useEffect, useRef, useState } from "react";

export enum DirectionalButtonAction {
    POKEBALL = "POKEBALL",
}

interface ButtonProps {
    action: DirectionalButtonAction;
    onDirectionalButtonDown: ({ action }: { action: DirectionalButtonAction }) => void;
    onDirectionalButtonUp: ({ action, canceled }: { action: DirectionalButtonAction; canceled: boolean }) => void;
    onDirectionalButtonMove: ({ action, direction }: { action: DirectionalButtonAction; direction: Vector2 }) => void;
}

const DirectionalButton = ({ action, onDirectionalButtonDown, onDirectionalButtonUp, onDirectionalButtonMove }: ButtonProps) => {
    const { emit } = useEvents();

    const [arrowVisible, setArrowVisible] = useState(false);
    const [angle, setAngle] = useState(0);
    const direction = useRef<Vector2 | null>(null);
    const areaRef = useRef<HTMLDivElement>(null);
    const touchID = useRef(0);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const touchStart = useRef<Vector2>(new Vector2(0, 0));

    const isInsideCancelArea = useInsideArea("cancelArea");
    const lastMouseCoords = useRef(new Vector2(0, 0));

    const icon: Record<DirectionalButtonAction, string | null> = {
        [DirectionalButtonAction.POKEBALL]: buttonPokeball.src,
    };

    // #################################################
    //   HANDLERS
    // #################################################

    const handleStart = (event: TouchEvent) => {
        if (!areaRef.current) return;
        const touch = event.changedTouches[0];
        const rect = areaRef.current.getBoundingClientRect();

        touchID.current = touch.identifier;
        touchStart.current = new Vector2(touch.clientX, touch.clientY);

        setPosition({
            x: ((touch.clientX - rect.left) / rect.width) * 100,
            y: ((touch.clientY - rect.top) / rect.height) * 100,
        });

        setArrowVisible(true);
        handleMove(event);
        onDirectionalButtonDown({ action });
        emit(EventKey.DIRECTIONAL_BUTTON_DOWN, {});
    };

    const handleMove = (event: TouchEvent) => {
        if (!areaRef.current) return;

        const touch = Array.from(event.changedTouches).find((touch) => touch.identifier === touchID.current);
        if (!touch) return handleStop();

        const newDirection = new Vector2(touch.clientX - touchStart.current.x, touch.clientY - touchStart.current.y);

        const rect = areaRef.current.getBoundingClientRect();
        const movementDistance = Math.sqrt(newDirection.x ** 2 + newDirection.y ** 2);
        const MOVEMENT_THRESHOLD = 0.1 * rect.width;

        if (movementDistance > MOVEMENT_THRESHOLD) {
            direction.current = newDirection.normalized;
            const angle = Math.atan2(newDirection.y, newDirection.x);
            const degrees = (180 * angle) / Math.PI + 90;
            setAngle(degrees);
            setArrowVisible(true);
        } else {
            direction.current = new Vector2(0, 0);
            setAngle(0);
            setArrowVisible(false);
        }

        lastMouseCoords.current = new Vector2(touch.clientX, touch.clientY);
        const insideArea = isInsideCancelArea(lastMouseCoords.current);
        emit(EventKey.DIRECTIONAL_BUTTON_INSIDE_AREA, { insideArea });
    };

    const handleStop = () => {
        direction.current = null;
        setArrowVisible(false);
        setPosition({ x: 50, y: 50 });
        const insideArea = isInsideCancelArea(lastMouseCoords.current);
        onDirectionalButtonUp({ action, canceled: insideArea });
        emit(EventKey.DIRECTIONAL_BUTTON_UP, {});
    };

    // #################################################
    //   SEND INPUT TO GAME
    // #################################################

    useEffect(() => {
        if (!direction.current) return;
        onDirectionalButtonMove({ action, direction: direction.current });
    }, [action, angle, onDirectionalButtonMove]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div
            className="pointer-events-auto relative flex h-full w-full opacity-100"
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleStop}
            onTouchCancel={handleStop}
            ref={areaRef}
            id={`touchControl_${action}`}
        >
            <div
                className="absolute h-full w-full"
                style={{
                    left: position.x ? `${position.x}%` : "50%",
                    top: position.y ? `${position.y}%` : "50%",
                    transform: `translate(-50%, -50%)`,
                }}
            >
                <img
                    className="translate-0 pointer-events-none absolute z-0 h-full w-full"
                    style={{ imageRendering: "pixelated" }}
                    src={buttonShadow.src}
                    alt="button shadow"
                />

                <img
                    className={"pointer-events-none absolute left-0 right-0 h-full w-full origin-center"}
                    style={{ imageRendering: "pixelated" }}
                    src={button.src}
                    alt="button"
                />

                {icon[action] && (
                    <img
                        className={"pointer-events-none absolute left-0 right-0 h-full w-full origin-center"}
                        style={{ imageRendering: "pixelated" }}
                        src={icon[action]}
                        alt="button arrow"
                    />
                )}

                <img
                    className={cn(
                        "pointer-events-none absolute left-0 right-0 h-full w-full origin-center",
                        arrowVisible && direction.current ? "opacity-100" : "opacity-0",
                    )}
                    style={{ transform: `rotate(${angle}deg) scale(2)`, imageRendering: "pixelated" }}
                    src={buttonArrow.src}
                    alt="button arrow"
                />
            </div>
        </div>
    );
};

export default DirectionalButton;
