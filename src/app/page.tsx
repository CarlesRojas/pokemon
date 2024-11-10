"use client";

import Cursor from "@/app/component/Cursor";
import DevTools from "@/app/component/DevTools";
import TouchUI from "@/app/component/TouchUI";
import { EventKey, useEvents } from "@/app/context/Event";
import Controller from "@/game/Controller";
import Vector2 from "@/game/type/Vector2";
import { getGameDimensions } from "@/util";
import { Application } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceCallback, useIsMounted, useMediaQuery, useResizeObserver } from "usehooks-ts";

const Home = () => {
    const events = useEvents();

    const isMouse = useMediaQuery("(hover: hover)");
    const isMounted = useIsMounted();
    const [showUI, setShowUI] = useState(false);
    useEffect(() => {
        if (isMounted()) setShowUI(true);
    }, [isMounted]);

    const gameRef = useRef<HTMLDivElement>(null);
    const controller = useRef<Controller>();

    const initApp = async ({ width, height }: { width: number; height: number }) => {
        if (!gameRef.current) return;

        const app = new Application();
        await app.init({
            resizeTo: gameRef.current,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: "#22c55e",
        });

        gameRef.current.appendChild(app.canvas);
        controller.current = new Controller({ app, dimensions: getGameDimensions(new Vector2(width, height)), events });
    };

    const resizeApp = async ({ width, height }: { width: number; height: number }) => {
        if (!controller.current) initApp({ width, height });

        controller.current?.resize(getGameDimensions(new Vector2(width, height)));
    };

    const onResize = useDebounceCallback(({ width, height }) => resizeApp({ width, height }), 250);
    useResizeObserver({ ref: gameRef, onResize });

    // #################################################
    //   CAPTURE EVENTS
    // #################################################

    const handleMouseMove = useCallback(
        (e: MouseEvent) => events.emit(EventKey.MOUSE_MOVE, { position: new Vector2(e.clientX, e.clientY) }),
        [events],
    );
    const handleKeyDown = useCallback((e: KeyboardEvent) => events.emit(EventKey.KEY_DOWN, { keyCode: e.code }), [events]);
    const handleKeyUp = useCallback((e: KeyboardEvent) => events.emit(EventKey.KEY_UP, { keyCode: e.code }), [events]);
    const handleMouseDown = useCallback((e: MouseEvent) => events.emit(EventKey.MOUSE_DOWN, { mouseButton: e.button }), [events]);
    const handleMouseUp = useCallback((e: MouseEvent) => events.emit(EventKey.MOUSE_UP, { mouseButton: e.button }), [events]);
    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        return false;
    }, []);

    useEffect(() => {
        if (!isMouse) return;

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [isMouse, handleMouseMove, handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleContextMenu]);

    return (
        <>
            <main ref={gameRef} className="relative flex h-dvh w-dvw flex-col items-center justify-center" />
            <div className="absolute left-[50%] top-[50%] h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 bg-yellow-500" />
            {showUI && !isMouse && <TouchUI />}
            {showUI && isMouse && <Cursor />}
            <DevTools />
        </>
    );
};

export default Home;
