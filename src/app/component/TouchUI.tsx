import Button, { ButtonAction } from "@/app/component/Button";
import CancelButton from "@/app/component/CancelButton";
import DirectionalButton, { DirectionalButtonAction } from "@/app/component/DirectionalButton";
import Joystick from "@/app/component/Joystick";
import { EventKey, useEvents, useEventSubscription } from "@/app/context/Event";
import { cn } from "@/app/lib/util";
import { useState } from "react";

const TouchUI = () => {
    const { emit } = useEvents();

    const [directionalButtonActive, setDirectionalButtonActive] = useState(false);

    const handleDirectionalButtonDown = () => setDirectionalButtonActive(true);
    const handleDirectionalButtonUp = () => setDirectionalButtonActive(false);

    useEventSubscription(EventKey.DIRECTIONAL_BUTTON_DOWN, handleDirectionalButtonDown);
    useEventSubscription(EventKey.DIRECTIONAL_BUTTON_UP, handleDirectionalButtonUp);

    return (
        <section className="absolute inset-0 z-20 flex">
            <div
                className="absolute bottom-0 left-0 right-0 grid p-4"
                style={{
                    gridTemplateColumns:
                        "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
                    gridTemplateRows: "repeat(4, minmax(0, 1fr))",
                    gridTemplateAreas: `
                                          '. . . . . . x'
                                          'm m m . . . .'
                                          'm m m . . p .'
                                          'm m m . i . .'
                                        `,
                }}
            >
                <div className="relative h-full w-full" style={{ gridArea: "m" }}>
                    <Joystick
                        onJoystickDown={() => emit(EventKey.JOYSTICK_DOWN, {})}
                        onJoystickUp={() => emit(EventKey.JOYSTICK_UP, {})}
                        onJoystickMove={(direction) => emit(EventKey.JOYSTICK_MOVE, { direction })}
                    />
                </div>

                <div className="relative w-full" style={{ gridArea: "x" }}>
                    <CancelButton />
                </div>

                <div className="relative w-full" style={{ gridArea: "p" }}>
                    <DirectionalButton action={DirectionalButtonAction.POKEBALL} />
                </div>

                <div className={cn("relative aspect-square w-full", directionalButtonActive && "hidden")} style={{ gridArea: "i" }}>
                    <Button action={ButtonAction.INTERACT} />
                </div>
            </div>
        </section>
    );
};

export default TouchUI;
