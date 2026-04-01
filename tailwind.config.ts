import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
	content: ["./app/**/*.{js,ts,jsx,tsx}"],
	plugins: [typography],
	darkMode: "class",
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-ioskeley-mono)", "monospace"],
			},
			colors: {
				dark: {
					base: "#0a0a0a",
					elevated: "#1a1a1a",
					"surface-primary": "#1e1e1e",
					"surface-secondary": "#252525",
					"accent-primary": "#8a5cf6",
					"accent-secondary": "#06b6d4",
					"text-primary": "#f5f5f5",
					"text-secondary": "#d4d4d4",
				},
			},
		},
	},
};

export default config;
