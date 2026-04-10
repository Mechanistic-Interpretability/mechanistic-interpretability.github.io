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
				// Skeuomorphic Design System Tokens
				shell: {
					// Light mode
					from: "#f4f7fb",
					via: "#d8dfe8",
					to: "#a6b2bf",
					border: "rgba(100, 116, 139, 0.45)",
					// Dark mode variants (via CSS custom properties)
				},
				bezel: {
					from: "#e8edf3",
					to: "#bac5d2",
					border: "rgba(100, 116, 139, 0.45)",
				},
				screen: {
					light: "#edf2f8",
					dark: "#060606",
				},
				accent: {
					violet: "#8b5cf6",
					"violet-light": "#a78bfa",
					sky: "#38bdf8",
					"sky-light": "#7dd3fc",
				},
			},
			boxShadow: {
				// Skeuomorphic shadows
				shell: "0 16px 28px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 -6px 12px rgba(71, 85, 105, 0.24)",
				"shell-lg":
					"0 24px 50px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -10px 18px rgba(71, 85, 105, 0.25)",
				"shell-dark":
					"0 20px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -6px 12px rgba(0, 0, 0, 0.45)",
				"shell-dark-lg":
					"0 28px 56px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -10px 20px rgba(0, 0, 0, 0.5)",
				bezel: "inset 0 2px 2px rgba(255, 255, 255, 0.65), inset 0 -3px 6px rgba(15, 23, 42, 0.2)",
				"bezel-dark":
					"inset 0 1px 2px rgba(255, 255, 255, 0.08), inset 0 -4px 9px rgba(0, 0, 0, 0.65)",
				// Button shadows
				button: "0 2px 6px rgba(15, 23, 42, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(71, 85, 105, 0.15)",
				"button-hover":
					"0 4px 12px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(71, 85, 105, 0.2)",
				"button-dark":
					"0 3px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
				"button-dark-hover":
					"0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -2px 4px rgba(0, 0, 0, 0.35)",
			},
			backgroundImage: {
				"shell-gradient":
					"linear-gradient(to bottom, #f4f7fb, #d8dfe8, #a6b2bf)",
				"shell-gradient-dark":
					"linear-gradient(to bottom, #3a4350, #2a313a, #1a2028)",
				"bezel-gradient":
					"linear-gradient(to bottom, #e8edf3, #bac5d2)",
				"bezel-gradient-dark":
					"linear-gradient(to bottom, #212833, #131922)",
			},
			borderRadius: {
				shell: "1rem",
				"shell-lg": "1.6rem",
			},
		},
	},
};

export default config;
