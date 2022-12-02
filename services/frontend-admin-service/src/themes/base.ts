import createTheme from '@mui/material/styles/createTheme';

const htmlFontSize = 16;

export const baseTheme = createTheme({
	typography: {
		htmlFontSize: 16,
		pxToRem: (size: number): string => `${size / htmlFontSize}rem`,
	},
	designSystemColors: {
		black: {
			primary: '#0F0F10',
			light: '#7A838C',
			dark: '#44494E',
		},
		white: {
			primary: '#FFFFFF',
			light: '#EBF0F5',
			dark: '#BDC8D3',
		},
		orange: {
			primary: '#FF884E',
			light: '#FFAE87',
			dark: '#EE6F32',
		},
		red: {
			primary: '#F55252',
			light: '#FB6F6F',
			dark: '#E31C1C',
		},
		green: {
			primary: '#69E071',
			light: '#8CF593',
			dark: '#30BE39',
		},
		blue: {
			primary: '#2E6DF2',
			light: '#538AFD',
			dark: '#1952CB',
		},
		grayscale: {
			dark: '#44494E',
			semidark: '#7A838C',
			normal: '#BDC8D3',
			semilight: '#EBF0F5',
			light: '#FBFBFC',
		},
	},
});
