import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import "./globals.css";

const pokemon = localFont({
    src: "./fonts/pkmnem.ttf",
    variable: "--font-pokemon",
    weight: "500",
});

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
            <body className={`${pokemon.variable}`}>{children}</body>
        </html>
    );
};

export default RootLayout;
