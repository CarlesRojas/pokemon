"use client";

import { useEffect, useRef } from "react";

const Cursor = () => {
    const cursor = useRef<HTMLDivElement>(null);

    const handleMousePositionChange = (event: MouseEvent) => {
        cursor.current?.setAttribute("style", "top: " + event.pageY + "px; left: " + event.pageX + "px;");
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMousePositionChange);

        return () => {
            document.removeEventListener("mousemove", handleMousePositionChange);
        };
    }, []);

    return (
        <div
            ref={cursor}
            className="pointer-events-none absolute z-[100] h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 shadow-[0_0_0_2px_black,0_0_0_4px_white,0_0_0_6px_black]"
        />
    );
};

export default Cursor;
