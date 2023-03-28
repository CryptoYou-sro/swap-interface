export type ThemeName = 'light' | 'dark';

export type Theme = {
	name: ThemeName;
	font: {
		default: string;
		secondary: string;
		select: string;
	};
	background: {
		default: string;
		secondary: string;
		tertiary: string;
	};
	button: {
		default: string;
		error: string;
		warning: string;
		disabled: string;
		success: string;
		wallet: string;
		transparent: string;
	};
	border: {
		default: string;
		secondary: string;
	};
	modal: {
		default: string;
		background: string;
		shadow: string;
	};
	list: {
		hover: string;
		active: string;
	};
};

export const lightTheme: Theme = {
	name: 'light',
	font: {
		default: '#5A5A5A',
		secondary: '#909090',
		select: '#B4B4B4'
	},
	background: {
		default: '#FFF',
		secondary: '#F8F8F8',
		tertiary: '#494949'
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		disabled: '#6D6D6D',
		success: '#18C108',
		wallet: '#505050',
		transparent: 'transparent'
	},
	border: {
		default: '#B4B4B4',
		secondary: '#E5E5E5'
	},
	modal: {
		default: '#F0F0F0',
		background: '#D6D6D6',
		shadow: '#868686'
	},
	list: {
		hover: '#F8F8F8',
		active: '#EAEAEA'
	}
};

export const darkTheme: Theme = {
	name: 'dark',
	font: {
		default: '#FFF',
		secondary: '#B4B4B4',
		select: '#B4B4B4'
	},
	background: {
		default: '#161B20',
		secondary: '#1C2125',
		tertiary: '#494949'
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		disabled: '#6D6D6D',
		success: '#18C108',
		wallet: '#505050',
		transparent: 'transparent'
	},
	border: {
		default: '#404040',
		secondary: '#FFF'
	},
	modal: {
		default: '#1C2125',
		background: '#212426',
		shadow: '#0A0A0A'
	},
	list: {
		hover: '#1A1F25',
		active: '#2A2F35'
	}
};

export const theme: { light: Theme; dark: Theme } = { light: lightTheme, dark: darkTheme };
