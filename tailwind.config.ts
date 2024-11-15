import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            screens: {
                mouse: { raw: "(hover: hover)" },
            },
            dropShadow: {
                text: "0.15rem 0.15rem 0 rgba(0, 0, 0, 1)",
            },
        },
    },
    plugins: [animate],
} satisfies Config;
