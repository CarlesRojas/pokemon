import Vector2 from "@/game/type/Vector2";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

export enum EventKey {
    FRAME_RATE_CHANGE = "FRAME_RATE_CHANGE",
    MOUSE_MOVE = "MOUSE_MOVE",

    KEY_DOWN = "KEY_DOWN",
    KEY_UP = "KEY_UP",

    MOUSE_DOWN = "MOUSE_DOWN",
    MOUSE_UP = "MOUSE_UP",

    JOYSTICK_DOWN = "JOYSTICK_DOWN",
    JOYSTICK_MOVE = "JOYSTICK_MOVE",
    JOYSTICK_UP = "JOYSTICK_UP",
}

export type EventData = {
    [EventKey.FRAME_RATE_CHANGE]: { frameRate: number };

    [EventKey.MOUSE_MOVE]: { position: Vector2 };

    [EventKey.KEY_DOWN]: { keyCode: string };
    [EventKey.KEY_UP]: { keyCode: string };

    [EventKey.MOUSE_DOWN]: { mouseButton: number };
    [EventKey.MOUSE_UP]: { mouseButton: number };

    [EventKey.JOYSTICK_DOWN]: object;
    [EventKey.JOYSTICK_MOVE]: { direction: Vector2 };
    [EventKey.JOYSTICK_UP]: object;
};

export type Events = {
    sub: <K extends EventKey>(eventKey: K, func: (data: EventData[K]) => void) => void;
    unsub: <K extends EventKey>(eventKey: K, func: (data: EventData[K]) => void) => void;
    emit: <K extends EventKey>(eventKey: K, data: EventData[K]) => void;
};

const EventContext = createContext<Events | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
    const events = useRef<{ [K in EventKey]?: ((data: EventData[K]) => void)[] }>({});

    const sub = <K extends EventKey>(eventKey: K, func: (data: EventData[K]) => void) => {
        events.current[eventKey] = events.current[eventKey] || [];
        if (!events.current[eventKey].includes(func)) events.current[eventKey].push(func);
    };

    const unsub = <K extends EventKey>(eventKey: K, func: (data: EventData[K]) => void) => {
        const currentEvent = events.current[eventKey];
        if (currentEvent)
            for (let i = 0; i < currentEvent.length; i++)
                if (currentEvent[i] === func) {
                    currentEvent.splice(i, 1);
                    break;
                }
    };

    const emit = <K extends EventKey>(eventKey: K, data: EventData[K]) => {
        const currentEvent = events.current[eventKey];
        if (currentEvent)
            currentEvent.forEach((func) => {
                try {
                    func(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventKey}:`, error);
                }
            });
    };

    const contextValue = useMemo(() => ({ sub, unsub, emit }), []);

    return <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) throw new Error("useEvent must be used within an EventProvider");
    return context;
};

export const useEventSubscription = <K extends EventKey>(eventKey: K, handler: (data: EventData[K]) => void) => {
    const { sub, unsub } = useEvents();

    useEffect(() => {
        sub(eventKey, handler);
        return () => unsub(eventKey, handler);
    }, [eventKey, handler, sub, unsub]);
};
