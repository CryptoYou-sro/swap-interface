import {
	erc20ABI,
	prepareSendTransaction,
	prepareWriteContract,
	sendTransaction,
	waitForTransaction,
	watchContractEvent,
	writeContract
} from '@wagmi/core';
import { BigNumber } from 'ethers';
import {
	useEffect,
	useState
} from 'react';
import {
	UserRejectedRequestError,
	useAccount,
	useContract,
	useNetwork,
	useProvider,
} from 'wagmi';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import {
	CONTRACT_ADDRESSES,
	CONTRACT_GAS_LIMIT_BUFFER,
	INITIAL_STORAGE,
	KycL2Enum,
	KycL2ModalShowEnum,
	KycL2StatusEnum,
	LOCAL_STORAGE_AUTH,
	NETWORK_TO_ID,
	SERVICE_ADDRESS,
	TRANSACTION_GAS_LIMIT_BUFFER,
	isNetworkSelected,
	isTokenSelected,
	routes,
	useStore
} from '../../helpers';
import { useAxios, useLocalStorage } from '../../hooks';
import { TabContent } from './tabContent';

type Swap = {
	swapProductId: string;
	account: string;
	costRequestCounter: number;
	depositBlock: number;
	depositHash: any;
	action: object[];
	withdraw: object[];
	complete: null | boolean;
	pair: string;
	sourceToken: string;
	currentBlockNumber: number;
};

type Props = {
	propSwap: Swap;
	isVisible: boolean;
};

export const TabWrapper = ({ propSwap, isVisible }: Props) => {
	const api = useAxios();
	const { chain: wagmiChain } = useNetwork();
	const [isDepositConfirmed, setIsDepositConfirmed] = useLocalStorage<any>(
		'isDepositConfirmed',
		true
	);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_swapsStorage, setSwapsStorage, readLocalData] = useLocalStorage<Swap[]>('localSwaps', []);
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, INITIAL_STORAGE);
	const [isDepositing, setIsDepositing] = useState(false);
	const [sourceTokenData, setSourceTokenData] = useState<any>(null);
	const { address: accountAddr } = useAccount();
	const {
		state: { sourceNetwork, sourceToken, availableSourceNetworks: SOURCE_NETWORKS }, dispatch
	} = useStore();
	const provider = useProvider();
	const protocol = useContract({
		// @ts-ignore
		address: CONTRACT_ADDRESSES[wagmiChain?.id],
		abi: CONTRACT_DATA.abi,
		signerOrProvider: provider
	});
	const checkHashAndBlock = async (swap: Swap) => {
		if (swap.depositHash && !swap.depositBlock) {
			console.log('start checkHashAndBlock', swap.swapProductId.slice(-5));
			setIsDepositConfirmed(false);
			await waitForTransaction({
				hash: swap.depositHash,
			});
			setIsDepositConfirmed(true);
			console.log('finish checkHashAndBlock', swap.swapProductId.slice(-5));
			console.log('IsDepositConfirmed STATUS:', isDepositConfirmed);
		}
		console.log('finish checkHashAndBlock');

	};
	useEffect(() => {
		const data = isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)
			// @ts-ignore
			? SOURCE_NETWORKS?.[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken]
			: null;
		setSourceTokenData(data);
	}, [sourceToken, sourceNetwork, SOURCE_NETWORKS]);


	// Logic for costResponse and deposit (SECOND (2) modal in MetaMask
	useEffect(() => {
		if (propSwap && propSwap.sourceToken === sourceToken && sourceTokenData) {
			void checkHashAndBlock(propSwap);

			if (!propSwap.depositBlock && !isDepositing && !propSwap.depositHash) {
				setIsDepositing(true);
				const costResponseFilter = protocol?.filters.CostResponse(
					accountAddr,
					SERVICE_ADDRESS,
					propSwap.swapProductId
				);

				async function fetchEvent() {

					if (costResponseFilter && sourceTokenData) {
						const event: any = await protocol?.queryFilter(
							costResponseFilter,
							propSwap.currentBlockNumber,
							propSwap.currentBlockNumber + 1000
						);

						console.log('CostResponse event', event);

						if (event.length > 0) {
							if (sourceTokenData?.isNative) {
								try {
									const config = await prepareSendTransaction({
										request: {
											// @ts-ignore
											to: CONTRACT_ADDRESSES[wagmiChain.id],
											value: event[0]?.args.cost
										}
									});
									const customRequest = config.request;
									customRequest.gasLimit = BigNumber.from(customRequest.gasLimit);
									customRequest.gasLimit = customRequest.gasLimit.add(customRequest.gasLimit.mul(BigNumber.from((TRANSACTION_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));
									const { hash, wait } = await sendTransaction({
										...config,
										request: customRequest
									});
									const swapsCopy = readLocalData();
									const findSwap: any = swapsCopy.find(
										(item: Swap) => item.swapProductId === propSwap.swapProductId
									);
									const index: number = swapsCopy.indexOf(findSwap);
									propSwap.depositHash = hash;
									swapsCopy[index].depositHash = hash;
									setSwapsStorage(swapsCopy);
									await wait();
									setIsDepositConfirmed(true);
								} catch (error) {
									if (error instanceof UserRejectedRequestError) {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										swapsCopy.splice(index, 1);
										setSwapsStorage(swapsCopy);
										setIsDepositConfirmed(true);
									}
								}
							} else {
								try {
									const configApprove = await prepareWriteContract({
										address: sourceTokenData?.contractAddr,
										abi: erc20ABI,
										functionName: 'approve',
										// @ts-ignore
										args: [CONTRACT_ADDRESSES[wagmiChain.id], event[0]?.args.cost]
									});
									const customRequestApprove = configApprove.request;
									customRequestApprove.gasLimit = customRequestApprove.gasLimit.add(customRequestApprove.gasLimit.mul(BigNumber.from((TRANSACTION_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));

									const { wait } = await writeContract({
										...configApprove,
										request: customRequestApprove
									});
									await wait();
									setIsDepositConfirmed(true);
								} catch (error) {
									if (error instanceof UserRejectedRequestError) {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										swapsCopy.splice(index, 1);
										setSwapsStorage(swapsCopy);
										setIsDepositConfirmed(true);
									}
								}
								try {
									const configDeposit = await prepareWriteContract({
										// @ts-ignore
										address: CONTRACT_ADDRESSES[wagmiChain.id],
										abi: CONTRACT_DATA.abi,
										functionName: 'deposit',
										args: [event[0]?.args.cost]
									});
									const customRequestDeposit = configDeposit.request;
									customRequestDeposit.gasLimit = customRequestDeposit.gasLimit.add(customRequestDeposit.gasLimit.mul(BigNumber.from((CONTRACT_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));
									const { hash, wait } = await writeContract({
										...configDeposit,
										request: customRequestDeposit
									});
									const swapsCopy = readLocalData();
									const findSwap: any = swapsCopy.find(
										(item: Swap) => item.swapProductId === propSwap.swapProductId
									);
									const index: number = swapsCopy.indexOf(findSwap);
									propSwap.depositHash = hash;
									swapsCopy[index].depositHash = hash;
									setSwapsStorage(swapsCopy);

									await wait();
									setIsDepositConfirmed(true);
								} catch (error) {
									if (error instanceof UserRejectedRequestError) {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										swapsCopy.splice(index, 1);
										setSwapsStorage(swapsCopy);

										setIsDepositConfirmed(true);
									}
								}
							}
						} else if (event.length === 0) {
							watchContractEvent(
								{
									// @ts-ignore
									address: CONTRACT_ADDRESSES[wagmiChain.id],
									abi: CONTRACT_DATA.abi,
									eventName: 'CostResponse',
									once: true
								},
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								async (_customer, _service, _productId, cost, _event) => {
									if (sourceTokenData?.isNative) {
										try {
											const config = await prepareSendTransaction({
												request: {
													// @ts-ignore
													to: CONTRACT_ADDRESSES[wagmiChain.id],
													value: BigNumber.from(cost)
												}
											});
											const customRequest = config.request;
											customRequest.gasLimit = BigNumber.from(customRequest.gasLimit);
											customRequest.gasLimit = customRequest.gasLimit.add(customRequest.gasLimit.mul(BigNumber.from((TRANSACTION_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));

											const { hash, wait } = await sendTransaction({
												...config,
												request: customRequest
											});
											const swapsCopy = readLocalData();
											const findSwap: any = swapsCopy.find(
												(item: Swap) => item.swapProductId === propSwap.swapProductId
											);
											const index: number = swapsCopy.indexOf(findSwap);
											propSwap.depositHash = hash;
											swapsCopy[index].depositHash = hash;
											setSwapsStorage(swapsCopy);
											await wait();
											setIsDepositConfirmed(true);
										} catch (error) {
											if (error instanceof UserRejectedRequestError) {
												const swapsCopy = readLocalData();
												const findSwap: any = swapsCopy.find(
													(item: Swap) => item.swapProductId === propSwap.swapProductId
												);
												const index: number = swapsCopy.indexOf(findSwap);
												swapsCopy.splice(index, 1);
												setSwapsStorage(swapsCopy);
												setIsDepositConfirmed(true);
											}
										}
									} else {
										try {
											const configApprove = await prepareWriteContract({
												address: sourceTokenData?.contractAddr,
												abi: erc20ABI,
												functionName: 'approve',
												// @ts-ignore
												args: [CONTRACT_ADDRESSES[wagmiChain.id], BigNumber.from(cost)]
											});
											const customRequestApprove = configApprove.request;
											customRequestApprove.gasLimit = customRequestApprove.gasLimit.add(customRequestApprove.gasLimit.mul(BigNumber.from((TRANSACTION_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));

											const { wait } = await writeContract({
												...configApprove,
												request: customRequestApprove
											});
											await wait();
											setIsDepositConfirmed(true);
										} catch (error) {
											if (error instanceof UserRejectedRequestError) {
												const swapsCopy = readLocalData();
												const findSwap: any = swapsCopy.find(
													(item: Swap) => item.swapProductId === propSwap.swapProductId
												);
												const index: number = swapsCopy.indexOf(findSwap);
												swapsCopy.splice(index, 1);
												setSwapsStorage(swapsCopy);
												setIsDepositConfirmed(true);
											}
										}

										try {
											const configDeposit = await prepareWriteContract({
												// @ts-ignore
												address: CONTRACT_ADDRESSES[wagmiChain.id],
												abi: CONTRACT_DATA.abi,
												functionName: 'deposit',
												args: [cost]
											});
											const customRequestDeposit = configDeposit.request;
											customRequestDeposit.gasLimit = customRequestDeposit.gasLimit.add(customRequestDeposit.gasLimit.mul(BigNumber.from((CONTRACT_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));

											const { hash, wait } = await writeContract({
												...configDeposit,
												request: customRequestDeposit
											});
											const swapsCopy = readLocalData();
											const findSwap: any = swapsCopy.find(
												(item: Swap) => item.swapProductId === propSwap.swapProductId
											);
											const index: number = swapsCopy.indexOf(findSwap);
											propSwap.depositHash = hash;
											swapsCopy[index].depositHash = hash;
											setSwapsStorage(swapsCopy);
											await wait();
											setIsDepositConfirmed(true);
										} catch (error) {
											if (error instanceof UserRejectedRequestError) {
												const swapsCopy = readLocalData();
												const findSwap: any = swapsCopy.find(
													(item: Swap) => item.swapProductId === propSwap.swapProductId
												);
												const index: number = swapsCopy.indexOf(findSwap);
												swapsCopy.splice(index, 1);
												setSwapsStorage(swapsCopy);
												setIsDepositConfirmed(true);
											}
										}
									}
								},
							);
						}
					}
				}
				void fetchEvent();
			}
		}
	}, [propSwap, sourceTokenData]);

	const getKycL2Status = async () => {
		const res = await api.get(routes.kycStatus);
		const { status: kycL2Status } = res?.data?.L2;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return kycL2Status;
	};
	// Function event listener
	const eventListener = async (propSwap: Swap) => {
		if (propSwap && propSwap.sourceToken === sourceToken) {
			if (propSwap.costRequestCounter < 2) {
				// Create Cost Request filter
				const costRequestFilter = protocol?.filters.CostRequest(
					accountAddr,
					SERVICE_ADDRESS,
					propSwap.swapProductId
				);
				// Try to find cost request events in blockchain
				if (costRequestFilter) {
					console.log('before queryFilter');
					const events: any = await protocol?.queryFilter(
						costRequestFilter,
						propSwap.currentBlockNumber,
						propSwap.currentBlockNumber + 1000
					);

					console.log('CostRequest events', events);

					if (events?.length >= 2) {
						const swapsCopy = readLocalData();
						const findSwap: any = swapsCopy.find(
							(item: Swap) => item.swapProductId === propSwap.swapProductId
						);
						const index: number = swapsCopy.indexOf(findSwap);
						propSwap.costRequestCounter = events.length;
						swapsCopy[index].costRequestCounter = events.length;
						setSwapsStorage(swapsCopy);
					} else if (events?.length < 2) {
						const swapsCopy = readLocalData();
						const findSwap: any = swapsCopy.find(
							(item: Swap) => item.swapProductId === propSwap.swapProductId
						);
						const index: number = swapsCopy.indexOf(findSwap);
						propSwap.costRequestCounter = events.length;
						swapsCopy[index].costRequestCounter = events.length;
						setSwapsStorage(swapsCopy);

						// Start listening for Cost Request Event
						const unwatch = watchContractEvent(
							{
								// @ts-ignore
								address: CONTRACT_ADDRESSES[wagmiChain.id],
								abi: CONTRACT_DATA.abi,
								eventName: 'CostRequest',
							},
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							(_account, _service, localProductId, _amount, _events) => {
								// Filter event by swapProductId && localProductId
								if (propSwap.swapProductId === localProductId) {

									if (propSwap.costRequestCounter < 2) {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										propSwap.costRequestCounter += 1;
										swapsCopy[index].costRequestCounter += 1;
										setSwapsStorage(swapsCopy);

									}
									if (propSwap.costRequestCounter >= 2) {
										unwatch();

									}
								}
							}
						);
					}
				}
			}

			if (propSwap.depositBlock === 0) {
				// Create Deposit filter
				const depositFilter = protocol?.filters.Deposit(
					accountAddr,
					SERVICE_ADDRESS,
					propSwap.swapProductId
				);

				if (depositFilter) {
					// Try to find cost request events in blockchain
					const event: any = await protocol?.queryFilter(
						depositFilter,
						propSwap.currentBlockNumber,
						propSwap.currentBlockNumber + 1000
					);

					if (event.length > 0) {
						const swapsCopy = readLocalData();
						const findSwap: any = swapsCopy.find(
							(item: Swap) => item.swapProductId === propSwap.swapProductId
						);
						const index: number = swapsCopy.indexOf(findSwap);
						propSwap.depositBlock = event[0].blockNumber;
						swapsCopy[index].depositBlock = event[0].blockNumber;
						setSwapsStorage(swapsCopy);
					} else {
						// Start listening for Deposit Event
						const unwatch = watchContractEvent({
							// @ts-ignore
							address: CONTRACT_ADDRESSES[wagmiChain.id],
							abi: CONTRACT_DATA.abi,
							eventName: 'Deposit'
						},
							(_customer, _service, localProductId, _amount, event) => {
								if (propSwap.swapProductId === localProductId) {
									const swapsCopy = readLocalData();
									const findSwap: any = swapsCopy.find(
										(item: Swap) => item.swapProductId === propSwap.swapProductId
									);
									const index: number = swapsCopy.indexOf(findSwap);
									// @ts-ignore
									propSwap.depositBlock = event.blockNumber;
									// @ts-ignore
									swapsCopy[index].depositBlock = event.blockNumber;
									setSwapsStorage(swapsCopy);
									unwatch();
									void eventListener(propSwap);
								}
							}
						);
					}
				}
			}
			if (propSwap.depositBlock !== 0) {
				if (propSwap.action.length === 0 || propSwap.withdraw.length === 0) {
					// Create Action filter
					const actionFilter = protocol?.filters.Action(
						accountAddr,
						SERVICE_ADDRESS,
						propSwap.swapProductId
					);

					if (actionFilter) {
						const events: any = await protocol?.queryFilter(
							actionFilter,
							propSwap.currentBlockNumber,
							propSwap.currentBlockNumber + 1000
						);

						if (events.length >= 2) {
							events.map((event: any) => {
								const parsedData: any = JSON.parse(event.args.data);

								if (parsedData.t === 0) {
									const checkKycStatusAndSetData = async () => {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										propSwap.action = [parsedData];
										swapsCopy[index].action = [parsedData];

										setSwapsStorage(swapsCopy);

										const status = await getKycL2Status();
										dispatch({
											type: KycL2Enum.STATUS,
											payload: status
										});
										setStorage({
											...storage,
											isKyced: status === KycL2StatusEnum.PASSED || status === KycL2StatusEnum.INITIAL
										});
										dispatch({ type: KycL2ModalShowEnum.isKycL2ModalShow, payload: true });
									};
									void checkKycStatusAndSetData();

								} else if (parsedData.t === 1) {
									const swapsCopy = readLocalData();
									const findSwap: any = swapsCopy.find(
										(item: Swap) => item.swapProductId === propSwap.swapProductId
									);
									const index: number = swapsCopy.indexOf(findSwap);
									propSwap.withdraw = [parsedData];
									swapsCopy[index].withdraw = [parsedData];

									setSwapsStorage(swapsCopy);
								}
							});
						} else if (events.length < 2) {
							events?.map((event: any) => {

								const parsedData: any = JSON.parse(event.args.data);
								if (parsedData.t === 0) {
									const checkKycStatusAndSetData = async () => {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										propSwap.action = [parsedData];
										swapsCopy[index].action = [parsedData];

										setSwapsStorage(swapsCopy);

										const status = await getKycL2Status();
										dispatch({
											type: KycL2Enum.STATUS,
											payload: status
										});
										setStorage({
											...storage,
											isKyced: status === KycL2StatusEnum.PASSED || status === KycL2StatusEnum.INITIAL
										});
										dispatch({ type: KycL2ModalShowEnum.isKycL2ModalShow, payload: true });
									};
									void checkKycStatusAndSetData();
								} else if (parsedData.t === 1) {
									const swapsCopy = readLocalData();
									const findSwap: any = swapsCopy.find(
										(item: Swap) => item.swapProductId === propSwap.swapProductId
									);
									const index: number = swapsCopy.indexOf(findSwap);
									propSwap.withdraw = [parsedData];
									swapsCopy[index].withdraw = [parsedData];

									setSwapsStorage(swapsCopy);
								}
							});
							// Start listening for Action Event
							const unwatch = watchContractEvent({
								// @ts-ignore
								address: CONTRACT_ADDRESSES[wagmiChain.id],
								abi: CONTRACT_DATA.abi,
								eventName: 'Action'
							},
								(_customer, _service, localProductId, _data, event) => {
									if (propSwap.swapProductId === localProductId) {
										// @ts-ignore
										const parsedData = JSON.parse(event.args?.data);

										if (parsedData.t === 0) {
											const checkKycStatusAndSetData = async () => {
												const swapsCopy = readLocalData();
												const findSwap: any = swapsCopy.find(
													(item: Swap) => item.swapProductId === propSwap.swapProductId
												);
												const index: number = swapsCopy.indexOf(findSwap);
												propSwap.action = [parsedData];
												swapsCopy[index].action = [parsedData];

												setSwapsStorage(swapsCopy);

												const status = await getKycL2Status();
												dispatch({
													type: KycL2Enum.STATUS,
													payload: status
												});
												setStorage({
													...storage,
													isKyced: status === KycL2StatusEnum.PASSED || status === KycL2StatusEnum.INITIAL
												});
												dispatch({ type: KycL2ModalShowEnum.isKycL2ModalShow, payload: true });
											};
											void checkKycStatusAndSetData();
										} else if (parsedData.t === 1) {
											const swapsCopy = readLocalData();
											const findSwap: any = swapsCopy.find(
												(item: Swap) => item.swapProductId === propSwap.swapProductId
											);
											const index: number = swapsCopy.indexOf(findSwap);
											propSwap.withdraw = [parsedData];
											swapsCopy[index].withdraw = [parsedData];

											setSwapsStorage(swapsCopy);
											// Unsubscribing after got all needed events
											unwatch();
										}

									}
								}
							);
						}
					}


				}
				if (!propSwap.complete && propSwap.complete === null) {
					// Create Complete filter
					const completeFilter = protocol?.filters.Complete(
						accountAddr,
						SERVICE_ADDRESS,
						propSwap.swapProductId
					);

					if (completeFilter) {
						// Try to find cost request events in blockchain
						const events: any = await protocol?.queryFilter(
							completeFilter,
							propSwap.currentBlockNumber,
							propSwap.currentBlockNumber + 1000
						);

						if (events.length > 0) {
							const swapsCopy = readLocalData();
							const findSwap: any = swapsCopy.find(
								(item: Swap) => item.swapProductId === propSwap.swapProductId
							);
							const index: number = swapsCopy.indexOf(findSwap);
							propSwap.complete = events[0].args.success;
							swapsCopy[index].complete = events[0].args.success;

							setSwapsStorage(swapsCopy);
						} else {
							// Start listening for Complete Event
							const unwatch = watchContractEvent({
								// @ts-ignore
								address: CONTRACT_ADDRESSES[wagmiChain.id],
								abi: CONTRACT_DATA.abi,
								eventName: 'Complete'
							},
								(_customer, _service, localProductId, _amount, event) => {

									if (propSwap.swapProductId === localProductId) {
										const swapsCopy = readLocalData();
										const findSwap: any = swapsCopy.find(
											(item: Swap) => item.swapProductId === propSwap.swapProductId
										);
										const index: number = swapsCopy.indexOf(findSwap);
										// @ts-ignore
										propSwap.complete = event.args.success;
										// @ts-ignore
										swapsCopy[index].complete = event.args.success;

										setSwapsStorage(swapsCopy);

										unwatch();
									}
								});
						}
					}
				}
				if (propSwap.complete || propSwap.complete !== null) {
					const swapsCopy = readLocalData();
					const findSwap: any = swapsCopy.find(
						(item: Swap) => item.swapProductId === propSwap.swapProductId
					);
					const index: number = swapsCopy.indexOf(findSwap);
					swapsCopy.splice(index, 1);
					setSwapsStorage(swapsCopy);
				}
			}
		}
	};

	// Trigger function event listener
	useEffect(() => {
		void eventListener(propSwap);
	}, [propSwap, sourceToken]);

	return isVisible ? <TabContent swap={propSwap} /> : null;
};
