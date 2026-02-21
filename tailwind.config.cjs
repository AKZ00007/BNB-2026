const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				gray: {
					...colors.neutral,
					800: '#171717',
					900: '#0A0A0A',
					950: '#000000',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					hover: '#C0001A',
					light: '#FEE2E2',
					ultra: '#FFF0F0',
					foreground: 'hsl(var(--primary-foreground))'
				},
				brand: {
					charcoal: '#050505',
					navy: '#0A0A0C'
				},
				gold: {
					DEFAULT: '#F0B90B'
				},
				cyan: {
					DEFAULT: '#00D6FF'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'system-ui',
					'-apple-system',
					'sans-serif'
				]
			},
			fontSize: {
				hero: [
					'clamp(52px, 5.5vw, 80px)',
					{
						lineHeight: '1.1'
					}
				]
			},
			maxWidth: {
				content: '1200px',
				prose: '680px',
				narrow: '720px',
				auth: '380px'
			},
			borderRadius: {
				'2xl': '20px',
				'3xl': '24px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				hero: '0 32px 64px -12px rgba(0,0,0,0.14)',
				cta: '0 4px 14px rgba(232,0,29,0.35)'
			},
			animation: {
				marquee: 'marquee 30s linear infinite',
				'marquee-rev': 'marquee-rev 35s linear infinite',
				'blur-in': 'blurIn 700ms ease-out forwards',
				'fade-in': 'fadeIn 500ms ease-out forwards',
				'slide-up': 'slideUp 500ms ease-out forwards',
				'accordion-down': 'accordion-down 300ms ease-out',
				'accordion-up': 'accordion-up 300ms ease-out'
			},
			keyframes: {
				marquee: {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-50%)'
					}
				},
				'marquee-rev': {
					'0%': {
						transform: 'translateX(-50%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				blurIn: {
					from: {
						opacity: '0',
						filter: 'blur(12px)'
					},
					to: {
						opacity: '1',
						filter: 'blur(0px)'
					}
				},
				fadeIn: {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				slideUp: {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography')
	],
}
