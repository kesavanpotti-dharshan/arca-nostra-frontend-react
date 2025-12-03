// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["Playfair Display", "serif"],
                body: ["Poppins", "sans-serif"],
            },
        },
    },
};

export default config;