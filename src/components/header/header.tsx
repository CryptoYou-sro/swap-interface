import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Mainnet, Moonbeam, useEthers, MetamaskConnector } from '@usedapp/core';
import { ethers } from 'ethers';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as CheckLight } from '../../assets/check-light.svg';
import { ReactComponent as CheckDark } from '../../assets/check-dark.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import MOON from '../../assets/glmr.png';
import ETH from '../../assets/eth.png';
import type { Theme, ColorType } from '../../styles';
import {
	mediaQuery,
	pxToRem,
	spacing,
	DEFAULT_BORDER_RADIUS,
	theme as defaultTheme,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET
} from '../../styles';
import {
	ButtonEnum,
	getAuthTokensFromNonce,
	INITIAL_STORAGE,
	isLightTheme,
	loadBinanceKycScript,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	makeBinanceKycCall,
	ETHEREUM_URL,
	ThemeEnum,
	useStore,
	VerificationEnum,
	button,
	KycStatusEnum,
	KycEnum,
	routes,
	BasicStatusEnum,
	DestinationEnum,
	CHAINS,
	hexToRgbA,
	isNetworkSelected,
	SourceEnum,
	MOONBEAM_URL
} from '../../helpers';
import type { ApiAuthType } from '../../helpers';
import { Button, useToasts, Wallet, IconButton, Arrow } from '../../components';
import type { IconType } from '../../components';
import { useAxios, useClickOutside, useLocalStorage, useMedia } from '../../hooks';
import _ from 'lodash';

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

const ThemeButton = styled.button`
	cursor: pointer;
	background: none;
	border: none;
	outline: 1px solid transparent;

	&:hover {
		opacity: 0.8;
	}

	&:focus-visible {
		outline-offset: ${DEFAULT_OUTLINE_OFFSET};
		outline: ${(props: Props) => DEFAULT_OUTLINE(props.theme)};
	}

	&:active {
		outline: none;
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

const Networks = styled(Menu)`
	width: 100%;

	& li {
		display: flex;
		gap: ${spacing[10]};
	}
`;

const NetworkWrapper = styled.div`
	display: flex;
`;

export const NETWORK_PARAMS = {
	'1': [
		{
			chainId: ethers.utils.hexValue(Mainnet.chainId),
			chainName: Mainnet.chainName,
			rpcUrls: [ETHEREUM_URL],
			nativeCurrency: {
				name: 'Ethereum',
				symbol: 'ETH',
				decimals: 18
			},
			blockExplorerUrls: ['https://etherscan.io/']
		}
	],
	'1284': [
		{
			chainId: ethers.utils.hexValue(Moonbeam.chainId),
			chainName: Moonbeam.chainName,
			rpcUrls: [MOONBEAM_URL],
			nativeCurrency: {
				name: 'Glimer',
				symbol: 'GLMR',
				decimals: 18
			},
			blockExplorerUrls: ['https://moonscan.io/']
		}
	]
};

export const Header = () => {
	const { mobileWidth: isMobile } = useMedia('s');
	const {
		state: {
			buttonStatus,
			isUserVerified,
			accessToken,
			kycStatus,
			sourceNetwork,
			account: userAccount,
			isNetworkConnected,
			theme
		},
		dispatch
	} = useStore();
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, INITIAL_STORAGE);
	// @ts-ignore
	const { addToast } = useToasts();
	const api = useAxios();

	const [showMenu, setShowMenu] = useState(false);
	const [showNetworksList, setShowNetworksList] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [binanceToken, setBinanceToken] = useState('');
	const [binanceScriptLoaded, setBinanceScriptLoaded] = useState(false);
	// const navigate = useNavigate();
	const { pathname } = useLocation();

	const noKycStatusMessage = 'kyc verify not exist';

	const isLight = isLightTheme(theme);
	const { activate, library, account, chainId, switchNetwork, activateBrowserWallet } = useEthers();

	const changeTheme = (): void => {
		dispatch({ type: ThemeEnum.THEME, payload: isLight ? defaultTheme.dark : defaultTheme.light });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(isLight));
	};

	const checkNetwork = async (): Promise<void> => {
		if (Object.keys(CHAINS).includes(chainId?.toString() as string)) {
			await switchNetwork(chainId === 1 ? Mainnet.chainId : Moonbeam.chainId); // TODO: has to be dynamic
		} else {
			await switchNetwork(Mainnet.chainId);
		}
	};

	const setTokensInStorageAndContext = async () => {
		if (account) {
			setIsLoading(true);
			try {
				const res: ApiAuthType = await getAuthTokensFromNonce(account, library);
				dispatch({ type: VerificationEnum.ACCESS, payload: res.access });
				dispatch({ type: VerificationEnum.REFRESH, payload: res.refresh });
				dispatch({
					type: KycEnum.STATUS,
					payload: res.is_kyced ? KycStatusEnum.PASS : KycStatusEnum.INITIAL
				});
				setStorage({ account, access: res.access, isKyced: res.is_kyced, refresh: res.refresh });
			} catch (error: any) {
				// TODO: do we need toast here?
				addToast('You need to sign the “nonce” via Metamask in order to continue with CryptoYou. If you want to login, click on the Login button again.', 'error');
			}
			setIsLoading(false);
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

	const handleNetworkChange = async (name: string) => {
		setShowNetworksList(!showNetworksList);
		try {
			// @ts-ignore
			await ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [
					{
						chainId: ethers.utils.hexValue(chainId === 1 ? Moonbeam.chainId : Mainnet.chainId)
					}
				]
			});
		} catch (error: any) {
			if ((error.code === 4902 || error.code === -32603) && name === 'GLMR') {
				try {
					// @ts-ignore
					await ethereum.request({
						method: 'wallet_addEthereumChain',
						params: NETWORK_PARAMS['1284']
					});
					dispatch({
						type: SourceEnum.NETWORK,
						payload: name
					});
					dispatch({
						type: SourceEnum.TOKEN,
						payload: name
					});
				} catch (e) {
					dispatch({
						type: SourceEnum.NETWORK,
						payload: name === 'GLMR' ? 'ETH' : 'GLMR'
					});
					dispatch({ type: SourceEnum.TOKEN, payload: name === 'GLMR' ? 'ETH' : 'GLMR' });
				}
			} else if (error.code === 4001) {
				return;
			} else {
				addToast('Something went wrong - please try again');
			}
		}
		dispatch({ type: DestinationEnum.NETWORK, payload: 'Select Network' });
		dispatch({ type: DestinationEnum.TOKEN, payload: 'Select Token' });
	};

	const checkStatus = async () => {
		if (!isUserVerified && account === userAccount && isNetworkConnected) {
			setIsLoading(true);
			try {
				const res = await api.get(routes.kycStatus);
				if (res.data.errorData === noKycStatusMessage) {
					await getBinanceToken();
				}
				const { kycStatus: kyc, basicStatus: basic } = res?.data?.statusInfo;
				dispatch({
					type: KycEnum.STATUS,
					payload: kyc
				});
				setStorage({ ...storage, isKyced: kyc === KycStatusEnum.PASS });
				// TODO: move this part to context?
				if (kyc === KycStatusEnum.REJECT) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC });
					addToast('Your verification was rejected. Please try again. If you have questions, please send us an email at support@cryptoyou.io.', 'error');
				} else if ((basic === BasicStatusEnum.INITIAL || basic === BasicStatusEnum.PASS) && kyc === KycStatusEnum.PROCESS) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC });
				} else if (kyc === KycStatusEnum.REVIEW) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.CHECK_KYC });
				}
			} catch (error: any) {
				if (error?.response?.status === 401) {
					await setTokensInStorageAndContext();
				}
			}
			setIsLoading(false);
		}
	};

	const handleButtonClick = async () => {
		let metamaskMissing = true;
		const onMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		try {
			// @ts-ignore
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			if (provider) {
				metamaskMissing = false;
			}
		} catch (error) {
			console.log('Can not find a Web3Provider in the browser');
		}

		if (!account) {
			if (onMobileDevice && metamaskMissing) {
				window.open(
					`https://metamask.app.link/dapp/${process.env.REACT_APP_PROD_URL}`,
					'_blank',
					'noopener,noreferrer'
				);
			}
			if (onMobileDevice && !metamaskMissing) {
				try {
					await activate(new MetamaskConnector());
				} catch (error) {
					console.log('error in connect wallet', error);
				}
			}
			if (!onMobileDevice && metamaskMissing) {
				console.log('HERE');
				addToast(
					'Looks like your browser doesent have Metamask wallet. Please install it first and then try again.'
				);
				setTimeout(
					() => window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer'),
					5000
				);
			}
			if (!onMobileDevice && !metamaskMissing) {
				try {
					activateBrowserWallet();
				} catch (error) {
					console.log('error in connect wallet', error);
				}
			}
		}

		if (_.isEqual(buttonStatus, button.CHANGE_NETWORK)) {
			await checkNetwork();
		}

		if (chainId && account) {
			if (buttonStatus === button.PASS_KYC || buttonStatus === button.CHECK_KYC) {
				await getBinanceToken();
			} else if (buttonStatus === button.LOGIN) {
				await setTokensInStorageAndContext();
			} else {
				void checkStatus();
			}
		}
	};

	const domNode: any = useClickOutside(() => {
		setShowMenu(false);
		setShowNetworksList(false);
	});

	useEffect(() => {
		if (binanceScriptLoaded && binanceToken) {
			makeBinanceKycCall(binanceToken);
		}
	}, [binanceToken, binanceScriptLoaded]);

	useEffect(() => {
		dispatch({ type: DestinationEnum.NETWORK, payload: 'Select Network' });
		dispatch({ type: DestinationEnum.TOKEN, payload: 'Select Token' });
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
				type: KycEnum.STATUS,
				payload: JSON.parse(localStorageAuth).isKyced ? KycStatusEnum.PASS : KycStatusEnum.INITIAL
			});
		}
	}, []);

	useEffect(() => {
		loadBinanceKycScript(() => {
			setBinanceScriptLoaded(true);
		});
	}, []);

	useEffect(() => {
		if (account) {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: account });
		} else {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: '' });
		}

		if (account && storage?.account && storage?.account !== account) {
			addToast(
				'Switch to your verified account on Metamask to come back to CryptoYou.',
				'error'
			);
			dispatch({ type: VerificationEnum.ACCESS, payload: '' });
			dispatch({ type: VerificationEnum.REFRESH, payload: '' });
			dispatch({
				type: KycEnum.STATUS,
				payload: KycStatusEnum.INITIAL
			});
			setStorage({ account, access: '', isKyced: false, refresh: '' });
		}
	}, [account, isUserVerified, isNetworkConnected]);

	useEffect(() => {
		if (!chainId) {
			dispatch({ type: VerificationEnum.NETWORK, payload: false });
			void checkNetwork();
		} else {
			dispatch({ type: VerificationEnum.NETWORK, payload: true });
		}
	}, [chainId]);

	useEffect(() => {
		void checkStatus();
	}, [kycStatus, accessToken, account, userAccount]);

	return (
		<StyledHeader theme={theme}>
			{isMobile ? (
				<a href="https://cryptoyou.io" target="_blank" >
					<LogoMobile style={{ width: '26px' }}/>
				</a>
			) : isLight ? (
				<a href="https://cryptoyou.io" target="_blank" style={{ marginRight: 'auto', marginTop: '20px', marginLeft: '20px'}}>
					<LogoLight style={{ width: '200px' }} />
				</a>
			) : (
				<a href="https://cryptoyou.io" target="_blank" style={{ marginRight: 'auto', marginTop: '20px', marginLeft: '20px'}}>
					<LogoDark style={{  width: '200px' }} />
				</a>
			)}
			{/* {!isMobile && (
				<Button
					variant="pure"
					onClick={() =>
						navigate(pathname !== '/transaction-history' ? '/transaction-history' : '/')
					}>
					{pathname !== '/transaction-history' ? 'Transaction History' : 'Cross-Chain Form'}
				</Button>
			)} */}
			{isUserVerified && account && isNetworkConnected ? (
				<Wallet />
			) : (
				<Button
					isLoading={isLoading}
					variant="secondary"
					onClick={handleButtonClick}
					color={buttonStatus.color as ColorType}>
					{buttonStatus.text}
				</Button>
			)}
			{isMobile && isNetworkSelected(sourceNetwork) && (
				<NetworkWrapper>
					<IconButton icon={sourceNetwork as IconType} iconOnly />
					<Arrow open={showNetworksList} onClick={() => setShowNetworksList(!showNetworksList)} />
				</NetworkWrapper>
			)}
			{!isMobile && (
				<ThemeButton theme={theme} onClick={changeTheme} aria-label="change theme">
					{isLight ? <Moon /> : <Sun />}
				</ThemeButton>
			)}
			{isMobile &&
				(isLight ? (
					<MenuLight onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }} />
				) : (
					<MenuDark onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }} />
				))}
			{showMenu && (
				<MenuWrapper theme={theme}>
					<Menu theme={theme} ref={domNode}>
						{/* <li
							onClick={() => {
								navigate(pathname !== '/transaction-history' ? '/transaction-history' : '/');
								setShowMenu(!showMenu);
							}}>
							{pathname !== '/transaction-history' ? <>Transaction History &#11044;</> : <>Cross-Chain Swap &#11044;</>}
						</li> */}
						<li
							onClick={() => {
								changeTheme();
								setShowMenu(!showMenu);
							}}>
							{isLightTheme(theme) ? <>Dark theme</> : <>Light theme</>}
						</li>
					</Menu>
				</MenuWrapper>
			)}
			{showNetworksList && (
				<MenuWrapper theme={theme}>
					<Networks theme={theme} ref={domNode}>
						{Object.values(CHAINS).map((chain) => (
							<li onClick={() => handleNetworkChange(chain.name)} key={chain.name}>
								<img src={chain.name === 'ETH' ? ETH : MOON} style={{ height: 18 }} />
								{chain.name === 'ETH' ? 'Ethereum' : 'Moonbeam'}
								{sourceNetwork !== chain.name ? null : isLightTheme(theme) ? (
									<CheckLight style={{ marginLeft: 'auto', marginTop: 4 }} />
								) : (
									<CheckDark style={{ marginLeft: 'auto', marginTop: 4 }} />
								)}
							</li>
						))}
					</Networks>
				</MenuWrapper>
			)}
		</StyledHeader>
	);
};
