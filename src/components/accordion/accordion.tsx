import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
	Icon,
	Spinner
} from '../../components';
import type { TransactionData } from '../../helpers';
import { WEI_TO_GLMR, beautifyNumbers, formatDate, isLightTheme, useStore } from '../../helpers';
import { useMedia } from '../../hooks';
import { Notifications } from '../../pages';
import type { Theme } from '../../styles';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET,
	DEFAULT_TRANSITION,
	fontSize,
	mediaQuery,
	pxToRem,
	spacing
} from '../../styles';

type StyleProps = {
	theme: Theme;
	open?: boolean;
	color?: string;
	height?: 'large' | 'small';
};

export const Wrapper = styled.div`
	background-color: ${(props: StyleProps) => props.theme.background.secondary};
	margin-top: ${spacing[12]};
	font-size: ${fontSize[16]};
	line-height: ${fontSize[22]};
	border: 1px solid ${(props: StyleProps) => props.theme.border.default};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	overflow: hidden;
`;

const TitleWrapper = styled.div`
	cursor: pointer;
	padding: ${spacing[12]} ${spacing[20]};
	background-color: ${(props: StyleProps) =>
		props.open ? props.theme.background.secondary : props.theme.background.default};
	transition: ${DEFAULT_TRANSITION};
	position: relative;
	z-index: 10;
	display: flex;
	gap: ${spacing[8]};
	justify-content: space-between;

	&:last-child {
		border-bottom: none;
	}

	&:focus-visible {
		outline-offset: ${DEFAULT_OUTLINE_OFFSET};
		outline: ${(props: StyleProps) => DEFAULT_OUTLINE(props.theme)};
	}

	&:hover {
		opacity: 0.65;
	}
`;

const TitleTab = styled.div(
	({ flex = 2, mobile = false }: { flex?: number; mobile?: boolean }) =>
		css`
			display: flex;
			gap: ${spacing[8]};
			flex: ${flex};
			${!mobile && `${mediaQuery('s')} {display: none}`}
		`
);

const TitleText = styled.div`
	color: ${(props: StyleProps) => props.color};
`;

const MobileHeaderInfo = styled.div`
	color: ${(props: StyleProps) => props.color};
`;

const MobileHeaderSection = styled.div`
	display: flex;
	gap: ${spacing[8]};
`;

const AccordionItem = styled.div`
	&:not(:last-child) {
		border-bottom: 1px solid ${(props: StyleProps) => props.theme.border.default};
	}
`;

const Content = styled.div`
	height: ${(props: StyleProps) =>
		props.open ? (props.height === 'small' ? pxToRem(128) : pxToRem(350)) : pxToRem(30)};
	color: ${(props: StyleProps) => props.theme.font.secondary};
	text-align: center;
	position: relative;
	margin-top: ${(props: StyleProps) => (props.open ? '0px' : `-${spacing[30]}`)};
	text-align: left;
	transition: ${(props: StyleProps) =>
		props.open
			? 'all .55s cubic-bezier(0.080, 1.09, 0.320, 1.275)'
			: 'all .2s cubic-bezier(0.6, -0.28, 0.735, 0.045)'};

	&:not(:last-child) {
		border-bottom: 1px solid ${(props: StyleProps) => props.theme.border.default};
	}

	${mediaQuery('s')} {
		height: ${(props: StyleProps) =>
		props.open ? (props.height === 'small' ? pxToRem(175) : pxToRem(425)) : pxToRem(30)};
	}
`;

const EmptyColumn = styled.div`
	flex: 1;
`;

const ContentColumn = styled.div`
	flex: 6;
`;

const SpinnerWrapper = styled.div`
	display: flex;
	justify-content: center;

	${mediaQuery('s')} {
		margin-top: ${spacing[16]};
	}
`;

const ContentText = styled.div(
	({ open }: { open: boolean }) => css`
		display: flex;
		gap: ${spacing[8]};
		visibility: ${open ? 'visible' : 'hidden'};
		opacity: ${open ? '1' : '0'};
		overflow: auto;
		padding: ${spacing[12]} ${spacing[48]} ${spacing[12]} ${spacing[20]};
		overflow-y: scroll;
		transition: ${open ? 'all 0.4s ease-in' : 'all 0.2s ease-in'};

		${mediaQuery('s')} {
			display: inline-block;
		}
	`
);

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

export const ContentItemText = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${(props: StyleProps) => (props.color ? props.color : theme.font.select)};
		line-height: ${fontSize[22]};
	`;
});

type DataProps = TransactionData & { open: boolean };

type Props = { data: Omit<DataProps, 'open'>[]; contentLoading: boolean };

export const Accordion = ({ data, contentLoading }: Props) => {
	const [accordionItems, setAccordionItems] = useState<DataProps[]>([]);
	const {
		state: { theme }
	} = useStore();
	const { mobileWidth } = useMedia('s');

	useEffect(() => {
		const accordion: any[] = [];
		data?.forEach((dataset) => {
			accordion.push({ ...dataset, open: false });
		});
		setAccordionItems(accordion);
	}, [data]);

	const handleClick = (index: number) => {
		if (accordionItems.length > 0) {
			const updateAccordion = accordionItems.map((data: DataProps, i: number) => {
				if (i === index) {
					data.open = !data.open;
				}

				return data;
			});
			setAccordionItems(updateAccordion);
		}
	};

	const handleKeyDown = (e: any, i: number): void => {
		if (e.key === 'Enter') {
			handleClick(i);
		}
	};

	return accordionItems?.length > 0 ? (
		<Wrapper theme={theme} data-testid="accordion">
			{accordionItems.map((item: DataProps, index: number) => (
				<AccordionItem key={index} theme={theme}>
					<TitleWrapper
						theme={theme}
						onClick={() => handleClick(index)}
						open={item.open}
						// @ts-ignore
						tabIndex="1"
						onKeyDown={(e) => handleKeyDown(e, index)}>
						<TitleTab flex={1} mobile={true}>
							<TitleText color={theme.font.secondary}>{item.header?.symbol}</TitleText>
						</TitleTab>
						<TitleTab>
							Deposit Time:{' '}
							<TitleText color={theme.font.secondary}>
								{/* TODO: timezone? */}
								{formatDate(item.header?.timestamp)}
							</TitleText>
						</TitleTab>
						<TitleTab>
							Sent:{' '}
							<TitleText color={theme.font.secondary}>
								{beautifyNumbers({ n: +item.header?.samt * WEI_TO_GLMR ?? '0' })}{' '}
								{item.header?.scoin} (Moonbeam)
							</TitleText>
						</TitleTab>
						<TitleTab>
							Received:{' '}
							<TitleText color={theme.font.secondary}>
								{beautifyNumbers({ n: item.withdrawl?.amount ?? '' })}{' '}
								{item.withdrawl?.amount
									? `${item.header?.fcoin} (
								${item.header?.net})`
									: ''}
							</TitleText>
						</TitleTab>
						<Icon
							size={20}
							icon={isLightTheme(theme) ? 'arrowDark' : 'arrowLight'}
							style={{
								transform: `rotate(${item.open ? 180 : 0}deg)`,
								transition: DEFAULT_TRANSITION
							}}
						/>
					</TitleWrapper>
					<Content
						theme={theme}
						// @ts-ignore
						open={item.open}
						height={item.content === 'none' || !item?.content ? 'small' : 'large'}>
						<ContentText open={item.open}>
							<EmptyColumn />
							<ContentColumn>
								{mobileWidth && (
									<MobileHeaderInfo color={theme.font.select}>
										<MobileHeaderSection>
											Deposit Time:{' '}
											<TitleText color={theme.font.secondary}>
												{/* TODO: timezone? */}
												{formatDate(item.header?.timestamp)}
											</TitleText>
										</MobileHeaderSection>
										<MobileHeaderSection>
											Sent:{' '}
											<TitleText color={theme.font.secondary}>
												{beautifyNumbers({ n: +item.header?.samt * WEI_TO_GLMR ?? '0' })}{' '}
												{item.header?.scoin} (Moonbeam)
											</TitleText>
										</MobileHeaderSection>
										<MobileHeaderSection>
											Received:{' '}
											<TitleText color={theme.font.secondary}>
												{beautifyNumbers({ n: item.withdrawl?.amount ?? '' })}{' '}
												{item.withdrawl?.amount
													? `${item.header?.fcoin} (${item.header?.net})`
													: ''}
											</TitleText>
										</MobileHeaderSection>
									</MobileHeaderInfo>
								)}
								{contentLoading ? (
									<SpinnerWrapper>
										<Spinner size="medium" color={theme.background.tertiary} />
									</SpinnerWrapper>
								) : (
									<ContentList>
										{item.content === 'none' ? (
											<>
												<ContentItemText>This swap has not been completed.</ContentItemText>{' '}
												<ContentItemText color={theme.button.error}>
													Unsuccessful swap!
												</ContentItemText>
											</>
										) : !item.content ? (
											<ContentItemText>
												Data currently not available - please try again later
											</ContentItemText>
										) : (
											<>
												<ContentItem theme={theme}>
													<ContentItemTitle>Successfull Deposit</ContentItemTitle>
													<ContentItemText>Gas fee: {item.gasFee}</ContentItemText>
												</ContentItem>
												<ContentItem theme={theme}>
													<ContentItemTitle>Buy Order {item.header?.symbol}</ContentItemTitle>
													<ContentItemText>
														Quantity: {beautifyNumbers({ n: item.content?.qty })}{' '}
														{item.header?.scoin}
													</ContentItemText>
													<ContentItemText>Exchange Rate: {item.content?.price}</ContentItemText>
													<ContentItemText>
														Date: {formatDate(item.content?.timestamp)}
													</ContentItemText>
													<ContentItemText>
														CEX Fee: {beautifyNumbers({ n: item.content?.cexFee })}{' '}
														{item.header?.fcoin}
													</ContentItemText>
												</ContentItem>
												<ContentItem theme={theme}>
													<ContentItemLink
														theme={theme}
														onClick={() => window.open(item.withdrawl?.url)}>
														Withdraw Transaction Link
													</ContentItemLink>
													<ContentItemText>
														Withdrawal Fee:{' '}
														{beautifyNumbers({ n: item.withdrawl?.withdrawFee ?? '' })}{' '}
														{item.header?.fcoin}
													</ContentItemText>
												</ContentItem>
												<ContentItem theme={theme}>
													<ContentItemText
														color={
															item.content?.success ? theme.button.default : theme.button.error
														}>
														{item.content?.success ? 'Successful swap!' : 'Unsuccessful swap!'}
													</ContentItemText>
												</ContentItem>
											</>
										)}
									</ContentList>
								)}
							</ContentColumn>
						</ContentText>
					</Content>
				</AccordionItem>
			))}
		</Wrapper>
	) : (
		<Notifications>You do not have any transactions yet</Notifications>
	);
};
