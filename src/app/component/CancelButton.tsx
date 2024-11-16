import { EventKey, useEvents, useEventSubscription } from "@/app/context/Event";
import { cn } from "@/app/lib/util";
import button from "@/asset/ui/Button.png";
import buttonShadow from "@/asset/ui/ButtonShadow.png";
import buttonCancel from "@/asset/ui/Cross.png";
import { useState } from "react";

const CancelButton = () => {
    const { emit } = useEvents();

    const [pressed, setPressed] = useState(false);
    const [visible, setVisible] = useState(false);

    // #################################################
    //   CANCEL BUTTON
    // #################################################

    const handleDirectionalButtonDown = () => {
        setVisible(true);
    };

    const handleDirectionalButtonUp = () => {
        setVisible(false);
    };

    const handleDirectionalButtonInsideArea = ({ insideArea }: { insideArea: boolean }) => {
        console.log(insideArea);
        setPressed(insideArea);
    };

    useEventSubscription(EventKey.DIRECTIONAL_BUTTON_DOWN, handleDirectionalButtonDown);
    useEventSubscription(EventKey.DIRECTIONAL_BUTTON_UP, handleDirectionalButtonUp);
    useEventSubscription(EventKey.DIRECTIONAL_BUTTON_INSIDE_AREA, handleDirectionalButtonInsideArea);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <button className={cn("pointer-events-auto relative hidden h-full w-full opacity-100", visible && "flex")} id={"cancelArea"}>
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

            <img
                className={cn("pointer-events-none absolute z-10 h-full w-full", pressed && "translate-y-[calc(80%/12)]")}
                style={{ imageRendering: "pixelated" }}
                src={buttonCancel.src}
                alt="button arrow"
            />
        </button>
    );
};

export default CancelButton;
