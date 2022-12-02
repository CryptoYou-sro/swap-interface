import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useBlockNumber, useContractFunction, useEthers } from '@usedapp/core';
import styled from 'styled-components';
import DESTINATION_NETWORKS from '../../data/destinationNetworks.json';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import { providers, utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import { ContractAdress } from '../../helpers';
import {
	beautifyNumbers,
	CONTRACT_ADDRESSES,
	isTokenSelected,
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
	const { account } = useEthers();
	const [swapProductId, setSwapProductId] = useLocalStorage<string>('productId', '');
	const [swapsStorage, setSwapsStorage] = useLocalStorage<any>('localSwaps', []);

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
			pair
		},
		dispatch
	} = useStore();
	const { chainId, library: web3Provider } = useEthers();
	const { maxAmount, minAmount } = useFees();
	const currentBlockNumber = useBlockNumber();

	const isDisabled =
		!validInputs ||
		!isTokenSelected(sourceToken) ||
		!isTokenSelected(destinationToken) ||
		!isUserVerified ||
		+destinationAmount < 0;
	const message = !isDisabled
		? 'Swap'
		: !isTokenSelected(destinationToken)
		? 'Please select Network and Token'
		: +amount < +minAmount
		? `Min Amount ${beautifyNumbers({ n: minAmount ?? '0.0', digits: 3 })} ${sourceToken}`
		: +amount > +maxAmount
		? `Max Amount ${beautifyNumbers({ n: maxAmount ?? '0.0', digits: 3 })} ${sourceToken}`
		: // @ts-ignore
		DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'hasTag'
		  ] && !destinationMemo
		? 'Please insert a valid Destination Memo'
		: 'Please insert a valid Destination Address';

	const sourceTokenData =
		// @ts-ignore
		SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken];

	const protocolAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, web3Provider);
	if (web3Provider && !(web3Provider instanceof providers.FallbackProvider)) {
		protocol.connect(web3Provider.getSigner());
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

			const namedValues = {
				scoin: sourceToken,
				samt: utils.parseUnits(amount, sourceTokenData?.decimals).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress,
				tag: destinationMemo
			};
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
			if (swapProductId && account) {
				const swap = {
					swapProductId,
					account,
					costRequestCounter: 0,
					depositBlock: 0,
					action: [],
					withdraw: [],
					complete: null,
					pair,
					sourceToken,
					currentBlockNumber
				};
				setSwapsStorage([...swapsStorage, swap]);
				setSwapProductId('');
			}
		} else if (
			(transactionSwapState.status === 'Exception' &&
				transactionSwapState.errorMessage === 'user rejected transaction') ||
			(transactionContractSwapState.status === 'Exception' &&
				transactionContractSwapState.errorMessage === 'user rejected transaction')
		) {
			setSwapProductId('');

			return;
		} else {
			return;
		}
	}, [transactionContractSwapState, transactionSwapState]);

	return (
		<ButtonWrapper>
			<Button disabled={isDisabled} color="default" onClick={onClick}>
				{message}
			</Button>
		</ButtonWrapper>
	);
});
