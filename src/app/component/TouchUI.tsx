import Button, { ButtonAction } from "@/app/component/Button";
import Joystick from "@/app/component/Joystick";
import { EventKey, useEvents } from "@/app/context/Event";
import { cn } from "@/app/lib/util";
import { useMediaQuery } from "usehooks-ts";

const TouchUI = () => {
    const { emit } = useEvents();

    const matches = useMediaQuery("(display-mode: standalone)");

    return (
        <section className={cn("absolute inset-0 z-20 flex", matches && "bg-red-500/10")}>
            <div
                className="absolute bottom-0 left-0 right-0 grid p-4"
                style={{
                    gridTemplateColumns: "minmax(0, 0.25fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 5fr) minmax(0, 1fr) minmax(0, 0.25fr)",
                    gridTemplateRows: "minmax(0, 0.25fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.25fr)",
                    gridTemplateAreas: `
                                          '. . . . . .'
                                          '. m m . i .'
                                          '. m m . . .'
                                          '. . . . . .'
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

                <div className="relative w-full" style={{ gridArea: "i" }}></div>

                <div className="relative aspect-square w-full" style={{ gridArea: "i" }}>
                    <Button action={ButtonAction.INTERACT} />
                </div>
            </div>
        </section>
    );
};

export default TouchUI;
