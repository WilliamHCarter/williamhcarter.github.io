/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		colors: {
			'light': '#5F92CC',
			'dark': 'rgb(32 32 35)',
			'darkhl': '#525252',
			'offw': 'rgb(252, 250, 249)',
			'teal': '#2c7a7b',
		  },
		  screens: {
			'pc': '700px',
		  },
	},
	plugins: [],
}