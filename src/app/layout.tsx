import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: "Pokémon",
    description: "Fan made Pokémon game",
};

interface Props {
    children: ReactNode;
}

const RootLayout = ({ children }: Readonly<Props>) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
