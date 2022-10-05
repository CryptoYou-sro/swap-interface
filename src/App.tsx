import './styles/fonts/font.css';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { Theme } from './styles';
import {
	fontFamily,
	fontSize,
	fontStyle,
	fontWeight,
	mediaQuery,
	pxToRem,
	viewport,
	DEFAULT_TRANSIITON
} from './styles';
import { Header } from './components';
import { SwapForm, TransactionHistory } from './pages';
import { useStore } from './helpers';

type Props = {
	theme: Theme;
};

export const GlobalStyles = createGlobalStyle`
	body {
		font-family: ${fontFamily};
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.regular};
		font-size: ${fontSize[14]};
		line-height: ${fontSize[18]};
		max-width: ${viewport[1760]};
		min-height: 100vh;
		color: ${(props: Props) => props.theme.font.default};
		box-sizing: border-box;
		scroll-behavior: smooth;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		margin: 0 auto;
		padding: 0 ${pxToRem(20)} ${pxToRem(40)};
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transition: ${DEFAULT_TRANSIITON};
		background: ${(props: Props) => props.theme.background.default};

		${mediaQuery('s')} {
			background: ${(props: Props) =>
				`linear-gradient(180deg, ${props.theme.background.mobile}, ${props.theme.background.mobile} 55px, ${props.theme.background.default} 55px);`}
		}
	}

	*::-webkit-scrollbar {
		display: none;
	}
`;

const App = () => {
	const {
		state: { theme }
	} = useStore();

	return (
		<Router>
			<GlobalStyles theme={theme} />
			<Header />
			<Routes>
				<Route path="/" element={<SwapForm />} />
				<Route path="/transaction-history" element={<TransactionHistory />} />
			</Routes>
		</Router>
	);
};

export default App;
