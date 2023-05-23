import { prepareWriteContract, writeContract } from '@wagmi/core';
import { BigNumber, utils } from 'ethers';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { UserRejectedRequestError, useAccount, useBlockNumber, useNetwork } from 'wagmi';
import { Button } from '..';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import {
	CONTRACT_ADDRESSES,
	CONTRACT_GAS_LIMIT_BUFFER,
	KycL2StatusEnum,
	NETWORK_TO_ID,
	PairEnum,
	SERVICE_ADDRESS,
	beautifyNumbers,
	isTokenSelected,
	makeId,
	useStore
} from '../../helpers';
import { useFees, useLocalStorage } from '../../hooks';
import { spacing } from '../../styles';

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
	const [isDestinationAddressValid, setIsDestinationAddressValid] = useState<any>(false);
	const [isDestinationMemoValid, setIsDestinationMemoValid] = useState<any>(false);
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
			kycL2Status,
			buttonStatus,
			availableSourceNetworks: SOURCE_NETWORKS,
			availableDestinationNetworks: DESTINATION_NETWORKS,
			theme
		},
		dispatch
	} = useStore();
	const { address: accountAddr } = useAccount();
	const { maxAmount, minAmount } = useFees();
	const currentBlockNumber = useBlockNumber({
		watch: true,
	});
	const { chain: wagmiChain } = useNetwork();

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

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));

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
				console.log(wagmiChain?.id);

				try {
					const config = await prepareWriteContract({
						// @ts-ignore
						address: CONTRACT_ADDRESSES[wagmiChain.id],
						abi: CONTRACT_DATA.abi,
						functionName: 'createProcess(address,bytes32,string)',
						args: [SERVICE_ADDRESS, productId, shortNamedValues],
					});
					const customRequest = config.request;
					customRequest.gasLimit = customRequest.gasLimit.add(customRequest.gasLimit.mul(BigNumber.from((CONTRACT_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));
					const { wait } = await writeContract({
						...config,
						request: customRequest
					});
					const swap = {
						swapProductId: productId,
						account: accountAddr,
						costRequestCounter: 0,
						depositBlock: 0,
						depositHash: '',
						action: [],
						withdraw: [],
						complete: null,
						pair: `${sourceToken} ${destinationToken}`,
						sourceToken,
						currentBlockNumber: currentBlockNumber.data
					};
					setSwapsStorage([...swapsStorage, swap]);
					setIsDepositConfirmed(false);
					await wait();

					return;
				} catch (error) {
					if (error instanceof UserRejectedRequestError) {
						toast.info('Swap was rejected by client', { theme: theme.name });
					} else {
						toast.error('Something went wrong, please try again later.', { theme: theme.name });
					}

					return;
				}
			} else {
				try {
					const config = await prepareWriteContract({
						// @ts-ignore
						address: CONTRACT_ADDRESSES[wagmiChain.id],
						abi: CONTRACT_DATA.abi,
						functionName: 'createProcess(address,address,bytes32,string)',
						args: [sourceTokenData?.contractAddr, SERVICE_ADDRESS, productId, shortNamedValues],
					});
					const customRequest = config.request;
					customRequest.gasLimit = customRequest.gasLimit.add(customRequest.gasLimit.mul(BigNumber.from((CONTRACT_GAS_LIMIT_BUFFER).toString())).div(BigNumber.from('100')));
					const { wait } = await writeContract({
						...config,
						request: customRequest
					});
					const swap = {
						swapProductId: productId,
						account: accountAddr,
						costRequestCounter: 0,
						depositBlock: 0,
						depositHash: '',
						action: [],
						withdraw: [],
						complete: null,
						pair: `${sourceToken} ${destinationToken}`,
						sourceToken,
						currentBlockNumber: currentBlockNumber.data
					};
					setSwapsStorage([...swapsStorage, swap]);
					setIsDepositConfirmed(false);
					await wait();

					return;
				} catch (error) {
					if (error instanceof UserRejectedRequestError) {
						toast.info('Swap was rejected by client', { theme: theme.name });
					} else {
						toast.error('Something went wrong, please try again later.', { theme: theme.name });
					}

					return;
				}
			}
		}
	}));

	return (
		<ButtonWrapper>
			<Button isLoading={!SOURCE_NETWORKS && !DESTINATION_NETWORKS} disabled={isDisabled} color="default"
				onClick={onClick}>
				{message}
			</Button>
		</ButtonWrapper>
	);
});
