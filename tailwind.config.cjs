/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		colors: {
			'light': '#5F92CC',
			'dark': '#202023',
			'darkhl': '#525252',
			'offw': 'rgb(252, 250, 249)',
			'teal': '#2c7a7b',
			'g': '#E2E8F0',
			'ghl': '#CBD5E0',
		  },
		  screens: {
			'pc': '700px',
		  },
	},
	plugins: [],
}