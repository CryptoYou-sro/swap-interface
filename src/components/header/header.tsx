import { Web3Button, useWeb3Modal } from '@web3modal/react';
import axios from 'axios';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import { useAccount, useBalance, useDisconnect, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';
import { Button, Icon, IconType, JazzIcon, KycL2Modal } from '../../components';
import {
	AmountEnum,
	BASE_URL,
	ButtonEnum,
	CHAINS,
	DefaultSelectEnum,
	DestinationEnum,
	INITIAL_STORAGE,
	KycL2BusinessEnum,
	KycL2Enum,
	KycL2ModalShowEnum,
	KycL2StatusEnum,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	NETWORK_TO_ID,
	NETWORK_TO_WC,
	SourceEnum,
	ThemeEnum,
	VerificationEnum,
	button,
	findNativeToken,
	getAuthTokensFromNonce,
	hexToRgbA,
	isLightTheme,
	isNetworkSelected,
	loadBinanceKycScript,
	makeBinanceKycCall,
	routes,
	useStore,
} from '../../helpers';
import { useAxios, useClickOutside, useLocalStorage, useMedia } from '../../hooks';
import {
	ColorType,
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSITION,
	Theme,
	theme as defaultTheme,
	fontSize,
	mediaQuery,
	pxToRem,
	spacing
} from '../../styles';
import { AddSubAccountModal } from '../modal/addSubAccountModal';
import { StatusKycL2Modal } from '../modal/statusKycL2Modal';
import { SubAccountModal } from '../modal/subAccountModal';

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
		gap: ${spacing[12]};
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

const NetworkWrapper = styled.button`
	all: unset;
	display: flex;
	gap: ${spacing[8]};
	align-items: center;
	cursor: pointer;
`;

const AdditionalAccWrapper = styled.button`
	all: unset;
	display: flex;
	gap: ${spacing[8]};
	align-items: center;
	cursor: pointer;
`;

const Networks = styled(Menu)`
	width: calc(100% - ${pxToRem(8)});
	& li {
		display: flex;
		align-items: center;
		gap: ${spacing[10]};
		cursor: pointer;
		border-radius: ${DEFAULT_BORDER_RADIUS};
		transition: 0.3s;
		&:hover {
			transform: scale(1.05);
		}
	}
`;

const Accounts = styled(Menu)`
	width: calc(100% - ${pxToRem(8)});
	& li {
		display: flex;
		align-items: center;
		gap: ${spacing[10]};
		cursor: pointer;
		border-radius: ${DEFAULT_BORDER_RADIUS};
		transition: 0.3s;
		&:hover {
			transform: scale(1.05);
		}
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

const AddAccountBtn = styled.button(() => {
	const { state: { theme } } = useStore();
	const { mobileWidth: isMobile } = useMedia('xs');

	return css`
	padding: ${isMobile ? `${spacing[4]} ${spacing[6]}` : `${spacing[8]} ${spacing[10]}`};
	background: transparent;
	color: ${theme.button.default};
	border: 1px solid ${theme.button.default};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	cursor: pointer;
	transition: transform 0.7 ease;

	&:hover {
		opacity: 0.8;
	}

	&:active {
		color: white;
		border: 1px solid white;
  }
	`;

});

const IconContainer = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
	cursor: pointer;
	margin-left: ${spacing[10]};
	fill: ${theme.font.default};

	&:hover {
		fill: red;
	}

	&:focus {
		outline: 6px solid red;
	}
	`;
});

const AccountContainer = styled.div(() => {
	return css`
	display: flex;
	justify-content: space-between;
	
	&:not(:last-child) {
		margin-bottom: ${spacing[12]};
	}
	`;
});

const AccountItem = styled.li(() => {
	return css`
		font-size: ${fontSize[16]};
	`;
});

type ParsedProps = {
	[key: string]: string;
};

type AdditionalAccount = {
	id: number;
	address: string;
	nonce: string;
	is_confirmed: boolean;
};

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
		token: sourceTokenData?.contractAddr,
		watch: true,
		enabled: sourceTokenData && sourceTokenData.contractAddr
	});
	const location = useLocation();
	const balanceAccount = sourceTokenData?.isNative ? nativeBalance : tokenBalance;
	const { chain: wagmiChain } = useNetwork();
	const { open, setDefaultChain } = useWeb3Modal();
	const [signMessage, setSignMessage] = useState('');

	const { mobileWidth: isMobile } = useMedia('s');
	const { mobileWidth: isDeskTop } = useMedia('m');
	const api = useAxios();

	const [showMenu, setShowMenu] = useState(false);
	const [showNetworksList, setShowNetworksList] = useState(false);
	const [showStatusKycL2Modal, setShowStatusKycL2Modal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [additionalAccounts, setAdditionalAccounts] = useState<AdditionalAccount[] | []>([]);
	const [showAdditionalAccounts, setShowAdditionalAccounts] = useState<boolean>(false);
	const [showSubAccountModal, setShowSubAccountModal] = useState<boolean>(false);
	const [showAddSubAccountModal, setShowAddSubAccountModal] = useState<boolean>(false);
	const [selectedAccount, setSelectedAccount] = useState<AdditionalAccount | null>(null);

	const [binanceToken, setBinanceToken] = useState('');
	const [binanceScriptLoaded, setBinanceScriptLoaded] = useState(false);
	const { switchNetwork } = useSwitchNetwork();

	const isLight = isLightTheme(theme);
	const changeTheme = (): void => {
		dispatch({ type: ThemeEnum.THEME, payload: isLight ? defaultTheme.dark : defaultTheme.light });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(isLight));
	};

	const { signMessage: requestSignMsg } = useSignMessage({
		message: signMessage,
		onSuccess(data) {
			const payload: any = { address: accountAddr, signature: data };
			let parsed: ParsedProps | any = {};
			let parsedKeys: string[] = [];
			// Parse URL
			try {
				parsed = queryString.parse(location.search);
				parsedKeys = Object.keys(parsed);
			} catch (error) {
				console.log('error in URL parsing', error);
			}
			// Add promo into payload if it is present in the URL
			if (parsedKeys.length === 1 && parsed[parsedKeys[0]] === null) {
				payload.promo = parsedKeys[0];
			}
			void axios.request({
				url: `${BASE_URL}${routes.auth}`,
				method: 'POST',
				data: payload
			}).then((r) => {
				try {
					if (accountAddr) {
						dispatch({ type: VerificationEnum.ACCESS, payload: r.data.access });
						dispatch({ type: VerificationEnum.REFRESH, payload: r.data.refresh });
						setStorage({ account: accountAddr as string, access: r.data.access, isKyced: r.data.is_kyced, refresh: r.data.refresh });
						if (parsedKeys.length === 1 && parsed[parsedKeys[0]] === null) {
							// Remove promo from the page URL
							window.history.replaceState({}, document.title, '/');
						}
						if (parsedKeys.length === 2 && parsed.address && parsed.nonce) {
							window.history.replaceState({}, document.title, '/');
							location.search = '';
						}
					}
				} catch (error) {
					if (parsedKeys.length === 2 && parsed.address && parsed.nonce) {
						window.history.replaceState({}, document.title, '/');
						location.search = '';
					}
					console.log('error', error);
				}
			});
		},
		onError() {
			disconnect();
			setSignMessage('');
			toast.warning('You have been disconnected due to unsigning on a computer or mobile device. Confirm the signature to sign in.', { theme: theme.name });
		},
	});

	const setTokensInStorageAndContext = async () => {
		const parsed: ParsedProps | any = queryString.parse(location.search);

		if (accountAddr && !parsed.nonce) {
			setIsLoading(true);
			try {
				const msg: any = await getAuthTokensFromNonce(accountAddr);
				setSignMessage(msg);
			} catch (error: any) {
				toast.error('You need to sign the “nonce” in the wallet in order to continue with CryptoYou. If you want to login, click on the Login button again.', { theme: theme.name });
			}
			setIsLoading(false);
		} else if (Object.keys(parsed).length === 2 && parsed.address && parsed.nonce) {
			setSignMessage(`By signing this nonce: "${parsed.nonce}" you accept the terms and conditions available at https://cryptoyou.io/terms-of-use/`);
		}
	};

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

	const handleNetworkChange = (name: string) => {
		setShowNetworksList(!showNetworksList);
		if (isUserVerified) {
			try {
				// @ts-ignore
				switchNetwork?.(NETWORK_TO_WC[name]?.id);
			} catch (error: any) {
				toast.error('Something went wrong - please try again or later', { theme: theme.name });

				return;
			}
		} else {
			dispatch({
				type: SourceEnum.NETWORK,
				payload: name
			});

			if (SOURCE_NETWORKS && isNetworkSelected(name)) {
				dispatch({
					type: SourceEnum.TOKEN,
					// @ts-ignore
					payload: findNativeToken(SOURCE_NETWORKS[NETWORK_TO_ID[name]]?.['tokens'])
				});
			}
		}
		dispatch({ type: DestinationEnum.NETWORK, payload: DefaultSelectEnum.NETWORK });
		dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
		dispatch({ type: AmountEnum.AMOUNT, payload: '' });
		dispatch({ type: DestinationEnum.AMOUNT, payload: '' });
	};

	const checkStatus = async () => {
		if (!isUserVerified && accountAddr === userAccount && isNetworkConnected && accessToken) {
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
					isKyced: kycL2Status === KycL2StatusEnum.PASSED || kycL2Status === KycL2StatusEnum.INITIAL
				});
				// TODO: move this part to context?
				// if (kyc === KycStatusEnum.REJECT) {
				// 	dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC });
				// 	addToast('Your verification was rejected. Please try again. If you have questions, please send us an email at support@cryptoyou.io.', 'warning');
				// }
				if (kycL2Status === KycL2StatusEnum.REJECTED) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC_L2 });
					toast.warning('Your verification was rejected. Please try again. If you have questions, please send us an email at support@cryptoyou.io.', { theme: theme.name, position: 'top-center' });
				} else if (kycL2Status === KycL2StatusEnum.REQUIRED) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC_L2 });
				} else if (kycL2Status === KycL2StatusEnum.PENDING) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.CHECK_KYC_L2 });
					setShowStatusKycL2Modal(true);
				}
			} catch (error: any) {
				if (error?.response?.status === 401) {
					await setTokensInStorageAndContext();
				} else {
					console.log('error in checkStatus', error);
				}
			}
			setIsLoading(false);
		}
	};

	const domNode: any = useClickOutside(() => {
		setShowMenu(false);
		setShowNetworksList(false);
	});

	const accountsRef: any = useClickOutside(() => {
		setShowAdditionalAccounts(false);
	});

	const updateStatusKycL2Modal = (value: boolean) => {
		setShowStatusKycL2Modal(value);
	};

	useEffect(() => {
		if (signMessage) {
			requestSignMsg();
		}
	}, [signMessage]);

	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://www.socialintents.com/api/socialintents.1.3.js#2c9faa35871f751e0187282239990717';
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	useEffect(() => {
		if (binanceScriptLoaded && binanceToken) {
			makeBinanceKycCall(binanceToken);
		}
	}, [binanceToken, binanceScriptLoaded]);

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
					: KycL2StatusEnum.REQUIRED
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
			toast.warning('Switch to your verified account in the wallet to come back to CryptoYou.', { theme: theme.name });
			dispatch({ type: VerificationEnum.ACCESS, payload: '' });
			dispatch({ type: VerificationEnum.REFRESH, payload: '' });
			dispatch({
				type: KycL2Enum.STATUS,
				payload: null
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
				dispatch({ type: KycL2ModalShowEnum.isKycL2ModalShow, payload: true });
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
		if (wagmiChain && !Object.keys(CHAINS).includes(wagmiChain?.id.toString())) {
			disconnect();
			toast.error('Please change the network to one that is supported', { theme: theme.name });

			return;
		}

	}, [wagmiChain]);

	useEffect(() => {
		void checkStatus();
	}, [accountAddr, userAccount, kycL2Status, accessToken, isUserVerified]);

	const handleSelectedAccount = (account: AdditionalAccount) => {
		setSelectedAccount(account);
		updateSubAccountModal(true);
	};

	const addAdditionalAccount = () => {
		setShowAddSubAccountModal(true);
	};

	const deleteAdditionalAccount = async (id: number) => {
		try {
			await api.request({
				method: 'DELETE',
				url: `${BASE_URL}account/wallet/${id}`,
			}).then((res) => {
				const findDeletingAccount: AdditionalAccount | undefined = additionalAccounts.find((acc) => acc.address === accountAddr);

				if (res.status === 204) {
					const filteredAccounts: AdditionalAccount[] = additionalAccounts.filter((account: AdditionalAccount) => account.id !== id);
					setAdditionalAccounts(filteredAccounts);
					setShowAdditionalAccounts(false);
					toast.success('Additional account has been successfully deleted!', { theme: theme.name });

					if (findDeletingAccount) {
						dispatch({ type: VerificationEnum.ACCESS, payload: '' });
						dispatch({ type: VerificationEnum.REFRESH, payload: '' });
						dispatch({
							type: KycL2Enum.STATUS,
							payload: null
						});
						dispatch({ type: VerificationEnum.ACCOUNT, payload: '' });
						setStorage({ account: '', access: '', isKyced: false, refresh: '' });

						disconnect();
					}
				}
			});
		} catch (error) {
			toast.error('Something went wrong please try again!', { theme: theme.name });
			console.log('something wrong', error);
		}
	};

	const updateSubAccountModal = (value: boolean) => {
		setShowSubAccountModal(value);
	};

	const updateAddSubAccountModal = (showModal: boolean, account?: AdditionalAccount) => {
		setShowAddSubAccountModal(showModal);
		if (account) {
			setAdditionalAccounts([...additionalAccounts, account]);
			handleSelectedAccount(account);
		}
	};

	useEffect(() => {
		if (isUserVerified) {
			const getAdditionalAccountsList = async () => {
				try {
					await api.request({
						method: 'GET',
						url: `${BASE_URL}account/wallet/`
					}).then((res) => {
						const accounts: AdditionalAccount[] = res.data;
						if (accounts.length > 0) {
							setAdditionalAccounts(accounts);
						}
					});
				} catch (error) {
					console.log('something goes wrong', error);
				}
			};
			void getAdditionalAccountsList();
		}
	}, [isUserVerified]);

	useEffect(() => {
		if (selectedAccount?.address && selectedAccount.nonce) {
			setShowSubAccountModal(true);
		}
	}, [selectedAccount?.address]);

	useEffect(() => {
		updateSubAccountModal(false);
		updateAddSubAccountModal(false);
	}, [isUserVerified]);

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
			{!isMobile && isNetworkSelected(sourceNetwork) && (
				<NetworkWrapper onClick={() => setShowNetworksList(!showNetworksList)}>
					{sourceNetwork ? sourceNetwork : null}
					<Icon icon={sourceNetwork.toLowerCase() as IconType} size="small" />
					<Icon
						icon={isLightTheme(theme) ? 'arrowDark' : 'arrowLight'}
						size={16}
						style={{
							transform: `rotate(${showNetworksList ? 180 : 0}deg)`,
							transition: DEFAULT_TRANSITION
						}}
					/>
				</NetworkWrapper>
			)}
			{isMobile && isNetworkSelected(sourceNetwork) && (
				<NetworkWrapper onClick={() => setShowNetworksList(!showNetworksList)}>
					<Icon icon={sourceNetwork.toLowerCase() as IconType} size="small" />
					<Icon
						icon={isLightTheme(theme) ? 'arrowDark' : 'arrowLight'}
						size={16}
						style={{
							transform: `rotate(${showNetworksList ? 180 : 0}deg)`,
							transition: DEFAULT_TRANSITION
						}}
					/>
				</NetworkWrapper>
			)}
			{showNetworksList && (
				<MenuWrapper theme={theme}>
					<Networks
						theme={theme}
						ref={domNode}
						style={{
							maxWidth: `${isDeskTop ? '100%' : pxToRem(200)}`,
							right: `${!isDeskTop && '20%'}`
						}}>
						{Object.values(CHAINS).map((chain) => (
							<li onClick={() => handleNetworkChange(chain.name)} key={chain.name}>
								<Icon icon={chain.name.toLowerCase() as IconType} size="small" />
								{chain.name}
								{sourceNetwork === chain.name && (
									<Icon
										icon={isLightTheme(theme) ? 'checkLight' : 'checkDark'}
										size={16}
										style={{ marginLeft: 'auto' }}
									/>
								)}
							</li>
						))}
					</Networks>
				</MenuWrapper>
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
			{isUserVerified && kycL2Status === KycL2StatusEnum.PASSED && <AddAccountBtn onClick={addAdditionalAccount} title='Add additional account'>+</AddAccountBtn>}
			{isUserVerified && kycL2Status === KycL2StatusEnum.PASSED && additionalAccounts.length > 0 && (
				<AdditionalAccWrapper onClick={() => setShowAdditionalAccounts(!showAdditionalAccounts)}>
					<Icon
						icon={isLightTheme(theme) ? 'arrowDark' : 'arrowLight'}
						size={16}
						style={{
							transform: `rotate(${showAdditionalAccounts ? 180 : 0}deg)`,
							transition: DEFAULT_TRANSITION
						}}
					/>
				</AdditionalAccWrapper>
			)}
			{isUserVerified && kycL2Status === KycL2StatusEnum.PASSED && showAdditionalAccounts && (
				<MenuWrapper theme={theme}>
					<Accounts
						theme={theme}
						style={{
							maxWidth: `${isDeskTop ? '100%' : pxToRem(300)}`,
							left: `${!isDeskTop && '77%'}`
						}}
						ref={accountsRef}>
						{additionalAccounts.map((account: any) => (
							<AccountContainer key={account.id} >
								<AccountItem
									onClick={() => handleSelectedAccount(account)}>
									<JazzIcon />
									{account.address.slice(0, 10)}...{account.address.slice(-5)}
									<Icon icon={account.is_confirmed ? 'greenCheck' : 'redError'} size={20} />
								</AccountItem>
								<IconContainer onClick={() => deleteAdditionalAccount(account.id)} >
									<Icon icon='trashBin' size={18} style={{ outline: 'none' }} />
								</IconContainer>
							</AccountContainer>
						))}
					</Accounts>
				</MenuWrapper>
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
			<KycL2Modal />
			<StatusKycL2Modal
				showStatusKycL2Modal={showStatusKycL2Modal}
				updateStatusKycL2Modal={updateStatusKycL2Modal}
			/>
			<AddSubAccountModal showModal={showAddSubAccountModal} setShowModal={updateAddSubAccountModal} />
			{isUserVerified && kycL2Status === KycL2StatusEnum.PASSED && selectedAccount?.address && <SubAccountModal showModal={showSubAccountModal} setShowModal={updateSubAccountModal} account={selectedAccount} />}
		</StyledHeader>
	);
};
