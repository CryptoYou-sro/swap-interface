export const LOCAL_STORAGE_THEME = 'darkMode';
export const LOCAL_STORAGE_AUTH = 'auth';

export const INITIAL_STORAGE = {
	access: '',
	refresh: '',
	account: '',
	isKyced: false
};

export const MESSAGE = {
	ignore: 'ignore',
	failed: 'Request failed'
};

export const BIZ_ENTRY_KEY = 'BMYBIT';
export const BINANCE_PROD_URL = 'https://api.commonservice.io';
export const BINANCE_DEV_URL = 'https://dip-qacb.sdtaop.com';
export const BINANCE_SCRIPT =
	'https://static.saasexch.com/static/binance/static/kyc-ui/sdk/0.0.2/sdk.js';
export const BINANCE_PRICE_TICKER = 'https://www.binance.com/api/v3/ticker/price';
export const BINANCE_EXCHANGE_INFO = 'https://api.binance.com/api/v3/exchangeInfo';

export const BASE_URL = 'https://auth-app-aq3rv.ondigitalocean.app/';
export const MOONBEAM_URL = 'https://rpc.api.moonbeam.network';

export const PROTOCOL_FEE = 0.002;
export const BINANCE_FEE = 0.002;
export const PROTOCOL_FEE_FACTOR = 1 / (1 - PROTOCOL_FEE);
export const START_TOKEN = 'ETH';
export const FEE_CURRENCY = 'USDT';

export const ESTIMATED_NETWORK_TRANSACTION_GAS = 55_437;
export const SERVICE_ADDRESS = '0xeB56c1d19855cc0346f437028e6ad09C80128e02';

export const CONTRACT_ADDRESSES = {
	1: '0xa1F9898392666F578fDd2b4B1505775fcC520B06',
	1284: '0x47733c7B78709aFE188835Bb79AddBFe944651dA',
	1287: '0x2d249342F1F6D549CE8253782c8A2b9218c68fB2',
	31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
};

export const makeId = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};
