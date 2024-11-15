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
    const touchID = useRef(0);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const touchStart = useRef<Vector2>(new Vector2(0, 0));

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
        onJoystickDown();
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
        }
    };

    const handleStop = () => {
        direction.current = null;
        setArrowVisible(false);
        setPosition({ x: 50, y: 50 });
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
            <div
                className="absolute h-full w-full"
                style={{
                    left: position.x ? `${position.x}%` : "50%",
                    top: position.y ? `${position.y}%` : "50%",
                    transform: `translate(-50%, -50%)`,
                }}
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
                        arrowVisible && direction.current ? "opacity-100" : "opacity-0",
                    )}
                    style={{ transform: `rotate(${angle}deg)`, imageRendering: "pixelated" }}
                    src={joystickArrow.src}
                    alt="joystick arrow"
                />
            </div>
        </div>
    );
};

export default Joystick;
