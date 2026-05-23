/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				display: ['"Cormorant Garamond"', '"Times New Roman"', "serif"],
				sans: ["Manrope", "system-ui", "sans-serif"],
				mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
				arabic: ["Amiri", "serif"],
			},
		},
	},
	plugins: [],
};
