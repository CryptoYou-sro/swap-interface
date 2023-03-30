import { ERC20Interface, useContractFunction, useEthers, useSendTransaction } from '@usedapp/core';
import {
	CONTRACT_ADDRESSES,
	ContractAdress,
	isNetworkSelected,
	isSwapConfirmed,
	isSwapFailed,
	isSwapRejected,
	isTokenSelected,
	NETWORK_TO_ID,
	SERVICE_ADDRESS,
	useStore
} from '../../helpers';
import { providers, utils } from 'ethers';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import { Contract } from '@ethersproject/contracts';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../../hooks';
import { TabContentNew } from './tabContentNew';

type Swap = {
	swapProductId: string;
	account: string;
	costRequestCounter: number;
	depositBlock: number;
	action: object[];
	withdraw: object[];
	complete: null | boolean;
	pair: string;
	sourceToken: string;
	currentBlockNumber: number;
};

type Props = {
	swap: Swap;
	isVisible: boolean;
};

export const TabWrapper = ({ swap, isVisible }: Props) => {
	const [isDepositConfirmed, setIsDepositConfirmed] = useLocalStorage<any>(
		'isDepositConfirmed',
		true
	);
	const [swapsStorage, setSwapsStorage] = useLocalStorage<Swap[]>('localSwaps', []);
	const [isDepositing, setIsDepositing] = useState(false);
	const { account } = useEthers();
	const {
		state: { sourceNetwork, sourceToken, availableSourceNetworks: SOURCE_NETWORKS }
	} = useStore();
	const { chainId, library: web3Provider } = useEthers();
	const protocolAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, web3Provider);

	const sourceTokenData = useMemo(
		() =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)
				? // @ts-ignore
				  SOURCE_NETWORKS?.[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken]
				: null,
		[sourceToken, sourceNetwork]
	);

	const tokenContract =
		sourceTokenData?.contractAddr &&
		new Contract(sourceTokenData?.contractAddr, ERC20Interface, web3Provider);
	if (web3Provider && !(web3Provider instanceof providers.FallbackProvider || web3Provider instanceof providers.StaticJsonRpcProvider)) {
		protocol.connect(web3Provider.getSigner());
		if (tokenContract) {
			tokenContract.connect(web3Provider.getSigner());
		}
	}

	const { send: sendTokenApprove, state: swapStateApprove } = useContractFunction(
		tokenContract,
		'approve',
		{
			transactionName: 'Approve token to be used for Swap',
			gasLimitBufferPercentage: 10
		}
	);
	const { sendTransaction, state: swapState } = useSendTransaction({
		transactionName: 'Deposit',
		gasLimitBufferPercentage: 10
	});
	const { send: sendDeposit, state: swapStateContract } = useContractFunction(
		// @ts-ignore
		protocol,
		'deposit',
		{
			transactionName: 'Deposit',
			gasLimitBufferPercentage: 25
		}
	);

	// DELETE SWAP IF DEPOSIT PROCESS WAS REJECTED BY USER
	useEffect(() => {
		if (
			isSwapRejected(swapState.status, swapState.errorMessage) ||
			isSwapRejected(swapStateContract.status, swapStateContract.errorMessage) ||
			isSwapRejected(swapStateApprove.status, swapStateApprove.errorMessage) ||
			isSwapFailed(swapState.status) ||
			isSwapFailed(swapStateContract.status) ||
			isSwapFailed(swapStateApprove.status)
		) {
			const swapsCopy = [...swapsStorage];
			const findSwap: any = swapsStorage.find(
				(item: Swap) => item.swapProductId === swap.swapProductId
			);
			const index: number = swapsCopy.indexOf(findSwap);
			swapsCopy.splice(index, 1);
			setSwapsStorage(swapsCopy);
			setIsDepositConfirmed(!isDepositConfirmed);
		} else if (
			isSwapConfirmed(swapState.status) ||
			isSwapConfirmed(swapStateContract.status) ||
			isSwapConfirmed(swapStateApprove.status)
		) {
			setIsDepositConfirmed(!isDepositConfirmed);
		}
	}, [swapState, swapStateContract, swapStateApprove]);

	// UseEffect with logic for deposit (2 modal in MetaMask)
	useEffect(() => {
		if (swap) {
			if (swap.sourceToken === sourceToken) {
				if (
					(!swap.depositBlock && !swap.costRequestCounter && !isDepositing) ||
					(!swap.depositBlock && swap.costRequestCounter >= 1 && !isDepositing)
				) {
					setIsDepositing(true);
					const filter = protocol.filters.CostResponse(
						swap.account,
						SERVICE_ADDRESS,
						swap.swapProductId
					);
					const costResponseFilter = protocol.filters.CostResponse(
						account,
						SERVICE_ADDRESS,
						swap.swapProductId
					);

					async function fetchEvent() {
						const event: any = await protocol.queryFilter(
							costResponseFilter,
							swap.currentBlockNumber
						);
						if (event.length > 0) {
							if (sourceTokenData?.isNative) {
								console.log('sendTransaction for the Native Coin');
								void sendTransaction({
									to: protocolAddress,
									value: event[0]?.args.cost
								});
							} else {
								console.log('sendTokenApprove for the Token');
								sendTokenApprove(protocolAddress, event[0]?.args.cost)
									.then((result) => {
										console.log(
											'Approved ',
											utils.formatUnits(
												JSON.parse(event[0]?.args.data.cost),
												sourceTokenData?.decimals
											),
											' tokens of "',
											protocolAddress,
											'" contract.',
											result
										);

										void sendDeposit(event[0]?.args.cost);
									})
									.catch((error: any) => {
										console.log('Error in sending approve', error);
									});
							}
						} else {
							protocol.on(filter, (_customer, _service, _productId, cost, event) => {
								console.log(
									'Oracle deposit estimation:',
									event,
									utils.formatUnits(cost, sourceTokenData?.decimals)
								);

								if (sourceTokenData?.isNative) {
									console.log('sendTransaction for the Native Coin');
									void sendTransaction({ to: protocolAddress, value: cost });
								} else {
									console.log('sendTokenApprove for the Token');
									sendTokenApprove(protocolAddress, cost)
										.then((result) => {
											console.log(
												'Approved ',
												utils.formatUnits(cost, sourceTokenData?.decimals),
												' tokens of "',
												protocolAddress,
												'" contract.',
												result
											);

											void sendDeposit(cost);
										})
										.catch((error: any) => {
											console.log('Error in sending approve', error);
										});
								}
							});
						}
					}

					void fetchEvent();
				}
			}
		}
	}, [swap]);

	// Trigger function event listener
	useEffect(() => {
		void eventListener(swap);
	}, [swap]);

	// Function event listener
	const eventListener = async (swap: Swap) => {
		if (swap) {
			if (swap.sourceToken === sourceToken) {
				const swapsCopy = [...swapsStorage];
				const findSwap: any = swapsStorage.find(
					(item: Swap) => item.swapProductId === swap.swapProductId
				);
				const index: number = swapsCopy.indexOf(findSwap);

				if (swap.costRequestCounter < 2) {
					const filter = protocol.filters.CostRequest(account, SERVICE_ADDRESS, swap.swapProductId);
					const events = await protocol.queryFilter(filter, swap.currentBlockNumber);
					if (events.length >= 2) {
						swap.costRequestCounter = events.length;
						swapsCopy[index] = swap;
						setSwapsStorage(swapsCopy);
					} else if (events.length < 2) {
						swap.costRequestCounter = events.length;
						swapsCopy[index] = swap;
						setSwapsStorage(swapsCopy);
						protocol.on(
							protocol.filters.CostRequest(swap.account, SERVICE_ADDRESS, swap.swapProductId),
							(_account, _service, _localProductId, _amount, event) => {
								console.log('---COST REQUEST EVENT---', event);
								swap.costRequestCounter += 1;
								swapsCopy[index] = swap;
								setSwapsStorage(swapsCopy);
							}
						);
					}
				}

				if (!swap.depositBlock) {
					const filter = protocol.filters.Deposit(account, SERVICE_ADDRESS, swap.swapProductId);
					const events: any = await protocol.queryFilter(filter, swap.currentBlockNumber);

					if (events.length > 0) {
						swap.depositBlock = events[0].blockNumber;
						swapsCopy[index] = swap;
						setSwapsStorage(swapsCopy);
					} else {
						protocol.on(
							protocol.filters.Deposit(swap.account, SERVICE_ADDRESS, swap.swapProductId),
							(_customer, _service, _localProductId, _amount, event) => {
								console.log('DEPOSIT EVENT', event);
								swap.depositBlock = event.blockNumber;
								swapsCopy[index] = swap;
								setSwapsStorage(swapsCopy);
							}
						);
					}
				}

				if (!swap.action.length || !swap.withdraw.length) {
					const filter = protocol.filters.Action(account, SERVICE_ADDRESS, swap.swapProductId);
					const events: any = await protocol.queryFilter(filter, swap.currentBlockNumber);
					if (events.length >= 2) {
						events.map((event: any) => {
							const parsedData: any = JSON.parse(event.args.data);
							if (parsedData.t === 0) {
								swap.action = [parsedData];
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							} else if (parsedData.t === 1) {
								swap.withdraw = [parsedData];
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							}
						});
					} else if (events.length < 2) {
						events?.map((event: any) => {
							const parsedData: any = JSON.parse(event.args.data);
							if (parsedData.t === 0) {
								swap.action = [parsedData];
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							} else if (parsedData.t === 1) {
								swap.withdraw = [parsedData];
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							}
						});
						protocol.on(
							protocol.filters.Action(swap.account, SERVICE_ADDRESS, swap.swapProductId),
							(_customer, _service, _localProductId, _data, event) => {
								console.log('---Action EVENT---', event);
								const parsedData = JSON.parse(event.args?.data);

								if (parsedData.t === 0) {
									swap.action = [parsedData];
									swapsCopy[index] = swap;

									setSwapsStorage(swapsCopy);
								} else {
									swap.withdraw = [parsedData];
									swapsCopy[index] = swap;

									setSwapsStorage(swapsCopy);
								}
							}
						);
					}
				}

				if (!swap.complete && swap.complete === null) {
					const filter = protocol.filters.Complete(account, SERVICE_ADDRESS, swap.swapProductId);
					const events: any = await protocol.queryFilter(filter, swap.currentBlockNumber);
					if (events.length > 0) {
						console.log('history complete event', events);
						swap.complete = events[0].args.success;
						swapsCopy[index] = swap;
						setSwapsStorage(swapsCopy);
					} else {
						protocol.on(
							protocol.filters.Complete(swap.account, SERVICE_ADDRESS, swap.swapProductId),
							(_customer, _service, _localProductId, _amount, event) => {
								console.log('---COMPLETE EVENT---', event);
								swap.complete = event.args.success;
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							}
						);
					}
				}
				if (swap.complete || swap.complete !== null) {
					swapsCopy.splice(index, 1);
					setSwapsStorage(swapsCopy);
				}
			}
		}
	};

	return isVisible ? <TabContentNew swap={swap} /> : null;
};
