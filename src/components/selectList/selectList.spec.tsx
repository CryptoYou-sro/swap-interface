import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { SelectList } from './selectList';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { bsc, moonbeam } from '../../helpers/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { w3mConnectors } from '@web3modal/ethereum';

describe('SelectList', () => {
	const chains = [mainnet, moonbeam, bsc];
	const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;
	const { provider } = configureChains(
		chains,
		[publicProvider()],
		{ pollingInterval: 10_000 },
	);
	const wagmiClient = createClient({
		autoConnect: true,
		connectors: w3mConnectors({
			projectId,
			version: 1,
			chains
		}),
		provider
	});
	const networksList = ['ETH', 'BTC', 'USDT'];
	it('should render a select list with 3 items', () => {
		const { getByTestId } = render(
			<WagmiConfig client={wagmiClient}>
				<AuthProvider>
					<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
				</AuthProvider>
			</WagmiConfig>
		);
		expect(getByTestId('select-list')).toMatchSnapshot();
	});
});
