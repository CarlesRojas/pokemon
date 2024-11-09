"use client";

import DevTools from "@/app/component/DevTools";
import { useEvents } from "@/app/context/Event";
import Controller from "@/game/Controller";
import Vector2 from "@/game/type/Vector2";
import { getGameDimensions } from "@/util";
import { Application } from "pixi.js";
import { useRef } from "react";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

const Home = () => {
    const events = useEvents();

    const gameRef = useRef<HTMLDivElement>(null);
    const controller = useRef<Controller>();

    const initApp = async ({ width, height }: { width: number; height: number }) => {
        if (!gameRef.current) return;

        const app = new Application();
        await app.init({ resizeTo: gameRef.current, resolution: window.devicePixelRatio || 1, autoDensity: true });

        gameRef.current.appendChild(app.canvas);
        controller.current = new Controller({ app, dimensions: getGameDimensions(new Vector2(width, height)), events });
    };

    const resizeApp = async ({ width, height }: { width: number; height: number }) => {
        if (!controller.current) initApp({ width, height });

        controller.current?.resize(getGameDimensions(new Vector2(width, height)));
    };

    const onResize = useDebounceCallback(({ width, height }) => resizeApp({ width, height }), 250);
    useResizeObserver({ ref: gameRef, onResize });

    return (
        <>
            <main ref={gameRef} className="flex h-dvh w-dvw flex-col items-center justify-center" />
            <DevTools />
        </>
    );
};

export default Home;
