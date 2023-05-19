import { Web3Button, useWeb3Modal } from '@web3modal/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount, useBalance, useDisconnect, useNetwork, useSignMessage } from 'wagmi';
import { Button, Icon, KycL2Modal, useToasts } from '../../components';
import {
	BASE_URL,
	ButtonEnum,
	DefaultSelectEnum,
	DestinationEnum,
	INITIAL_STORAGE,
	KycL2BusinessEnum,
	KycL2Enum,
	KycL2StatusEnum,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	NETWORK_TO_ID,
	NETWORK_TO_WC,
	ThemeEnum,
	VerificationEnum,
	button,
	getAuthTokensFromNonce,
	hexToRgbA,
	isLightTheme,
	loadBinanceKycScript,
	makeBinanceKycCall,
	routes,
	useStore,
} from '../../helpers';
import { useAxios, useClickOutside, useLocalStorage, useMedia } from '../../hooks';
import {
	ColorType,
	DEFAULT_BORDER_RADIUS,
	Theme,
	theme as defaultTheme,
	mediaQuery,
	pxToRem,
	spacing
} from '../../styles';
import { StatusKycL2Modal } from '../modal/statusKycL2Modal';

type Props = {
	theme: Theme;
};

const StyledHeader = styled.header`
	display: flex;
	align-items: center;
	gap: ${pxToRem(16)};
	height: ${pxToRem(63)};
	margin-bottom: ${pxToRem(67.5)};

	${mediaQuery('s')} {
		height: ${pxToRem(55)};
		gap: ${spacing[16]};
		justify-content: space-between;
		margin-bottom: ${pxToRem(39.5)};
	}
`;

const MenuWrapper = styled.div`
	position: fixed;
	inset: 0;
	background-color: ${(props: Props) => hexToRgbA(props.theme.modal.background, '0.8')};
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 1000;
	justify-content: center;
	overflow: hidden;
`;

const Menu = styled.ul`
	position: absolute;
	top: ${spacing[40]};
	right: ${spacing[4]};
	box-sizing: border-box;
	max-width: calc(100% - ${pxToRem(8)});
	background: ${(props: Props) => props.theme.background.secondary};
	text-align: right;
	padding: ${spacing[24]} ${spacing[18]};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	border: 1px solid ${(props: Props) => props.theme.border.default};

	& > li {
		list-style: none;
	}

	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

const WalletContainer = styled.div`
	display: flex;
	align-items: center;
`;

const WalletBalance = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
	color: ${theme.font.default};
	border: 1px solid ${theme.border.default};
	padding: ${spacing[10]} ${spacing[18]} ${spacing[10]} ${spacing[12]};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	border-top-right-radius: 0px;
	border-bottom-right-radius: 0px;
	margin-right: -5px;
`;

});

export const Header = () => {
	const {
		state: {
			sourceToken,
			buttonStatus,
			isUserVerified,
			accessToken,
			sourceNetwork,
			account: userAccount,
			isNetworkConnected,
			theme,
			kycL2Status,
			availableSourceNetworks: SOURCE_NETWORKS,
		},
		dispatch
	} = useStore();
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, INITIAL_STORAGE);
	const { isConnected, address: accountAddr } = useAccount();
	const { disconnect } = useDisconnect();
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
	const { data: nativeBalance } = useBalance({
		address: accountAddr,
	});
	const { data: tokenBalance } = useBalance({
		address: accountAddr,
		token: sourceTokenData.contractAddr,
		watch: true,
		enabled: sourceTokenData.contractAddr
	});
	const balanceAccount = sourceTokenData?.isNative ? nativeBalance : tokenBalance;
	const { chain: wagmiChain } = useNetwork();
	const { open, setDefaultChain } = useWeb3Modal();
	const [signMessage, setSignMessage] = useState('');
	const { signMessage: requestSignMsg } = useSignMessage({
		message: signMessage,
		onSuccess(data) {
			void axios.request({
				url: `${BASE_URL}${routes.auth}`,
				method: 'POST',
				data: { address: accountAddr, signature: data }
			}).then((r) => {
				if (accountAddr) {
					dispatch({ type: VerificationEnum.ACCESS, payload: r.data.access });
					dispatch({ type: VerificationEnum.REFRESH, payload: r.data.refresh });
					setStorage({ account: accountAddr as string, access: r.data.access, isKyced: r.data.is_kyced, refresh: r.data.refresh });
				}
			});
		},
		onError() {
			disconnect();
			setSignMessage('');
			addToast('You have been disconnected due to unsigning on your computer or mobile device. Verify your signature to sign in', 'warning');
		},
	});

	const { mobileWidth: isMobile } = useMedia('s');

	// @ts-ignore
	const { addToast } = useToasts();
	const api = useAxios();

	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showStatusKycL2Modal, setShowStatusKycL2Modal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [binanceToken, setBinanceToken] = useState('');
	const [binanceScriptLoaded, setBinanceScriptLoaded] = useState(false);
	// const navigate = useNavigate();
	// const { pathname } = useLocation();

	// const noKycStatusMessage = 'kyc verify not exist';

	const isLight = isLightTheme(theme);
	const changeTheme = (): void => {
		dispatch({ type: ThemeEnum.THEME, payload: isLight ? defaultTheme.dark : defaultTheme.light });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(isLight));
	};

	const setTokensInStorageAndContext = async () => {
		if (accountAddr) {
			setIsLoading(true);
			try {
				const msg: any = await getAuthTokensFromNonce(accountAddr);
				setSignMessage(msg);
			} catch (error: any) {
				addToast('You need to sign the “nonce” via Metamask in order to continue with CryptoYou. If you want to login, click on the Login button again.', 'error');
			}
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (signMessage) {
			requestSignMsg();
		}
	}, [signMessage]);

	const getBinanceToken = async () => {
		try {
			setIsLoading(true);
			const res = await api.get(routes.kycToken);

			setBinanceToken(res?.data?.token);
			setIsLoading(false);
		} catch (error: any) {
			await setTokensInStorageAndContext();
		}
	};

	const checkStatus = async () => {
		if (!isUserVerified && accountAddr === userAccount && isNetworkConnected) {
			setIsLoading(true);
			try {
				const res = await api.get(routes.kycStatus);
				const {
					status: kycL2Status,
					statusBusiness: kycL2StatusBusiness,
					representativeType: reprType
				} = res?.data?.L2;
				dispatch({
					type: KycL2Enum.STATUS,
					payload: kycL2Status
				});
				dispatch({
					type: KycL2BusinessEnum.STATUS,
					payload: kycL2StatusBusiness
				});
				if (reprType !== undefined) {
					dispatch({
						type: KycL2BusinessEnum.REPR,
						payload: reprType
					});
				}
				setStorage({
					...storage,
					isKyced: kycL2Status === KycL2StatusEnum.PASSED
				});
				// TODO: move this part to context?
				// if (kyc === KycStatusEnum.REJECT) {
				// 	dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC });
				// 	addToast('Your verification was rejected. Please try again. If you have questions, please send us an email at support@cryptoyou.io.', 'warning');
				// }
				if (kycL2Status === KycL2StatusEnum.REJECTED) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC_L2 });
					addToast('Your verification was rejected. Please try again. If you have questions, please send us an email at support@cryptoyou.io.', 'warning');
				} else if (kycL2Status === KycL2StatusEnum.INITIAL) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC_L2 });
				} else if (kycL2Status === KycL2StatusEnum.PENDING) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.CHECK_KYC_L2 });
					setShowStatusKycL2Modal(true);
				}
			} catch (error: any) {
				if (error?.response?.status === 401) {
					await setTokensInStorageAndContext();
				}
			}
			setIsLoading(false);
		}
	};

	const domNode: any = useClickOutside(() => {
		setShowMenu(false);
	});

	const updateShowKycL2 = (value: boolean) => {
		setShowModal(value);
	};

	const updateStatusKycL2Modal = (value: boolean) => {
		setShowStatusKycL2Modal(value);
	};

	useEffect(() => {
		if (binanceScriptLoaded && binanceToken) {
			makeBinanceKycCall(binanceToken);
		}
	}, [binanceToken, binanceScriptLoaded]);

	useEffect(() => {
		dispatch({ type: DestinationEnum.NETWORK, payload: DefaultSelectEnum.NETWORK });
		dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
	}, [sourceNetwork]);

	useEffect(() => {
		const localStorageTheme = localStorage.getItem(LOCAL_STORAGE_THEME);
		const localStorageAuth = localStorage.getItem(LOCAL_STORAGE_AUTH);

		if (localStorageTheme) {
			dispatch({
				type: ThemeEnum.THEME,
				payload: JSON.parse(localStorageTheme) ? defaultTheme.dark : defaultTheme.light
			});
		}
		if (localStorageAuth) {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: JSON.parse(localStorageAuth).account });
			dispatch({ type: VerificationEnum.ACCESS, payload: JSON.parse(localStorageAuth).access });
			dispatch({ type: VerificationEnum.REFRESH, payload: JSON.parse(localStorageAuth).refresh });
			dispatch({
				type: KycL2Enum.STATUS,
				payload: JSON.parse(localStorageAuth).isKyced
					? KycL2StatusEnum.PASSED
					: KycL2StatusEnum.INITIAL
			});
		}
	}, []);

	useEffect(() => {
		loadBinanceKycScript(() => {
			setBinanceScriptLoaded(true);
		});
	}, []);

	useEffect(() => {
		if (accountAddr) {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: accountAddr });
		} else {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: '' });
		}

		if (accountAddr && storage?.account && storage?.account !== accountAddr) {
			addToast(
				'Switch to your verified account on Metamask to come back to CryptoYou.', 'warning');
			dispatch({ type: VerificationEnum.ACCESS, payload: '' });
			dispatch({ type: VerificationEnum.REFRESH, payload: '' });
			dispatch({
				type: KycL2Enum.STATUS,
				payload: KycL2StatusEnum.INITIAL
			});
			setStorage({ account: accountAddr, access: '', isKyced: false, refresh: '' });
		}
	}, [accountAddr, isUserVerified, isNetworkConnected]);

	useEffect(() => {
		if (!wagmiChain) {
			dispatch({ type: VerificationEnum.NETWORK, payload: false });
		} else {
			dispatch({ type: VerificationEnum.NETWORK, payload: true });
		}
	}, [wagmiChain]);

	const handleButtonClick = async () => {
		if (!isConnected) {
			// @ts-ignore
			setDefaultChain(NETWORK_TO_WC[sourceNetwork]);
			await open();
		}
		if (wagmiChain && wagmiChain.id && accountAddr) {
			if (buttonStatus === button.PASS_KYC || buttonStatus === button.CHECK_KYC) {
				await getBinanceToken();
			} else if (buttonStatus === button.PASS_KYC_L2) {
				// add  request to base to get status of KYC review show modal window
				setShowModal(!showModal);
			} else if (buttonStatus === button.CHECK_KYC_L2) {
				void checkStatus();
			} else if (buttonStatus === button.LOGIN) {
				await setTokensInStorageAndContext();
			}
		}
	};

	useEffect(() => {
		// @ts-ignore
		// const startNetworkId = Number(Object.keys(CHAINS).find((key) => CHAINS[key].name === sourceNetwork));

	}, [wagmiChain]);

	useEffect(() => {
		void checkStatus();
	}, [accountAddr, userAccount, kycL2Status, accessToken]);

	return (
		<StyledHeader theme={theme}>
			<Icon
				icon={isMobile ? 'logoMobile' : isLight ? 'logoLight' : 'logoDark'}
				style={{ marginRight: 'auto' }}
				size={isMobile ? 'medium' : 112}
			/>
			{!isMobile && (
				<a href="https://cryptoyou.io/step-by-step-guide-on-how-to-use-cryptoyou-cross-chain-hybrid-exchange/"
					target="_blank">
					<Button
						variant="pure"
						onClick={() =>
							console.log('Out')
						}>
						Step-by-step Guide
					</Button>
				</a>
			)}
			{isConnected && isUserVerified && accountAddr && isNetworkConnected ? (
				<WalletContainer>
					{!isMobile && (
						<WalletBalance>
							{balanceAccount?.formatted.slice(0, 15)} {balanceAccount?.symbol}
						</WalletBalance>
					)}
					<Web3Button balance={'hide'} icon="show" />
				</WalletContainer>
			) : (
				<Button
					isLoading={isLoading}
					variant="secondary"
					onClick={handleButtonClick}
					color={buttonStatus.color as ColorType}>
					{buttonStatus.text}
				</Button>
			)}
			{!isMobile && <Icon icon={isLight ? 'moon' : 'sun'} onClick={changeTheme} size="small" />}
			{isMobile && (
				<Icon
					icon={isLight ? 'menuLight' : 'menuDark'}
					onClick={() => setShowMenu(!showMenu)}
					size="small"
				/>
			)}
			{showMenu && (
				<MenuWrapper theme={theme}>
					<Menu theme={theme} ref={domNode}>
						<li>
							<a href="https://cryptoyou.io/step-by-step-guide-on-how-to-use-cryptoyou-cross-chain-hybrid-exchange/"
								target="_blank">
								<Button
									variant="pure"
									onClick={() =>
										console.log('Out')
									}>
									Step-by-step Guide
								</Button>
							</a>
						</li>
						<li>
							<Button
								variant="pure"
								onClick={() => {
									changeTheme();
									setShowMenu(!showMenu);
								}}>
								{isLightTheme(theme) ? <>Dark theme</> : <>Light theme</>}
							</Button>
						</li>
					</Menu>
				</MenuWrapper>
			)}
			<KycL2Modal showKycL2={showModal} updateShowKycL2={updateShowKycL2} />
			<StatusKycL2Modal
				showStatusKycL2Modal={showStatusKycL2Modal}
				updateStatusKycL2Modal={updateStatusKycL2Modal}
			/>
		</StyledHeader>
	);
};
