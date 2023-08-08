import { format, utcToZonedTime } from 'date-fns-tz';
import type { Theme } from './../styles';
import { DefaultSelectEnum } from '../helpers';
import type { Chain } from '@wagmi/core';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import type { WalletConnectProviderOpts } from '@web3modal/ethereum/dist/_types/src/types';

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

// -- constants ------------------------------------------------------- //
export const NAMESPACE = 'eip155';
// -- providers ------------------------------------------------------- //
export function customW3mProvider<C extends Chain>({ projectId }: WalletConnectProviderOpts) {
	return jsonRpcProvider<C>({
		rpc: chain => {
			const supportedChains = [
				// Default values (56 been deleted)
				// 1, 3, 4, 5, 10, 42, 56, 69, 97, 100, 137, 280, 324, 420, 42161, 42220, 43114, 80001, 421611,
				1, 3, 4, 5, 10, 42, 69, 97, 100, 137, 280, 324, 420, 42161, 42220, 43114, 80001, 421611,
				421613, 1313161554, 1313161555
			];

			if (supportedChains.includes(chain.id)) {
				return {
					http: `https://rpc.walletconnect.com/v1/?chainId=${NAMESPACE}:${chain.id}&projectId=${projectId}`
				};
			}

			return {
				http: chain.rpcUrls.default.http[0],
				webSocket: chain.rpcUrls.default.webSocket?.[0]
			};
		}
	});
}

export const getTodaysDate = () => {
	
	return new Date().toISOString().split('T')[0];
};