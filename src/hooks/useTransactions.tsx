import { Contract } from '@ethersproject/contracts';
import { BigNumber, utils } from 'ethers';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNetwork, useProvider } from 'wagmi';
import CONTRACT_DATA from '../data/YandaMultitokenProtocolV1.json';
import type { LocalStorageHistory } from '../helpers';
import {
	BINANCE_FEE,
	BLOCK_CHUNK_SIZE,
	BLOCK_CONTRACT_NUMBER,
	CONTRACT_ADDRESSES,
	LOCAL_STORAGE_HISTORY,
	SERVICE_ADDRESS,
	TransactionData,
	routes,
	useStore
} from '../helpers';
import { useAxios } from './useAxios';
import { useLocalStorage } from './useLocalStorage';

export const useTransactions = () => {
	const [loading, setLoading] = useState(true);
	const [contentLoading, setContentLoading] = useState(true);
	const [startFetchDetails, setStartFetchDetails] = useState(false);
	const [data, setData] = useState<TransactionData[]>([]);
	const [events, setEvents] = useState<any[]>([]);
	const [lastBlock, setLastBlock] = useState(null);

	// const { library } = useEthers();
	const wagmiProvider = useProvider();
	const { chain: wagmiChain } = useNetwork();

	const contractAddress = CONTRACT_ADDRESSES?.[wagmiChain?.id as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const {
		state: { account, isUserVerified }
	} = useStore();
	const api = useAxios();
	// eslint-disable-next-line
	const [storage, setStorage] = useLocalStorage<LocalStorageHistory>(LOCAL_STORAGE_HISTORY, {
		[account]: {
			lastBlock: null,
			data: [] as TransactionData[]
		}
	});
	const contract = new Contract(contractAddress, contractInterface, wagmiProvider);

	const getAllTransactions = async () => {
		if (account && lastBlock && isUserVerified) {
			const costRequestFilter = contract.filters.CostRequest(account, SERVICE_ADDRESS);
			let allEvents: any[] = [];

			for (
				let i = storage[account]?.lastBlock ?? BLOCK_CONTRACT_NUMBER;
				i < lastBlock;
				i += BLOCK_CHUNK_SIZE
			) {
				const endBlock = Math.min(lastBlock, i + BLOCK_CHUNK_SIZE - 1);

				try {
					const splitEvents = await contract.queryFilter(costRequestFilter, i, endBlock);
					const dataEvents = splitEvents.filter((event) => event?.args?.data);
					allEvents = [...allEvents, ...dataEvents];
				} catch (e) {
					console.log('error in costRequestFilter', e);
				}
			}
			setEvents(allEvents);

			if (allEvents.length === 0) {
				storage[account] = {
					...storage[account],
					lastBlock: lastBlock ? lastBlock - BLOCK_CHUNK_SIZE : BLOCK_CONTRACT_NUMBER
				};
				setStorage({ ...storage });
			}
			setLoading(false);
		}
	};

	const getTransactionsHeaderData = () => {
		const headerData: TransactionData[] = [];
		events.map((transaction) => {
			const { scoin, fcoin, samt, net } = JSON.parse(transaction?.args?.data);
			const dataset: TransactionData = {
				blockNumber: transaction?.blockNumber,
				header: {
					timestamp: undefined,
					symbol: `${scoin}${fcoin}`,
					scoin,
					fcoin,
					samt,
					net
				},
				content: null,
				withdrawl: null,
				gasFee: ''
			};
			headerData.push(dataset);
		});

		const uniqueData = _.uniqBy([...data, ...headerData], 'blockNumber');
		setData(uniqueData);
		storage[account] = { ...storage[account], data: uniqueData };
		setStorage({ ...storage });
		setStartFetchDetails(true);
	};

	const getTransactionsData = async (transaction: any) => {
		let dataset = {} as TransactionData;
		dataset.blockNumber = transaction?.blockNumber;
		const { scoin, fcoin, samt, net } = JSON.parse(transaction?.args?.data);

		const actionFilter = contract.filters.Action(account, SERVICE_ADDRESS, transaction.args[2]);
		const actionRes = await contract.queryFilter(actionFilter, transaction?.blockNumber);

		if (actionRes.length === 0) {
			dataset = {
				...dataset,
				content: 'none',
				withdrawl: null
			};
		}
		if (actionRes.length === 2) {
			const { q: qty, p: price, ts: timestamp } = JSON.parse(actionRes[0]?.args?.data);
			const { id } = JSON.parse(actionRes[1]?.args?.data);

			try {
				const withdrawLink = await api.get(`${routes.transactionDetails}${id}`);
				const {
					data: { amount, url, withdrawFee }
				} = withdrawLink;

				dataset = { ...dataset, withdrawl: { amount, url, withdrawFee } };
			} catch (e) {
				console.log('error in withdrawLink', e);
			}

			const completeFilter = contract.filters.Complete(
				account,
				SERVICE_ADDRESS,
				transaction.args[2]
			);
			const completeRes = await contract.queryFilter(completeFilter, transaction?.blockNumber);
			const success = JSON.parse(completeRes[0]?.args?.success);

			dataset = {
				...dataset,
				content: {
					qty,
					price,
					timestamp,
					cexFee: (qty * price * BINANCE_FEE).toString(),
					withdrawFee: '',
					success
				}
			};
		}

		try {
			const block = await transaction.getBlock();
			const gasFee = utils.formatEther(
				BigNumber.from(block.baseFeePerGas['_hex']).mul(BigNumber.from(block.gasUsed['_hex']))
			);
			dataset = {
				...dataset,
				header: {
					...dataset.header,
					timestamp: block.timestamp,
					symbol: `${scoin}${fcoin}`,
					scoin,
					fcoin,
					samt,
					net
				},
				gasFee
			};

			return dataset;
		} catch (e) {
			console.log('error', e);
		}
	};

	const resolvePromises = (fn: any, args: any) =>
		new Promise((resolve) => {
			fn(...args)
				.then((res: TransactionData) => resolve(res))
				.catch(() => resolve(resolvePromises(fn, args)));
		});

	useEffect(() => {
		if (storage[account]?.data?.length > 0) {
			setData(storage[account].data);
			setLoading(false);
			setContentLoading(false);
		} else {
			setData([]);
			setLoading(true);
			setContentLoading(true);
		}
	}, [account]);

	useEffect(() => {
		wagmiProvider
			?.getBlockNumber()
			// @ts-ignore
			.then((res: number) => setLastBlock(res))
			.catch((e) => console.log('e in lastBlock', e));
	}, [wagmiProvider]);

	useEffect(() => {
		void getAllTransactions();
	}, [account, isUserVerified, lastBlock]);

	useEffect(() => {
		if (events.length > 0) {
			getTransactionsHeaderData();
		}
	}, [events]);

	useEffect(() => {
		if (events.length > 0) {
			const all = events.map((event) => resolvePromises(getTransactionsData, [event]));
			Promise.all(all)
				// @ts-ignore
				.then((transactions: TransactionData[]) => {
					const dataCopy = [...data];
					transactions.map((transaction: TransactionData) => {
						// TODO: solution if undefined - also for the lastBlock logic
						const findTransactionInData = data.find(
							(item) => item.blockNumber === transaction.blockNumber
						);

						if (findTransactionInData) {
							const transactionIndexInData = dataCopy.indexOf(findTransactionInData);
							dataCopy[transactionIndexInData] = transaction;
						} else {
							dataCopy.push(transaction);
						}
					});
					setData(dataCopy);
					storage[account] = {
						lastBlock: lastBlock ? lastBlock - BLOCK_CHUNK_SIZE : BLOCK_CONTRACT_NUMBER,
						data: dataCopy
					};
					setStorage({ ...storage });
				})
				.catch((e) => console.log('e in PromiseAll', e))
				.finally(() => setContentLoading(false));
		}
	}, [startFetchDetails]);

	return { loading, contentLoading, data };
};
