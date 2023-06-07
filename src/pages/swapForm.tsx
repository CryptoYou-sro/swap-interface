import axios from 'axios';
import queryString from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork, } from 'wagmi';
import { Fees, Icon, IconType, NetworkTokenModal, SwapButton, TextField } from '../components';
import {
	AmountEnum,
	BINANCE_FEE,
	DestinationEnum,
	NETWORK_TO_ID,
	NETWORK_TO_WC,
	SourceEnum,
	beautifyNumbers,
	isLightTheme,
	isNetworkSelected,
	isTokenSelected,
	useStore
} from '../helpers';
import { useFees, useMedia } from '../hooks';
import { MAIN_MAX_WIDTH, mediaQuery, spacing } from '../styles';

const Wrapper = styled.main`
	margin: 0 auto;
	max-width: ${MAIN_MAX_WIDTH};
`;

// const Settings = styled.div`
// 	display: flex;
// 	justify-content: flex-end;
// 	margin-bottom: ${spacing[16]};

// 	& button {
// 		all: unset;
// 		cursor: pointer;

// 		&:hover {
// 			opacity: 0.8;
// 		}

// 		&:focus-visible {
// 			outline-offset: ${DEFAULT_OUTLINE_OFFSET};
// 			outline: ${(props: ThemeProps) => DEFAULT_OUTLINE(props.theme)};
// 		}

// 		&:active {
// 			outline: none;
// 		}
// 	}
// `;

const Trader = styled.div`
	display: flex;
	gap: ${spacing[10]};
	align-items: stretch;

	${mediaQuery('xs')} {
		flex-direction: column;
		align-items: center;
	}
`;

const Swap = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: ${spacing[4]};

	${mediaQuery('xs')} {
		width: 100%;
	}
`;

const SwapInput = styled.div`
	display: flex;
	gap: ${spacing[8]};
`;

const NamesWrapper = styled.div(
	() => css`
		display: flex;
		flex-direction: column;
		gap: ${spacing[4]};

		& div {
			display: flex;
			gap: ${spacing[4]};
		}
	`
);

const Names = styled.div(
	({ justifyContent }: { justifyContent: 'space-between' | 'flex-end' | 'flex-start' }) => css`
		justify-content: ${justifyContent};

		${mediaQuery('xs')} {
			justify-content: ${justifyContent === 'space-between' ? 'space-between' : 'flex-start'};
		}
	`
);

const Name = styled.div(
	({ color }: { color: string }) => css`
		color: ${color};
	`
);

const MaxButton = styled.button(
	({ color }: { color: string }) => css`
		all: unset;
		cursor: pointer;
		color: ${color};

		&:hover {
			opacity: 0.8;
		}
	`
);

const ExchangeRate = styled.div(
	({ color }: { color: string }) => `
	margin: ${spacing[28]} 0;
	color: ${color};

	${mediaQuery('xs')} {
	text-align: center;
	}
`
);

const WithdrawTips = styled.div(
	({ color }: { color: string }) => `
		margin: ${spacing[28]} 0;
		color: ${color};

		${mediaQuery('xs')} {
			width: 100%;
		}
	`
);

type Limit = { message: string; value: string; error: boolean };

interface DepthResponse {
	bids?: Array<[string, string]>;
	asks?: Array<[string, string]>;
}

type ParsedProps = {
	[key: string]: string;
};

export const SwapForm = () => {
	const {
		state: {
			theme,
			sourceNetwork,
			sourceToken,
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationAmount,
			destinationMemo,
			isUserVerified,
			amount,
			availableDestinationNetworks: DESTINATION_NETWORKS
		},
		dispatch
	} = useStore();

	const { mobileWidth: isMobile } = useMedia('xs');
	const { chain: wagmiChain } = useNetwork();
	const { disconnect } = useDisconnect();
	const { isConnected } = useAccount();
	const { switchNetworkAsync } = useSwitchNetwork();
	const { withdrawFee, cexFee, minAmount, maxAmount } = useFees();
	const [showDestinationModal, setShowDestinationModal] = useState(false);
	// const [showNotificaitonsModal, setShowNotificaitonsModal] = useState(false);
	const [showSourceModal, setShowSourceModal] = useState(false);
	const [hasMemo, setHasMemo] = useState(false);
	const [withdrawTipsText, setWithdrawTipsText] = useState('');
	const [destinationAddressIsValid, setDestinationAddressIsValid] = useState(false);
	const [destinationMemoIsValid, setDestinationMemoIsValid] = useState(false);
	const [limit, setLimit] = useState<Limit>({ message: '', value: '', error: false });
	const [exchangeRate, setExchangeRate] = useState<{ price: number; totalAmount: number } | null>(null);
	const [parsedUrl, setParsedUrl] = useState<ParsedProps>({});

	const swapButtonRef = useRef();
	const location: any = useLocation();
	const isParsedEmpty = Object.keys(parsedUrl).length <= 0;
	const sameUrlAndSiteNetworkId = wagmiChain?.id === parseFloat(NETWORK_TO_ID[parsedUrl?.sellAssetNet as keyof typeof NETWORK_TO_ID]);

	useEffect(() => {
		if (isParsedEmpty && location.search) {
			try {
				const parsed: ParsedProps | any = queryString.parse(location.search);

				if(parsed && Object.keys(parsed).length > 1) {
					// Set parsed data if it has more than one key, else it is promo code
					setParsedUrl(parsed);
				}
			} catch (error) {
				console.log('error in URL parsing', error);
			}
		}
	}, [location.search]);

	useEffect(() => {
		if (!isParsedEmpty && DESTINATION_NETWORKS) {
			if (!isConnected) {
				dispatch({ type: SourceEnum.NETWORK, payload: parsedUrl?.sellAssetNet });
				dispatch({ type: SourceEnum.TOKEN, payload: parsedUrl?.sellAssetToken });
				dispatch({ type: DestinationEnum.NETWORK, payload: parsedUrl?.buyAssetNet });
				dispatch({ type: DestinationEnum.TOKEN, payload: parsedUrl?.buyAssetToken });
				dispatch({ type: AmountEnum.AMOUNT, payload: parsedUrl?.sellAssetAmount });
				window.history.replaceState({}, document.title, '/');
			}

			if (isConnected && sameUrlAndSiteNetworkId) {
				dispatch({ type: SourceEnum.NETWORK, payload: parsedUrl?.sellAssetNet });
				dispatch({ type: SourceEnum.TOKEN, payload: parsedUrl?.sellAssetToken });
				dispatch({ type: DestinationEnum.NETWORK, payload: parsedUrl?.buyAssetNet });
				dispatch({ type: DestinationEnum.TOKEN, payload: parsedUrl?.buyAssetToken });
				dispatch({ type: AmountEnum.AMOUNT, payload: parsedUrl?.sellAssetAmount });
				window.history.replaceState({}, document.title, '/');
			}
		}
	}, [isParsedEmpty, DESTINATION_NETWORKS]);

	useEffect(() => {
		async function switchToNetwork() {
			if (!isParsedEmpty && isConnected && switchNetworkAsync && DESTINATION_NETWORKS && !sameUrlAndSiteNetworkId) {
				try {
					// @ts-ignore
					await switchNetworkAsync(NETWORK_TO_WC[parsedUrl?.sellAssetNet]?.id);
					dispatch({ type: SourceEnum.NETWORK, payload: parsedUrl?.sellAssetNet });
					dispatch({ type: SourceEnum.TOKEN, payload: parsedUrl?.sellAssetToken });
					dispatch({ type: DestinationEnum.NETWORK, payload: parsedUrl?.buyAssetNet });
					dispatch({ type: DestinationEnum.TOKEN, payload: parsedUrl?.buyAssetToken });
					dispatch({ type: AmountEnum.AMOUNT, payload: parsedUrl?.sellAssetAmount });
					window.history.replaceState({}, document.title, '/');

				} catch (error) {
					disconnect();
					dispatch({ type: SourceEnum.NETWORK, payload: parsedUrl?.sellAssetNet });
					dispatch({ type: SourceEnum.TOKEN, payload: parsedUrl?.sellAssetToken });
					dispatch({ type: DestinationEnum.NETWORK, payload: parsedUrl?.buyAssetNet });
					dispatch({ type: DestinationEnum.TOKEN, payload: parsedUrl?.buyAssetToken });
					dispatch({ type: AmountEnum.AMOUNT, payload: parsedUrl?.sellAssetAmount });
					window.history.replaceState({}, document.title, '/');
				}
			}
		}
		void switchToNetwork();
	}, [isParsedEmpty, isConnected, switchNetworkAsync, DESTINATION_NETWORKS]);

	async function getOrderBookPrice(currency1: any, currency2: any, startAmount: any, startCurrency: any) {
		let pair: string | '' = '';
		let res: DepthResponse | any = null;
		let totalPrice: string | number = 0;
		let totalCurrencyAmount: string | number = 0;
		try {
			await axios.get<DepthResponse>(`https://api.binance.com/api/v3/depth?symbol=${currency1}${currency2}&limit=4999`).then(r => res = r.data);
			if (res) {
				pair = `${currency1}${currency2}`;
			}
		} catch (error: any) {
			await axios.get<DepthResponse>(`https://api.binance.com/api/v3/depth?symbol=${currency2}${currency1}&limit=4999`).then(r => res = r.data);
			if (res) {
				pair = `${currency2}${currency1}`;
			}
		}
		if (startAmount > 0) {
			if ((pair === `${currency1}${currency2}` && startCurrency === currency1) || (pair === `${currency2}${currency1}` && startCurrency === currency2)) {
				if (res) {
					// console.log('SELL');
					const bids: string[] = res.bids;
					let leftToSwap: any = startAmount;

					for (let i = 0; i < res.bids.length; i++) {
						let orderBookAmount = 0;
						if (leftToSwap === 0) {
							break;
						}
						const price = parseFloat(bids[i][0]);
						const amount = parseFloat(bids[i][1]);

						if (amount < leftToSwap) {
							orderBookAmount = amount;
						} else {
							orderBookAmount = leftToSwap;
						}

						leftToSwap -= orderBookAmount;
						totalCurrencyAmount += price * orderBookAmount;
						totalPrice = totalCurrencyAmount / startAmount;
					}
				}
			} else if
				((pair === `${currency1}${currency2}` && startCurrency === currency2) || (pair === `${currency2}${currency1}` && startCurrency === currency1)) {
				if (res) {
					// console.log('Buy');
					const asks: string[] = res.asks;
					let leftToSwap: any = startAmount;

					for (let i = 0; i < res.asks.length; i++) {
						let orderBookAmount = 0;
						if (leftToSwap === 0) {
							break;
						}
						const price = parseFloat(asks[i][0]);
						const amount = parseFloat(asks[i][1]);

						if (amount * price < leftToSwap) {
							orderBookAmount = amount * price;
						} else {
							orderBookAmount = leftToSwap;
						}

						leftToSwap -= orderBookAmount;
						totalCurrencyAmount = totalCurrencyAmount + 1 / price * orderBookAmount;
						totalPrice = totalCurrencyAmount / startAmount;
					}
				}
			}
		}

		return { price: totalPrice, totalAmount: totalCurrencyAmount };
	}

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			const message =
				+minAmount >= +maxAmount
					? 'Insufficient funds'
					: +minAmount < +amount
						? 'Max Amount'
						: 'Min Amount';
			const value = +minAmount >= +maxAmount ? '' : +minAmount < +amount ? maxAmount : minAmount;
			setLimit({
				message,
				value,
				error: +amount < +minAmount || +amount > +maxAmount || +minAmount >= +maxAmount
			});
		} else {
			setLimit({ message: '', value: '', error: false });
		}
	}, [destinationToken, amount, minAmount, maxAmount]);

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			const getDestinationAmount = async () => {
				const orderBookPrice = await getOrderBookPrice(
					sourceToken,
					destinationToken,
					amount,
					sourceToken
				);
				setExchangeRate(orderBookPrice);
			};

			void getDestinationAmount();
		}
	}, [withdrawFee, cexFee, amount]);

	useEffect(() => {
		if (exchangeRate?.price) {
			const calcDestinationAmount = +amount * exchangeRate.price * (1 - BINANCE_FEE) - withdrawFee.amount;

			dispatch({
				type: DestinationEnum.AMOUNT,
				payload:
					calcDestinationAmount < 0
						? ''
						: calcDestinationAmount.toString(),
			});
		}
	}, [exchangeRate]);

	useEffect(() => {
		if (DESTINATION_NETWORKS) {
			const hasTag =
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'hasTag'
				];
			setHasMemo(!isNetworkSelected(destinationNetwork) ? false : hasTag);
		}
	}, [DESTINATION_NETWORKS, sourceNetwork, sourceToken, destinationNetwork]);

	useEffect(() => {
		if (DESTINATION_NETWORKS) {
			const specialWithdrawTips =
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.tokens[
					destinationToken
				]?.specialWithdrawTips;
			setWithdrawTipsText(!isNetworkSelected(destinationNetwork) ? '' : specialWithdrawTips);
		}
	}, [DESTINATION_NETWORKS, sourceNetwork, sourceToken, destinationNetwork, destinationToken]);

	useEffect(() => {
		if (DESTINATION_NETWORKS) {
			const addressRegEx = new RegExp(
				// @ts-ignore,
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
				]?.[destinationToken]?.['addressRegex']
			);
			const memoRegEx = new RegExp(
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
				]?.[destinationToken]?.['tagRegex']
			);

			setDestinationAddressIsValid(() => addressRegEx.test(destinationAddress));
			if (destinationMemo.length > 0) {
				setDestinationMemoIsValid(() => memoRegEx.test(destinationMemo));
			} else {
				setDestinationMemoIsValid(true);
			}
		}
	}, [DESTINATION_NETWORKS, destinationAddress, destinationMemo, destinationToken]);

	const handleSwap = (): void => {
		// @ts-ignore
		swapButtonRef.current.onSubmit();
	};

	return (
		<Wrapper>
			<NetworkTokenModal
				showModal={showSourceModal}
				setShowModal={setShowSourceModal}
				type="SOURCE"
			/>
			<NetworkTokenModal
				showModal={showDestinationModal}
				setShowModal={setShowDestinationModal}
				type="DESTINATION"
			/>
			{/* <NotificationsModal
				showModal={showNotificaitonsModal}
				setShowModal={setShowNotificaitonsModal}
			/>
			{/* {!mobileWidth && (
				<Settings theme={theme}>
					<Icon
						size="small"
						icon={isLightTheme(theme) ? 'settingsDark' : 'settingsLight'}
						onClick={() => setShowNotificaitonsModal(!showNotificaitonsModal)}
					/>
				</Settings>
			)} */}
			<Trader>
				<Swap>
					<SwapInput>
						<Icon
							size="large"
							icon={sourceToken.toLowerCase() as IconType}
							onClick={() => setShowSourceModal(!showSourceModal)}
						/>
						<TextField
							type="number"
							placeholder="Amount"
							error={limit.error}
							value={amount}
							onChange={(e) => {
								dispatch({ type: AmountEnum.AMOUNT, payload: e.target.value });
							}}
						/>
					</SwapInput>
					<NamesWrapper>
						{+maxAmount > 0 && (
							<Names justifyContent="space-between">
								<Name color={theme.font.default}>
									Balance: {beautifyNumbers({ n: maxAmount ?? '0.0', digits: 3 })} {sourceToken}
								</Name>
								<MaxButton
									color={theme.button.error}
									onClick={() => dispatch({ type: AmountEnum.AMOUNT, payload: maxAmount })}>
									Max
								</MaxButton>
							</Names>
						)}
						<Names justifyContent="flex-start">
							<Name color={theme.font.default}>{sourceToken}</Name>
							<Name color={theme.font.secondary}>({sourceNetwork})</Name>
						</Names>
					</NamesWrapper>
				</Swap>
				<Icon
					size="small"
					icon={isLightTheme(theme) ? 'swapperLight' : 'swapperDark'}
					style={{ marginBottom: 18, transform: `${isMobile ? 'rotate(90deg)' : 'rotate(0)'}` }}
				/>
				<Swap>
					<SwapInput>
						<Icon
							size="large"
							icon={
								isTokenSelected(destinationToken)
									? (destinationToken.toLowerCase() as IconType)
									: 'questionMark'
							}
							onClick={() => setShowDestinationModal(!showDestinationModal)}
						/>
						<TextField
							autocomplete='off'
							disabled
							type="text"
							value={beautifyNumbers({ n: destinationAmount })}
							error={+destinationAmount < 0}
						/>
					</SwapInput>
					<NamesWrapper>
						<Names justifyContent="flex-end">
							<Name color={theme.font.default}>{destinationToken}</Name>
							<Name color={theme.font.secondary}>({destinationNetwork})</Name>
						</Names>
					</NamesWrapper>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.font.default}>
				{!isTokenSelected(destinationToken)
					? ''
					: exchangeRate?.price ? `1 ${sourceToken} = ${beautifyNumbers({ n: exchangeRate.price })} ${destinationToken}` : null}
			</ExchangeRate>
			<TextField
				autocomplete='off'
				value={destinationAddress}
				error={!destinationAddressIsValid}
				description="Destination Address"
				onChange={(e) =>
					dispatch({
						type: DestinationEnum.ADDRESS,
						payload: e.target.value.trim()
					})
				}
			/>
			{hasMemo && (
				<div style={{ marginTop: 24 }}>
					<TextField
						value={destinationMemo}
						error={!destinationMemoIsValid}
						description="Destination Memo"
						onChange={(e) =>
							dispatch({ type: DestinationEnum.MEMO, payload: e.target.value.trim() })
						}
					/>
				</div>
			)}
			{isUserVerified &&
				isNetworkSelected(destinationNetwork) &&
				isTokenSelected(destinationToken)}
			<Fees />
			<WithdrawTips color={theme.button.warning}>{withdrawTipsText}</WithdrawTips>
			<SwapButton
				ref={swapButtonRef}
				validInputs={destinationMemoIsValid && destinationAddressIsValid && !limit.error}
				amount={amount.toString()}
				onClick={handleSwap}
			/>
		</Wrapper>
	);
};
