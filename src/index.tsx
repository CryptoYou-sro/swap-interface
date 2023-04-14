import { Config, DAppProvider, Mainnet, Moonbeam } from '@usedapp/core';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { bsc, mainnet, moonbeam } from 'wagmi/chains';
import App from './App';
import { ToastProvider, Web3ModalConnect } from './components';
import { AuthProvider } from './helpers';

const chains = [moonbeam, mainnet, bsc];
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
		[Moonbeam.chainId]: 'https://rpc.api.moonbeam.network',
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
					<Web3ModalConnect projectId={projectId} ethereumClient={ethereumClient} />
				</AuthProvider>
			</DAppProvider>
		</WagmiConfig>
	</StrictMode>
);
