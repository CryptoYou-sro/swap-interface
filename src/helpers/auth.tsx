import axios from 'axios';
import { BASE_URL, BINANCE_PROD_URL, BINANCE_SCRIPT, BIZ_ENTRY_KEY, routes } from '../helpers';

export const loadBinanceKycScript = (cb?: any) => {
	const existingId = document.getElementById('binance-kcy-script');

	if (!existingId) {
		const binanceSdkScript = document.createElement('script');
		binanceSdkScript.src = BINANCE_SCRIPT;
		binanceSdkScript.id = 'binance-kcy-script';
		document.body.appendChild(binanceSdkScript);

		binanceSdkScript.onload = () => {
			if (cb) cb();
		};
	}
	if (existingId && cb) cb();
};

export const makeBinanceKycCall = (authToken: string) => {

	// @ts-ignore
	const binanceKyc = new BinanceKyc({
		authToken,
		bizEntityKey: BIZ_ENTRY_KEY,
		apiHost: BINANCE_PROD_URL,
		onMessage: ({ typeCode }: any) => {
			if (typeCode === '102') {
				binanceKyc.switchVisible(true);
			}
		}
	});
};

export const getAuthTokensFromNonce = async (account: string) => {
	try {
		const res = await axios.request({
			url: `${BASE_URL}${routes.getNonce}${account}`
		});
		try {
			return `By signing this nonce: "${res.data.nonce}" you accept the terms and conditions available at https://cryptoyou.io/terms-of-use/`;
		} catch (err: any) {
			throw new Error(err);
		}
	} catch (err: any) {
		throw new Error(err);
	}
};
