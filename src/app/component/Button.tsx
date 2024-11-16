import { EventKey, useEvents } from "@/app/context/Event";
import { cn } from "@/app/lib/util";
import button from "@/asset/ui/Button.png";
import buttonShadow from "@/asset/ui/ButtonShadow.png";
import circle from "@/asset/ui/Circle.png";
import { CODE_E } from "keycode-js";
import { useEffect, useState } from "react";

export enum ButtonAction {
    INTERACT = "INTERACT",
}

interface ButtonProps {
    action: ButtonAction;
}

const Button = ({ action }: ButtonProps) => {
    const { emit } = useEvents();

    const [pressed, setPressed] = useState(false);

    const icon: Record<ButtonAction, string | null> = {
        [ButtonAction.INTERACT]: circle.src,
    };

    // #################################################
    //   HANDLERS
    // #################################################

    const handleStart = () => {
        setPressed(true);
    };

    const handleStop = () => {
        setPressed(false);
    };

    // #################################################
    //   SEND INPUT TO GAME
    // #################################################

    useEffect(() => {
        if (action === ButtonAction.INTERACT) emit(pressed ? EventKey.KEY_DOWN : EventKey.KEY_UP, { keyCode: CODE_E });
    }, [pressed, emit, action]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <button
            className="pointer-events-auto relative flex h-full w-full opacity-100"
            onTouchStart={handleStart}
            onTouchEnd={handleStop}
            onTouchCancel={handleStop}
        >
            <img
                className="translate-0 pointer-events-none absolute z-0 h-full w-full"
                style={{ imageRendering: "pixelated" }}
                src={buttonShadow.src}
                alt="button shadow"
            />

            <img
                className={cn("pointer-events-none relative h-full w-full", pressed ? "translate-y-[calc(80%/12)]" : "translate-y-0")}
                style={{ imageRendering: "pixelated" }}
                src={button.src}
                alt="button"
            />

            {icon[action] && (
                <img
                    className={cn("pointer-events-none absolute z-10 h-full w-full", pressed && "translate-y-[calc(80%/12)]")}
                    style={{ imageRendering: "pixelated" }}
                    src={icon[action]}
                    alt="button arrow"
                />
            )}
        </button>
    );
};

export default Button;
