import { createContext, useContext, useEffect, useMemo, useRef } from "react";

export enum EventKey {
    FRAME_RATE_CHANGE = "FRAME_RATE_CHANGE",
    MOUSE_MOVE = "MOUSE_MOVE",
}

export type EventData = {
    [EventKey.MOUSE_MOVE]: { x: number; y: number };
    [EventKey.FRAME_RATE_CHANGE]: { frameRate: number };
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
