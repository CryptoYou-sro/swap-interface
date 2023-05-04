import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';
import PHRASES from '../../data/phrases.json';
import { useStore } from '../../helpers';
import { useLocalStorage } from '../../hooks';
import type { Theme } from '../../styles';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { TabWrapper } from './TabWrapper';

const Wrapper = styled.div`
	max-width: 100%;
	margin: ${pxToRem(50)} auto;
`;

const Paragraph = styled.p(
	() => css`
		color: ${(props: { theme: Theme }) => props.theme.font.default};
	`
);

type Active = {
	active: number;
};

type Props = {
	swapProductId: string;
	account: string;
	costRequestCounter: number;
	depositBlock: number;
	depositHash: any;
	action: object[];
	withdraw: object[];
	complete: null | boolean;
	pair: string;
	sourceToken: string;
	currentBlockNumber: number;
};

const Tab = styled.div(({ active }: Active) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		cursor: pointer;
		color: ${theme.font.secondary};
		padding: ${spacing[6]} ${spacing[6]};
		text-align: center;
		width: max-content;
		margin-right: ${spacing[4]};
		background: ${theme.background.secondary};
		border-radius: ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS} 0 0;
		border: 1px solid ${theme.border.default};

		&:nth-child(${++active}) {
			border-bottom: 1px solid ${theme.button.default};
			z-index: 100;
		}

		&:last-child {
			margin-right: 0;
		}
	`;
});

const TextContainer = styled.div`
	text-align: center;
	font-style: italic;
	height: ${pxToRem(70)};
	font-size: ${fontSize[14]};
	padding: ${spacing[14]} ${spacing[8]};
`;

export const TabModal = () => {
	const [swaps, setSwaps] = useState<Props[]>([]);
	const {
		state: { isUserVerified, theme }
	} = useStore();
	const [swapsStorage] = useLocalStorage<Props[]>('localSwaps', []);
	const [number, setNumber] = useState(0);
	const { address } = useAccount();

	// GET ALL UNFINISHED SWAPS
	useEffect(() => {
		const allUnFinishedSwaps: Props[] = swapsStorage.filter((swap: Props) => swap.complete === null);
		setSwaps(allUnFinishedSwaps);
	}, [swapsStorage.length]);

	const [selectedProductId, setSelectedProductId] = useState('');
	const [toggleIndex, setToggleIndex] = useState<number>(0);
	const [accountSwaps, setAccountSwaps] = useState<Props[]>([]);

	useEffect(() => {
		if (address) {
			const accountSwaps: Props[] = swaps.filter((swap: Props) => swap.account === address);
			setAccountSwaps(accountSwaps);
			if (swaps.length > 0) {
				setSelectedProductId(swaps[0].swapProductId);
			}
		}
	}, [swaps, address]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const randomNum = Math.floor(Math.random() * PHRASES.length);
			setNumber(randomNum);
		}, 7000);

		return () => clearInterval(intervalId);
	}, []);

	return isUserVerified ? (
		<Wrapper>
			{swaps.length > 0 && (
				<>
					<Paragraph theme={theme}>Pending Swaps ({swaps.length})</Paragraph>
					<div style={{ display: 'flex' }}>
						{accountSwaps.map((swap: Props, index: number) => (
							<Tab
								key={swap.swapProductId}
								active={toggleIndex}
								onClick={() => {
									setSelectedProductId(swap.swapProductId);
									setToggleIndex(index);
								}}>
								{swap.pair}
							</Tab>
						))}
					</div>
					{accountSwaps.map((swap: Props) => (
						<TabWrapper
							key={swap.swapProductId}
							propSwap={swap}
							isVisible={swap.swapProductId === selectedProductId}
						/>
					))}
					<TextContainer>{PHRASES[number]}</TextContainer>
				</>
			)}
		</Wrapper>
	) : null;
};
