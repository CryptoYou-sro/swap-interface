import type { Config } from '@usedapp/core';
import { DAppProvider, Mainnet, Moonbeam } from '@usedapp/core';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { bsc, mainnet, moonbeam, polygon } from 'wagmi/chains';
import App from './App';
import { ToastProvider } from './components';
import { AuthProvider } from './helpers';

const chains = [mainnet, polygon, moonbeam, bsc];
const projectId = 'a023072fed8e9b347297fa5ad22a5a9e';
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
	autoConnect: true,
	connectors: w3mConnectors({
		projectId,
		version: 1,
		chains
	}),
	provider
});
const ethereumClient = new EthereumClient(wagmiClient, chains);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const config: Config = {
	readOnlyChainId: Mainnet.chainId,
	readOnlyUrls: {
		[Mainnet.chainId]: 'https://ethereum.publicnode.com',
		[Moonbeam.chainId]: 'https://rpc.api.moonbeam.network'
	},
	networks: [Mainnet, Moonbeam]
};

root.render(
	<StrictMode>
		<WagmiConfig client={wagmiClient}>
			<DAppProvider config={config}>
				<AuthProvider>
					<ToastProvider>
						<App />
					</ToastProvider>
				</AuthProvider>
			</DAppProvider>
		</WagmiConfig>
		<Web3Modal
			projectId={projectId}
			ethereumClient={ethereumClient}
			themeMode="dark"
			themeVariables={{
				'--w3m-accent-color': '#2d2d2d',
				'--w3m-accent-fill-color': 'white',
				'--w3m-background-color': '#1d75a2',
				'--w3m-background-border-radius': '6px',
				'--w3m-container-border-radius': '6px',
				'--w3m-wallet-icon-border-radius': '0px',
				'--w3m-input-border-radius': '6px',
				'--w3m-button-border-radius': '6px',
				'--w3m-secondary-button-border-radius': '6px',
				'--w3m-notification-border-radius': '6px',
				'--w3m-icon-button-border-radius': '6px',
				'--w3m-button-hover-highlight-border-radius': '0px',
				'--w3m-font-family': 'Open Sans',
				'--w3m-z-index': '100000'
			}}
		/>
	</StrictMode>
);
