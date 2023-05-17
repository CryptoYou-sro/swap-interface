import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import App from './App';
import { ToastProvider, Web3ModalConnect } from './components';
import { AuthProvider, customW3mProvider } from './helpers';
import { moonbeam, bsc } from './helpers/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const chains = [mainnet, moonbeam, bsc,];
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;
const { provider } = configureChains(
	chains, 
	[
		jsonRpcProvider({
			rpc: (chain): any => chain.id === 56 ? {
					http: ['https://bsc.publicnode.com'],
				} : null,
		}),
		customW3mProvider({ projectId }),
	]);
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

root.render(
	<StrictMode>
		<WagmiConfig client={wagmiClient}>
			<AuthProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
				<Web3ModalConnect projectId={projectId} ethereumClient={ethereumClient} />
			</AuthProvider>
		</WagmiConfig>
	</StrictMode>
);
