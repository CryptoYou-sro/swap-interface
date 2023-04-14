import { BLOCKS_AMOUNT, formatDate, makeId, routes, useStore } from '../../helpers';
import styled, { css } from 'styled-components';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSITION,
	fontSize,
	mediaQuery,
	pxToRem,
	spacing,
	Theme
} from '../../styles';
import { useBlockNumber } from 'wagmi';
import { useAxios } from '../../hooks';
import { useEffect, useState } from 'react';
import { Spinner } from '../spinner/spinner';

type Props = {
	data?: any;
	color?: string;
	toggleIndex?: number;
	type?: 'history' | 'swap';
};

type StyleProps = Props & { theme: Theme };

const Content = styled.div`
	color: ${(props: StyleProps) => props.theme.font.secondary};
	padding: ${spacing[20]};

	display: block;
	background: ${(props: StyleProps) => props.theme.background.secondary};
	border: 1px solid
		${(props: StyleProps) =>
		props.type === 'history' ? 'transparent' : props.theme.border.default};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	border-top-left-radius: 0;
	margin-top: -1px;
`;

export const ContentList = styled.ul`
	list-style: none;
	padding: 0;
`;

export const ContentItem = styled.li`
	list-style: none;
	padding: 0 0 ${spacing[26]} ${spacing[20]};
	border-left: 1px solid ${(props: StyleProps) => props.theme.font.default};
	position: relative;
	margin-left: ${spacing[10]};
	font-size: ${fontSize[16]};

	&:last-child {
		border: 0;
		padding-bottom: 0;
	}

	&:before {
		content: '';
		width: ${pxToRem(16)};
		height: ${pxToRem(16)};
		background: ${(props: StyleProps) => props.theme.font.default};
		border-radius: 50%;
		position: absolute;
		left: ${pxToRem(-8)};
		top: 0;

		${mediaQuery('s')} {
			width: ${pxToRem(14)};
			height: ${pxToRem(14)};
			left: ${pxToRem(-7)};
		}
	}

	&:last-child:before {
		background-color: ${(props: StyleProps) => props.color};
	}

	&:last-of-type > div {
		line-height: ${fontSize[16]};
	}
`;

export const ContentItemTitle = styled.div`
	line-height: ${fontSize[16]};
	margin-bottom: ${spacing[4]};
`;

export const ContentItemText = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${(props: StyleProps) => (props.color ? props.color : theme.font.select)};
		line-height: ${fontSize[22]};
	`;
});

export const ContentItemLink = styled.div`
	color: ${(props: StyleProps) => props.theme.font.secondary};
	line-height: ${fontSize[16]};
	text-decoration: underline;
	cursor: pointer;
	transition: ${DEFAULT_TRANSITION};

	&:hover {
		color: ${(props: StyleProps) => props.theme.button.default};
	}
`;
const SpinnerWrapper = styled.div`
	display: flex;
	justify-content: center;

	${mediaQuery('s')} {
		margin-top: ${spacing[16]};
	}
`;

export const TabContent = ({ data, toggleIndex = 0, type = 'swap' }: Props) => {
	const [withdrawLink, setWithdrawLink] = useState<{
		amount: string;
		status: number;
		type: number;
		url: string | any;
		withdrawFee: string;
	} | null>(null);
	const currentBlockNumber = useBlockNumber({
		watch: true,
	});
	const {
		state: { theme }
	} = useStore();
	const orders = data?.[toggleIndex]?.action[0];
	const withdrawal = data?.[toggleIndex]?.withdraw[0];
	const api = useAxios();

	const getWithDrawLink = async () => {
		if (withdrawal) {
			try {
				await api
					.get(`${routes.transactionDetails}${withdrawal.id}`)
					.then((res) => setWithdrawLink(res.data));
			} catch (e) {
				console.log('e in getWithDrawLink function', { e });
			}
		}
	};
	useEffect(() => {
		void getWithDrawLink();
	}, [withdrawal]);

	return data.length > 0 ? (
		// @ts-ignore
		<Content theme={theme} type={type}>
			<ContentList>
				{data?.[toggleIndex].costRequestCounter ? (
					<ContentItem theme={theme} color={data.color} key={makeId(32)}>
						<ContentItemTitle>
							Swap Request Validation ({data?.[toggleIndex]?.costRequestCounter}/2)
						</ContentItemTitle>
						<ContentItemText>
							{data?.[toggleIndex].costRequestCounter < 2
								? 'Your Swap request is under validation. Please wait until full confirmation.'
								: 'Your Swap request successfully validated.'}
						</ContentItemText>
					</ContentItem>
				) : null}
				{currentBlockNumber.data && data?.[toggleIndex]?.depositBlock ? (
					<ContentItem theme={theme} key={makeId(32)}>
						<ContentItemTitle>
							{!data?.[toggleIndex]?.action.length
								? `Deposit confirmation (${currentBlockNumber?.data - data?.[toggleIndex]?.depositBlock
								}/${BLOCKS_AMOUNT})`
								: 'Deposit confirmed'}
						</ContentItemTitle>
						<ContentItemText>
							{currentBlockNumber?.data - data?.[toggleIndex]?.depositBlock < BLOCKS_AMOUNT
								? 'Your deposit is waiting for the particular numbers of the blocks to pass. Please wait for 30 blocks to pass.'
								: currentBlockNumber?.data - data?.[toggleIndex]?.depositBlock >= BLOCKS_AMOUNT &&
									!data?.[toggleIndex].action.length
									? 'Your deposit is received and should be confirmed soon.'
									: null}
						</ContentItemText>
					</ContentItem>
				) : null}
				{orders ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemTitle>
							Conversion {data?.[toggleIndex]?.sourceToken}{' '}
							{orders.s.replace(data?.[toggleIndex]?.sourceToken, '')}
						</ContentItemTitle>
						<ContentItemText>Type: {orders.a === 0 ? 'SELL' : 'BUY'}</ContentItemText>
						<ContentItemText>Pair: {orders.s}</ContentItemText>
						<ContentItemText>Quantity: {orders.q}</ContentItemText>
						<ContentItemText>Price: {orders.p}</ContentItemText>
						<ContentItemText>Time: {formatDate(orders.ts)}</ContentItemText>
					</ContentItem>
				) : null}
				{withdrawal && !withdrawLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemLink theme={theme}>Withdrawal in process</ContentItemLink>
						<ContentItemText>
							Your funds is almost there, we are waiting for their landing into your wallet.
						</ContentItemText>
					</ContentItem>
				) : withdrawal?.t === 1 && withdrawLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemTitle>Withdrawal confirmed</ContentItemTitle>
					</ContentItem>
				) : withdrawal?.t === 0 && withdrawLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemLink theme={theme} onClick={() => window.open(withdrawLink.url)}>
							Withdrawal confirmed
						</ContentItemLink>
					</ContentItem>
				) : null}
				{data?.[toggleIndex]?.complete ? (
					<ContentItem theme={theme} color={theme.button.default}>
						<ContentItemText color={theme.button.default}>Successful swap!</ContentItemText>
					</ContentItem>
				) : !data?.[toggleIndex]?.complete && data?.[toggleIndex]?.complete !== null ? (
					<ContentItem theme={theme} color={theme.font.default}>
						<ContentItemText>No valid operations spotted!</ContentItemText>
					</ContentItem>
				) : null}
				{data?.[toggleIndex]?.complete === null ? (
					<SpinnerWrapper>
						<Spinner size="medium" color="default" />
					</SpinnerWrapper>
				) : null}
			</ContentList>
		</Content>
	) : null;
};
