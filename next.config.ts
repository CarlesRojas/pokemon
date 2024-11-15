import nextpwa from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

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
