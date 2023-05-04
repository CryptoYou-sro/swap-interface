import { Contract } from '@ethersproject/contracts';
import { formatEther, formatUnits } from '@ethersproject/units';
import axios from 'axios';
import { BigNumber, providers, utils } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useFeeData, useNetwork, usePrepareContractWrite, useProvider } from 'wagmi';
import CONTRACT_DATA from '../data/YandaMultitokenProtocolV1.json';
import type { DestinationNetworks, Fee, GraphType, Price } from '../helpers';
import {
	BINANCE_EXCHANGE_INFO,
	BINANCE_FEE,
	BINANCE_PRICE_TICKER,
	CONTRACT_ADDRESSES,
	ESTIMATED_NETWORK_TRANSACTION_GAS,
	Graph,
	MIN_START_AMOUNT,
	NETWORK_TO_ID,
	PROTOCOL_FEE,
	PROTOCOL_FEE_FACTOR,
	SERVICE_ADDRESS,
	isNetworkSelected,
	isTokenSelected,
	makeId,
	useStore
} from '../helpers';

type Ticker = {
	baseAsset: string;
	symbol: string;
	quoteAsset: string;
	filters: any[];
};

export const useFees = () => {
	// TODO: error handling if API calls fail
	const [allPrices, setAllPrices] = useState<Price[]>([]);
	const [allFilteredPrices, setAllFilteredPrices] = useState<Price[]>([]);
	const [allPairs, setAllPairs] = useState<Ticker[]>([]);
	const [cexGraph, setCexGraph] = useState<Graph>();
	const [gasAmount, setGasAmount] = useState<any>(null);

	const [allFilteredPairs, setAllFilteredPairs] = useState<Ticker[]>([]);
	const {
		state: {
			sourceToken,
			sourceNetwork,
			destinationToken,
			destinationNetwork,
			amount,
			isNetworkConnected,
			destinationAddress,
			account,
			availableSourceNetworks: SOURCE_NETWORKS,
			availableDestinationNetworks: DESTINATION_NETWORKS,
		}
	} = useStore();

	// const { library: web3Provider } = useEthers();
	const wagmiProvider = useProvider();
	const { chain: wagmiChain } = useNetwork();
	const feeData = useFeeData({
		watch: true,
	});

	const sourceTokenData = useMemo(
		() =>
			// eslint-disable-next-line
			SOURCE_NETWORKS ?
				// @ts-ignore
				// eslint-disable-next-line
				SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken]
				: {},
		[SOURCE_NETWORKS, sourceToken]
	);
	const gasPrice = feeData.data?.gasPrice;


	const contractAddress: any = CONTRACT_ADDRESSES?.[wagmiChain?.id as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, wagmiProvider);

	if (wagmiProvider && isNetworkConnected && !(wagmiProvider instanceof providers.FallbackProvider || wagmiProvider instanceof providers.StaticJsonRpcProvider)) {
		// @ts-ignore
		contract.connect(wagmiProvider.getSigner());
	}
	const { address }: any = useAccount();
	const balanceWagmiAcc = useBalance({
		address,
		watch: true,
	});
	const balanceWagmiToken = useBalance({
		address,
		token: contractAddress,
		watch: true,
	});
	const walletBalanceBN = balanceWagmiAcc.data?.value;
	const tokenBalance = balanceWagmiToken.data?.formatted;

	const productId = utils.id(makeId(32));
	const namedValues = {
		scoin: sourceToken,
		samt: utils.parseEther('10').toString(),
		fcoin: destinationToken,
		net: destinationNetwork,
		daddr: destinationAddress
	};
	const shortNamedValues = JSON.stringify(namedValues);

	usePrepareContractWrite({
		address: contractAddress,
		abi: CONTRACT_DATA.abi,
		functionName: 'createProcess(address,bytes32,string)',
		args: [SERVICE_ADDRESS, productId, shortNamedValues],
		enabled: Boolean(sourceTokenData?.isNative && isTokenSelected(destinationToken)),
		staleTime: 10_000,
		onSuccess(data) {
			if (sourceTokenData?.isNative) {
				setGasAmount(data.request.gasLimit);
			}
		},
		onError(error) {
			throw new Error('Error', error);

		}
	});

	usePrepareContractWrite({
		address: contractAddress,
		abi: CONTRACT_DATA.abi,
		functionName: 'createProcess(address,address,bytes32,string)',
		args: [sourceTokenData?.contractAddr, SERVICE_ADDRESS, productId, shortNamedValues],
		enabled: Boolean(!sourceTokenData?.isNative && isTokenSelected(destinationToken)),
		staleTime: 10_000,
		onSuccess(data) {
			if (!sourceTokenData?.isNative) {
				console.log('NOTnative', data.request.gasLimit);
				setGasAmount(data.request.gasLimit);
			}
		},
		onError(error) {
			throw new Error('Error', error);

		}
	});

	const getExchangeInfo = async () => {
		try {
			const res = await axios.request({ url: BINANCE_EXCHANGE_INFO });
			setAllPairs(res.data.symbols);
		} catch (e: any) {
			throw new Error(e);
		}
	};

	const getTickerData = async () => {
		try {
			const res = await axios.request({ url: BINANCE_PRICE_TICKER });
			setAllPrices(res.data);
		} catch (e: any) {
			throw new Error(e);
		}
	};

	useEffect(() => {
		void getExchangeInfo();
		void getTickerData();
	}, []);

	const uniqueTokens: string[] = useMemo(
		() =>
			DESTINATION_NETWORKS && isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)
				? // @ts-ignore
				Object.keys(DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]).reduce(
					(tokens: string[], network: string) => {
						const networkTokens = Object.keys(
							// @ts-ignore
							DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]?.[
							network as DestinationNetworks
							]?.['tokens']
						);

						const allTokens = [...tokens, ...networkTokens];

						return [...new Set(allTokens)];
					},
					[sourceToken]
				)
				: [],
		[DESTINATION_NETWORKS, sourceToken]
	);

	const uniquePairs: string[] = useMemo(
		() => {
			if (uniqueTokens) {
				const result = [];
				// let k = 0;

				// for (let i = 0; i < uniqueTokens.length - 1; i++) {
				// 	k++;
				// 	for (let j = k; j < uniqueTokens.length; j++) {
				// 		result.push(uniqueTokens[i] + uniqueTokens[j]);
				// 		result.push(uniqueTokens[j] + uniqueTokens[i]);
				// 	}
				// }

				// TODO: use above logic for "double-swap" P.S. need performance improvement
				for (let i = 0; i < uniqueTokens.length; i++) {
					if (uniqueTokens[i] !== sourceToken) {
						result.push(uniqueTokens[i] + sourceToken);
						result.push(sourceToken + uniqueTokens[i]);
					}
				}

				return result;
			} else {
				return [];
			}
		},
		[uniqueTokens, sourceToken]
	);

	useEffect(() => {
		if (allPairs) {
			const filteredPairs = allPairs
				.filter((pair: any) => uniquePairs.includes(pair.symbol))
				.map((pair: any) => {
					return {
						baseAsset: pair.baseAsset,
						quoteAsset: pair.quoteAsset,
						symbol: pair.symbol,
						filters: pair.filters.filter(
							(filter: any) =>
								filter.filterType === 'LOT_SIZE' || filter.filterType === 'NOTIONAL'
						)
					};
				});
			setAllFilteredPairs(filteredPairs);
		}
	}, [allPairs, uniqueTokens]);

	useEffect(() => {
		if (allPrices) {
			const filteredPrices = allPrices.filter((price: any) => uniquePairs.includes(price.symbol));
			setAllFilteredPrices(filteredPrices);
		}
	}, [allPrices, uniqueTokens]);

	const getPrice = useCallback(
		(base: string, quote: string): number => {
			const ticker = allFilteredPrices.find((x: Price) => x.symbol === base + quote);
			if (ticker) {
				return +ticker.price;
			} else {
				const reverseTicker = allFilteredPrices.find((x: Price) => x.symbol === quote + base);

				if (reverseTicker) {
					return 1 / +reverseTicker.price;
				} else {
					return 0;
				}
			}
		},
		[allFilteredPrices]
	);

	const withdrawFee = useMemo((): Fee => {
		if (isTokenSelected(destinationToken)) {
			const withdrawFee =
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
				]?.[destinationToken]?.['withdrawFee'];

			return { amount: +withdrawFee, currency: destinationToken, name: 'Withdrawal' };
		} else {
			return { amount: 0, currency: destinationToken, name: 'Withdrawal' };
		}
	}, [destinationToken, sourceToken]);

	const protocolFee = useMemo((): Fee => {
		if (amount) {
			return { amount: +amount * PROTOCOL_FEE, currency: sourceToken, name: 'Protocol' };
		} else {
			return { amount: 0, currency: sourceToken, name: 'Protocol' };
		}
	}, [amount]);

	const networkFee = useMemo((): Fee => {
		if (isTokenSelected(destinationToken) && gasAmount && gasPrice) {
			const calculatedProcessFee = BigNumber.from(gasAmount['_hex']).mul(
				gasPrice
			);
			const calculatedTransactionFee = BigNumber.from(ESTIMATED_NETWORK_TRANSACTION_GAS).mul(
				gasPrice
			);
			const calculatedFee = BigNumber.from(calculatedProcessFee).add(
				BigNumber.from(calculatedTransactionFee)
			);

			// @ts-ignore
			// eslint-disable-next-line
			const nativeToken = Object.entries(SOURCE_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.['tokens']).find(item => item[1].isNative);

			return {
				amount: +utils.formatEther(calculatedFee['_hex']),
				currency: nativeToken?.length ? nativeToken[0] : sourceNetwork,
				name: 'Network'
			};
		} else {
			return { amount: 0, currency: '', name: 'Network' };
		}
	}, [gasAmount, sourceNetwork, destinationToken]);

	useEffect(() => {
		const localGraph = new Graph();
		for (let i = 0; i < allFilteredPairs.length; i++) {
			localGraph.addEdge(allFilteredPairs[i].baseAsset, allFilteredPairs[i].quoteAsset);
			if (allFilteredPairs.length === localGraph.edges) {
				setCexGraph(localGraph);
			}
		}
	}, [allFilteredPairs]);

	const cexFee = useMemo((): Fee[] => {
		if (cexGraph && isTokenSelected(destinationToken)) {
			let result = +amount;
			const graphPath: GraphType = cexGraph.bfs(sourceToken, destinationToken);

			if (graphPath) {
				const allCexFees: Fee[] = [];
				for (let i = 0; i < graphPath.distance; i++) {
					let edgePrice = 0;
					let ticker: undefined | Price = allFilteredPrices.find(
						(x: Price) => x.symbol === graphPath.path[i] + graphPath.path[i + 1]
					);
					if (ticker) {
						edgePrice = +ticker?.price;
					} else {
						ticker = allFilteredPrices.find(
							(x: any) => x.symbol === graphPath.path[i + 1] + graphPath.path[i]
						);
						edgePrice = 1 / Number(ticker?.price);
					}
					result *= edgePrice;
					allCexFees.push({
						amount: result * BINANCE_FEE,
						currency: graphPath.path[i + 1],
						name: 'CEX'
					});
				}

				return allCexFees;
			} else {
				return [{ amount: 0, currency: sourceToken, name: 'CEX' }];
			}
		} else {
			return [{ amount: 0, currency: sourceToken, name: 'CEX' }];
		}
	}, [destinationToken, amount]);

	const allFees = useMemo((): Fee => {
		const allFees = [...cexFee, withdrawFee, protocolFee, networkFee].reduce(
			(total: number, fee: Fee) =>
				fee.currency === sourceToken
					? (total += fee.amount)
					: (total += fee.amount * getPrice(fee.currency, sourceToken)),
			0
		);

		return { amount: allFees, currency: sourceToken };
	}, [withdrawFee, networkFee, protocolFee, cexFee]);

	const percentageOfAllFeesToAmount = useMemo(
		() => (amount ? (allFees.amount / +amount) * 100 : ''),
		[allFees.amount, destinationToken, amount]
	);

	const marginalCosts = useMemo(() => {
		let minAmount = '';
		let maxAmount = '';
		if (
			isTokenSelected(destinationToken) &&
			isNetworkSelected(destinationNetwork) &&
			account &&
			allFilteredPairs
		) {
			const destTokenMinWithdrawal =
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
				]?.[destinationToken]?.['withdrawMin'];
			const [pair] = allFilteredPairs.filter(
				(pair: Ticker) =>
					pair.symbol === `${sourceToken}${destinationToken}` ||
					pair.symbol === `${destinationToken}${sourceToken}`
			);
			if (pair) {
				const { filters } = pair;

				const [ lot, notional ] = filters;
				const { minQty, maxQty } = lot;

				let notionalMinAmount = +notional.minNotional;
				const price = getPrice(destinationToken, sourceToken);
				const usdTokens = ['USDT', 'BUSD', 'USDC'];
				let usdPrice = 0;
				for (const token of usdTokens) {
					const price: number = getPrice(sourceToken, token);
					if (price > 0) {
						usdPrice = price;
						break;
					}
				}
				let lotSizeMinAmount = 0;
				// @ts-ignore
				if (NETWORK_TO_ID[sourceNetwork] == '1') {
					// use MIN_START_AMOUNT const for ETH network only
					lotSizeMinAmount = usdPrice ? MIN_START_AMOUNT / usdPrice : 0;
				} else {
					lotSizeMinAmount = +minQty * getPrice(destinationToken, sourceToken);
				}
				if (destinationToken === pair.quoteAsset) {
					notionalMinAmount *= price;
				}
				const tokenMinAmount4Withdrawal = +destTokenMinWithdrawal * price;
				const lotSizeMaxAmount = +maxQty * getPrice(destinationToken, sourceToken);
				const walletMaxAmount = walletBalanceBN && formatEther(walletBalanceBN);
				const tokenMaxAmount =
					tokenBalance && +formatUnits(tokenBalance, sourceTokenData?.decimals);
				minAmount = (
					Math.max(tokenMinAmount4Withdrawal, notionalMinAmount, lotSizeMinAmount) *
					PROTOCOL_FEE_FACTOR
				).toString();

				if (sourceTokenData?.isNative) {
					const mathMax = Math.min(lotSizeMaxAmount, Number(walletMaxAmount)) - networkFee.amount;
					maxAmount = (
						mathMax > 0 ? mathMax : 0
					).toString();
				} else {
					maxAmount = Math.min(lotSizeMaxAmount, Number(tokenMaxAmount)).toString();
				}
			}
		}

		return { minAmount, maxAmount };
	}, [destinationToken, account, networkFee, allFilteredPairs, tokenBalance, walletBalanceBN]);

	return {
		...marginalCosts,
		withdrawFee,
		protocolFee,
		networkFee,
		cexFee,
		allFees,
		getPrice,
		percentageOfAllFeesToAmount
	};
};
