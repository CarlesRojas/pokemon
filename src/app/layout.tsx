import { ProviderGroup } from "@/app/ProviderGroup";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";

interface Props {
    children: ReactNode;
}

export const metadata: Metadata = {
    applicationName: "Pinyamon",
    title: { default: "Pinyamon", template: "Pinyamon" },
    description: "Open-world 2D Pokémon game.",
    manifest: "/manifest.json",
    appleWebApp: { capable: true, statusBarStyle: "black", title: "yes" },
    formatDetection: { telephone: false },
    openGraph: {
        type: "website",
        siteName: "Pinyamon",
        title: { default: "Pinyamon", template: "Pinyamon" },
        description: "Open-world 2D Pokémon game.",
    },
    twitter: { card: "summary", title: { default: "Pinyamon", template: "Pinyamon" }, description: "Open-world 2D Pokémon game." },
};

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    height: "device-height",
    initialScale: 1,
    viewportFit: "cover",
    userScalable: false,
    minimumScale: 1,
    maximumScale: 1,
};

const RootLayout = ({ children }: Readonly<Props>) => {
    return (
        <html lang="en">
            <ProviderGroup>
                <body>{children}</body>
            </ProviderGroup>
        </html>
    );
};

export default RootLayout;
