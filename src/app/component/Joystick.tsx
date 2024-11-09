import { cn } from "@/app/lib/util";
import joystickArrow from "@/asset/joystickArrow.png";
import joystickCircle from "@/asset/joystickCircle.png";
import Vector2 from "@/game/type/Vector2";
import { TouchEvent, useEffect, useRef, useState } from "react";

interface Props {
    onJoystickDown: () => void;
    onJoystickUp: () => void;
    onJoystickMove: (direction: Vector2) => void;
}

const Joystick = ({ onJoystickDown, onJoystickUp, onJoystickMove }: Props) => {
    const [arrowVisible, setArrowVisible] = useState(false);
    const [angle, setAngle] = useState(0);
    const direction = useRef<Vector2 | null>(new Vector2(0, 0));
    const areaRef = useRef<HTMLDivElement>(null);
    const lastMouseCoords = useRef(new Vector2(0, 0));
    const touchID = useRef(0);

    // #################################################
    //   HANDLERS
    // #################################################

    const handleStart = (event: TouchEvent) => {
        touchID.current = event.changedTouches[0].identifier;
        setArrowVisible(true);
        handleMove(event);
        onJoystickDown();
    };

    const handleMove = (event: TouchEvent) => {
        if (!areaRef.current) return;

        const touch = Array.from(event.changedTouches).find((touch) => touch.identifier === touchID.current);
        if (!touch) return handleStop();

        const rect = areaRef.current.getBoundingClientRect();
        const newDirection = new Vector2(touch.clientX - rect.left - rect.width / 2, touch.clientY - rect.top - rect.height / 2).normalized;
        direction.current = newDirection;

        const angle = Math.atan2(newDirection.y, newDirection.x);
        const degrees = (180 * angle) / Math.PI + 90;

        lastMouseCoords.current = new Vector2(touch.clientX, touch.clientY);

        setAngle(degrees);
    };

    const handleStop = () => {
        direction.current = null;
        setArrowVisible(false);

        onJoystickUp();
    };

    // #################################################
    //   SEND INPUT TO GAME
    // #################################################

    useEffect(() => {
        if (!direction.current) return;
        onJoystickMove(direction.current);
    }, [angle, onJoystickMove]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div
            className="pointer-events-auto relative h-full w-full opacity-80"
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleStop}
            onTouchCancel={handleStop}
            ref={areaRef}
        >
            <img
                className="pointer-events-none absolute left-0 right-0 h-full w-full origin-center"
                style={{ imageRendering: "pixelated" }}
                src={joystickCircle.src}
                alt="joystick circle"
            />

            <img
                className={cn(
                    "pointer-events-none absolute left-0 right-0 h-full w-full origin-center",
                    arrowVisible ? "opacity-100" : "opacity-0",
                )}
                style={{
                    transform: `rotate(${angle}deg)`,
                    imageRendering: "pixelated",
                }}
                src={joystickArrow.src}
                alt="joystick arrow"
            />
        </div>
    );
};

export default Joystick;
