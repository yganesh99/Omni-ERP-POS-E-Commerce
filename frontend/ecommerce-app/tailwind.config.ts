import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				brand: {
					red: '#e21c21', // Based on the FabricHub logo red
					dark: '#1c1c1c',
					gray: '#f4f4f4',
					border: '#e5e7eb',
				},
			},
		},
	},
	plugins: [],
};
export default config;
