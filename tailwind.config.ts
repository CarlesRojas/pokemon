import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            screens: {
                mouse: { raw: "(hover: hover)" },
            },
        },
    },
    plugins: [animate],
} satisfies Config;
