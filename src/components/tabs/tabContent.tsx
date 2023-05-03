import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useBlockNumber } from 'wagmi';
import { BLOCKS_AMOUNT, makeId, routes, useStore } from '../../helpers';
import { useAxios } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, DEFAULT_TRANSITION, Theme, fontSize, mediaQuery, pxToRem, spacing } from '../../styles';
import { Icon } from '../icon/icon';

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
	border: 1px solid ${(props: StyleProps) =>
		props.type === 'history' ? 'transparent' : props.theme.border.default};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	border-top-left-radius: 0;
	margin-top: -1px;
	z-index: 10;
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
`;
const IconWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: ${spacing[10]};

	${mediaQuery('s')} {
		margin-top: ${spacing[16]};
	}
`;

const WithdrawalLink = styled.a(() => {
	const { state: { theme } } = useStore();

	return css`
	text-decoration: underline;
	cursor: pointer;
	transition: ${DEFAULT_TRANSITION};

	&:hover {
		color: ${theme.button.default};
	}
`;
});

export const TabContent = ({ swap, type = 'swap' }: any) => {
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
	const orders = swap && swap.action[0];
	const withdrawal = swap && swap.withdraw[0];
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

	return swap ? (
		// @ts-ignore
		<Content theme={theme} type={type}>
			<ContentList>
				{swap.costRequestCounter <= 0 ? 'Starting process' : null}
				{swap.costRequestCounter ? (
					<ContentItem theme={theme} key={makeId(32)}>
						<ContentItemTitle>
							Request validation
						</ContentItemTitle>
						<br />
						<ContentItemText>
							{swap.costRequestCounter < 2
								? '...in progress'
								: 'Done'}
							<br />
							<br />
						</ContentItemText>
						<ContentItemText>
							{swap.depositBlock <= 0
								? 'Wait for Metamask to open (this can take some time), then confirm the transation'
								: null}
						</ContentItemText>
					</ContentItem>
				) : null}
				{currentBlockNumber.data && swap.depositBlock ? (
					<ContentItem theme={theme} key={makeId(32)}>
						<ContentItemTitle>
							{!swap?.action.length
								? 'Initiating swap'
								: 'Swap initiated'}
						</ContentItemTitle>
						<br />
						<ContentItemText>
							{currentBlockNumber.data - swap.depositBlock < BLOCKS_AMOUNT
								? 'Your request is being processed. Please wait'
								: currentBlockNumber.data - swap.depositBlock >= BLOCKS_AMOUNT && !swap.action.length
									? 'Your request will be confirmed soon'
									: null}
						</ContentItemText>
					</ContentItem>
				) : null}
				{orders ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemTitle>
							Conversion approved
						</ContentItemTitle>
						<ContentItemText>Market: {swap.sourceToken}-{orders.s.replace(swap.sourceToken, '')}</ContentItemText>
						<ContentItemText>Exchange rate: {orders.p}</ContentItemText>

						<br />
						<ContentItemTitle>
							Finalising the transaction now
						</ContentItemTitle>
					</ContentItem>
				) : null}
				{withdrawal && !withdrawLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemLink theme={theme}>Sending {orders.s.replace(swap.sourceToken, '')} to your
							wallet</ContentItemLink>
					</ContentItem>
				) : withdrawLink?.type === 0 && withdrawLink.url ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemLink theme={theme} onClick={() => window.open(withdrawLink.url)}>
							Funds may have already arrived or will be received shortly. <WithdrawalLink href={withdrawLink.url}>txid</WithdrawalLink>
						</ContentItemLink>
					</ContentItem>
				) : withdrawal && withdrawLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemTitle>
							The {orders.s.replace(swap.sourceToken, '')} are on their way to the destination address. Please wait
						</ContentItemTitle>
					</ContentItem>
				) : null}
				{swap.complete ? (
					<ContentItem theme={theme} color={theme.button.default}>
						<ContentItemText color={theme.button.default}>Swap successfully executed</ContentItemText>
					</ContentItem>
				) : !swap.complete && swap.complete !== null ? (
					<ContentItem theme={theme} color={theme.font.default}>
						<ContentItemText>Invalid operations spotted. Please write us at info@cryptoyou.io</ContentItemText>
					</ContentItem>
				) : null}
				{swap.complete === null ? (
					<IconWrapper>
						<Icon
							size="large"
							icon='moneyAnimated'
						/>
					</IconWrapper>
				) : null}
			</ContentList>
		</Content>
	) : null;
};
