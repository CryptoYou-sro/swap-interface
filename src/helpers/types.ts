import { CONTRACT_ADDRESSES } from '../helpers';

export type Networks = any;
export type Sources = any;
export type DestinationNetworks = keyof Networks;
export type ContractAddress = keyof typeof CONTRACT_ADDRESSES;

export type ApiAuthType = { access: string; is_kyced: boolean; refresh: string };

export type Price = { symbol: string; price: string };
export type Fee = { amount: number; currency: string; name?: string };
export type GraphType = false | { distance: number; path: string[] };

export type TransactionData = {
	blockNumber: number;
	header: {
		timestamp: number | undefined;
		symbol: string;
		scoin: string;
		fcoin: string;
		samt: string;
		net: string;
	};
	content:
		| {
				qty: string;
				price: string;
				timestamp: number;
				cexFee: string;
				withdrawFee: string;
				success: boolean;
		  }
		| null
		| 'none';
	gasFee: string;
	withdrawl: {
		amount: string;
		withdrawFee: string;
		url: string;
	} | null;
};

export type LocalStorageHistory = {
	[key in string]: { lastBlock: number | null; data: TransactionData[] };
};

export type TransactionHeaderSortValue =
	| undefined
	| 'fcoin'
	| 'scoin'
	| 'symbol'
	| 'timestamp'
	| 'samt'
	| 'net';

export type SelectProps = {
	name: string;
	value: TransactionHeaderSortValue;
	checked: boolean;
};
