import nextpwa from "@ducanh2912/next-pwa";
import createJiti from "jiti";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./env");

const withPWA = nextpwa({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: { disableDevLogs: true },
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
