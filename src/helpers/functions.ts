import { format, utcToZonedTime } from 'date-fns-tz';
import type { Theme } from './../styles';
import { DefaultSelectEnum } from '../helpers';

export const isLightTheme = (theme: Theme): boolean => theme.name === 'light';
const { timeZone: localTimeZone } = Intl.DateTimeFormat().resolvedOptions();
const timeZone =
	process.env.NODE_ENV === 'test' ? process.env.REACT_APP_TEST_TIMEZONE : localTimeZone;

export const isNetworkSelected = (network: string) =>
	network !== DefaultSelectEnum.NETWORK && network !== '';

export const isTokenSelected = (token: string) => token !== DefaultSelectEnum.TOKEN && token !== '';

export const isArrayType = (value: any) => typeof value === 'object' && Array.isArray(value);

type BeautifyNumbers = {
	n: string | number;
	digits?: number;
};

const trimZeros = (res: string): string =>
	res.slice(-1) === '0' && res.slice(-2, -1) !== '.' ? trimZeros(res.slice(0, -1)) : res;

export const beautifyNumbers = ({ n, digits = 8 }: BeautifyNumbers): string => {
	let res = '';
	if (!n) return '';
	if (typeof n === 'number') {
		res = n.toFixed(digits);
	} else {
		res = (+n).toFixed(digits);
	}

	return trimZeros(res);
};

export const hexToRgbA = (hex: string, alpha = '1'): string => {
	const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));

	return `rgba(${r},${g},${b},${alpha})`;
};

export const isSwapRejected = (status: string, errorMessage: any) =>
	status === 'Exception' && errorMessage === 'user rejected transaction';

export const isSwapFailed = (status: string) => status === 'Fail';

export const isSwapConfirmed = (status: string) => status === 'Success';

export const formatDate = (ts: number | undefined): string =>
	ts
		? format(utcToZonedTime(new Date(ts * 1000), timeZone as string), 'dd/MM/yyyy HH:mm:ss')
		: 'n/a';

export const findAndReplace = (array: string[], find: string, replace: string): string[] => {
	const result = [...array];
	if (result.includes(find)) {
		const index = result.indexOf(find);
		result[index] = replace;
	}

	return result;
};

export const findNativeToken = (networkTokens: any): string => {
	let result = '';
	for (const [key, value] of Object.entries(networkTokens)) {
		// @ts-ignore
		if (value.isNative) {
			result = key;
			break;
		}
	}

	return result;
};
