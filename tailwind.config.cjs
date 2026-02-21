
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "rgba(255,255,255, 0.1)",
                input: "rgba(255,255,255, 0.1)",
                ring: "#F0B90B",
                background: "#0A0A0F",
                foreground: "#FAFAFA",
                primary: {
                    DEFAULT: "#F0B90B",
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#8B5CF6",
                    foreground: "#FFFFFF",
                },
                destructive: {
                    DEFAULT: "#EF4444",
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#121218",
                    foreground: "#A1A1AA",
                },
                accent: {
                    DEFAULT: "#1A1A22",
                    foreground: "#FAFAFA",
                },
                popover: {
                    DEFAULT: "#121218",
                    foreground: "#FAFAFA",
                },
                card: {
                    DEFAULT: "#121218",
                    foreground: "#FAFAFA",
                },
                // BNB Brand
                gold: {
                    DEFAULT: '#F0B90B',
                    50: '#FEF9E7',
                    100: '#FDF3CF',
                    200: '#FBE79F',
                    300: '#F9DB6F',
                    400: '#F7CF3F',
                    500: '#F0B90B',
                    600: '#C09408',
                    700: '#906F06',
                    800: '#604A04',
                    900: '#302502',
                },
                purple: {
                    DEFAULT: '#8B5CF6',
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                },
                // Source brand tokens
                brand: {
                    charcoal: '#050505',
                    navy: '#0A0A0C',
                    gold: '#F3BA2F',
                    cyan: '#00D6FF',
                },
                cyan: {
                    DEFAULT: '#00D6FF',
                    50: '#E6FBFF',
                    100: '#B3F3FF',
                    200: '#80EBFF',
                    300: '#4DE3FF',
                    400: '#1ADBFF',
                    500: '#00D6FF',
                    600: '#00ABCC',
                    700: '#008099',
                    800: '#005566',
                    900: '#002B33',
                },
                bg: {
                    base: '#0A0A0F',
                    surface: '#121218',
                    'surface-raised': '#1A1A22',
                    'surface-elevated': '#252530',
                },
                text: {
                    primary: '#FAFAFA',
                    secondary: '#A1A1AA',
                    tertiary: '#71717A',
                    inverse: '#0A0A0F',
                },
                // Semantic
                success: '#22C55E',
                error: '#EF4444',
                warning: '#F59E0B',
                info: '#3B82F6',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            // Include animation plugin
        },
    },
    plugins: [require("tailwindcss-animate")],
}
