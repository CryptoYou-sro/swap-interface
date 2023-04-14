import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useContractFunction } from '@usedapp/core';
import { useAccount, useNetwork, useProvider } from 'wagmi';
import { useBlockNumber } from 'wagmi';
import styled from 'styled-components';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import { providers, utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import {
	beautifyNumbers,
	CONTRACT_ADDRESSES,
	ContractAdress,
	isSwapRejected,
	isTokenSelected,
	KycL2StatusEnum,
	makeId,
	NETWORK_TO_ID,
	PairEnum,
	SERVICE_ADDRESS,
	useStore
} from '../../helpers';
import { spacing } from '../../styles';
import { useFees, useLocalStorage } from '../../hooks';

const ButtonWrapper = styled.div`
	margin-top: ${spacing[28]};
`;

type Props = {
	validInputs: boolean;
	amount: string;
	onClick: () => void;
};

export const SwapButton = forwardRef(({ validInputs, amount, onClick }: Props, ref) => {
	if (localStorage.getItem('swaps')) {
		localStorage.removeItem('swaps');
	}
	const { address } = useAccount();
	const [isDestinationAddressValid, setIsDestinationAddressValid] = useState<any>(false);
	const [isDestinationMemoValid, setIsDestinationMemoValid] = useState<any>(false);
	const [swapProductId, setSwapProductId] = useLocalStorage<string>('productId', '');
	const [swapsStorage, setSwapsStorage] = useLocalStorage<any>('localSwaps', []);
	const [isDepositConfirmed, setIsDepositConfirmed] = useLocalStorage<any>(
		'isDepositConfirmed',
		true
	);


	const {
		state: {
			sourceNetwork,
			sourceToken,
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationMemo,
			isUserVerified,
			destinationAmount,
			pair,
			kycL2Status,
			buttonStatus,
			availableSourceNetworks: SOURCE_NETWORKS,
			availableDestinationNetworks: DESTINATION_NETWORKS
		},
		dispatch
	} = useStore();
	// const { library: web3Provider } = useEthers();
	const wagmiProvider = useProvider();
	const { chain: wagmiChain } = useNetwork();
	const { maxAmount, minAmount } = useFees();
	const currentBlockNumber = useBlockNumber({
		watch: true,
	});

	const isDisabled =
		!isDepositConfirmed ||
		!validInputs ||
		!isTokenSelected(sourceToken) ||
		!isTokenSelected(destinationToken) ||
		!isUserVerified ||
		+destinationAmount < 0 ||
		kycL2Status !== 2;

	useEffect(() => {
		if (destinationAddress) {
			const addressRegEx = new RegExp(
				// @ts-ignore,
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
				]?.[destinationToken]?.['addressRegex']
			);
			setIsDestinationAddressValid(() => addressRegEx.test(destinationAddress));
		} else {
			setIsDestinationAddressValid(false);
		}
	}, [destinationAddress, destinationAmount]);

	useEffect(() => {
		if (destinationMemo) {
			const memoRegEx = new RegExp(
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
				]?.[destinationToken]?.['tagRegex']
			);
			setIsDestinationMemoValid(() => memoRegEx.test(destinationMemo));
		} else {
			setIsDestinationMemoValid(true);
		}
	}, [destinationMemo, destinationAmount]);

	const message = !isDisabled
		? 'Swap'
		: !isUserVerified && buttonStatus.text === 'Connect Wallet'
			? 'Connect wallet to swap'
			: !isUserVerified && buttonStatus.text === 'Login'
				? 'Log in to swap'
				: !isUserVerified && kycL2Status !== KycL2StatusEnum.PASSED
					? 'Verify account to swap'
					: !isTokenSelected(destinationToken)
						? 'Select Network and Token'
						: +amount < +minAmount
							? `Min Amount ${beautifyNumbers({ n: minAmount ?? '0.0', digits: 3 })} ${sourceToken}`
							: +amount > +maxAmount && +maxAmount > 0
								? `Max Amount ${beautifyNumbers({ n: maxAmount ?? '0.0', digits: 3 })} ${sourceToken}`
								: +maxAmount === 0
									? `Your ${sourceToken} balance is too low`
									: !isDestinationAddressValid
										? 'Please insert a valid Destination Address'
										: !isDestinationMemoValid
											? 'Please insert a valid Destination Memo'
											: 'Wait for deposit';

	const sourceTokenData = SOURCE_NETWORKS ?
		// @ts-ignore
		SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken]
		: {};

	const protocolAddress = CONTRACT_ADDRESSES?.[wagmiChain?.id as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, wagmiProvider);
	if (wagmiProvider && !(wagmiProvider instanceof providers.FallbackProvider || wagmiProvider instanceof providers.StaticJsonRpcProvider)) {
		protocol.connect(wagmiProvider.getSigner());
	}
	const { send: sendCreateProcess, state: transactionSwapState } = useContractFunction(
		// @ts-ignore
		protocol,
		'createProcess(address,bytes32,string)',
		{
			transactionName: 'Request Swap',
			gasLimitBufferPercentage: 25
		}
	);
	const { send: sendTokenCreateProcess, state: transactionContractSwapState } = useContractFunction(
		// @ts-ignore
		protocol,
		'createProcess(address,address,bytes32,string)',
		{
			transactionName: 'Request Swap',
			gasLimitBufferPercentage: 25
		}
	);

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));
			setSwapProductId(productId);

			const namedValues: any = {
				scoin: sourceToken,
				samt: utils.parseUnits(amount, sourceTokenData?.decimals).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress,
			};
			const hasTag =
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'hasTag'
				];
			if (hasTag) {
				namedValues.tag = destinationMemo;
			}
			const shortNamedValues = JSON.stringify(namedValues);
			dispatch({ type: PairEnum.PAIR, payload: `${sourceToken} ${destinationToken}` });
			if (sourceTokenData?.isNative) {
				await sendCreateProcess(SERVICE_ADDRESS, productId, shortNamedValues);
			} else {
				console.log(
					'Calling sendTokenCreateProcess with the contractAddr',
					sourceTokenData?.contractAddr
				);
				await sendTokenCreateProcess(
					sourceTokenData?.contractAddr,
					SERVICE_ADDRESS,
					productId,
					shortNamedValues
				);
			}
		}
	}));

	useEffect(() => {
		if (
			transactionSwapState.status === 'Mining' ||
			transactionContractSwapState.status === 'Mining'
		) {
			if (swapProductId && address) {
				const swap = {
					swapProductId,
					address,
					costRequestCounter: 0,
					depositBlock: 0,
					action: [],
					withdraw: [],
					complete: null,
					pair,
					sourceToken,
					currentBlockNumber: currentBlockNumber.data
				};
				setSwapsStorage([...swapsStorage, swap]);
				setSwapProductId('');
				setIsDepositConfirmed(!isDepositConfirmed);
			}
		} else if (
			isSwapRejected(transactionSwapState.status, transactionSwapState.errorMessage) ||
			isSwapRejected(transactionContractSwapState.status, transactionContractSwapState.errorMessage)
		) {
			setSwapProductId('');

			return;
		} else {
			return;
		}
	}, [transactionContractSwapState, transactionSwapState]);

	return (
		<ButtonWrapper>
			<Button isLoading={!SOURCE_NETWORKS && !DESTINATION_NETWORKS} disabled={isDisabled} color="default"
				onClick={onClick}>
				{message}
			</Button>
		</ButtonWrapper>
	);
});
