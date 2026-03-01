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
					blue: '#2563eb',
					dark: '#0f172a',
					gray: '#f8fafc',
					border: '#e2e8f0',
					sidebar: '#1e293b',
				},
			},
		},
	},
	plugins: [],
};
export default config;
