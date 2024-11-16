import { EventKey, useEvents } from "@/app/context/Event";
import { cn } from "@/app/lib/util";
import button from "@/asset/ui/Button.png";
import buttonShadow from "@/asset/ui/ButtonShadow.png";
import buttonCancel from "@/asset/ui/Cross.png";
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
            className="pointer-events-auto relative flex h-full w-full items-center justify-center opacity-80"
            onTouchStart={handleStart}
            onTouchEnd={handleStop}
            onTouchCancel={handleStop}
            id={`touchControl_${action}`}
        >
            <img
                className="translate-0 pointer-events-none absolute left-[10%] right-[10%] z-0 h-[80%] w-[80%]"
                style={{ imageRendering: "pixelated" }}
                src={buttonShadow.src}
                alt="button shadow"
            />

            <img
                className={cn("pointer-events-none relative h-[80%] w-[80%]", pressed ? "translate-y-[calc(80%/12)]" : "translate-y-0")}
                style={{ imageRendering: "pixelated" }}
                src={button.src}
                alt="button"
            />

            <img
                className={cn(
                    "pointer-events-none absolute left-[10%] right-[10%] z-10 h-[80%] w-[80%]",
                    pressed && "translate-y-[calc(80%/12)]",
                )}
                style={{ imageRendering: "pixelated" }}
                src={buttonCancel.src}
                alt="button arrow"
            />
        </button>
    );
};

export default Button;
