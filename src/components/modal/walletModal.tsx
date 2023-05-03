import { disconnect } from '@wagmi/core';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, JazzIcon, Portal } from '../../components';
import { ButtonEnum, button, useStore } from '../../helpers';
import { useMedia } from '../../hooks';
import { fontSize, fontWeight, mediaQuery, pxToRem, spacing } from '../../styles';

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	account: string;
	isCopied?: boolean;
};

const ModalWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing[12]};
	width: 100%;

	${mediaQuery('xs')} {
		flex-direction: column;
		align-items: flex-start;
		padding: ${spacing[18]} ${spacing[46]} 0 ${spacing[14]};
	}
`;

const AccountTitle = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		font-size: ${fontSize[16]};
		color: ${theme.font.default};
		line-height: ${fontSize[22]};
		margin-bottom: ${spacing[28]};
	`;
});

const StatusContainer = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		font-size: ${fontSize[16]};
		color: ${theme.font.default};
		line-height: ${fontSize[22]};
		margin-bottom: ${spacing[28]};
	`;
});

const CopyContainer = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;

	${mediaQuery('xs')} {
		margin-bottom: ${spacing[16]};
	}
`;

const Account = styled.div`
	display: inline-flex;
	font-size: ${fontSize[16]};
	font-weight: ${fontWeight['regular']};
	line-height: ${fontSize[26]};

	${mediaQuery('xs')} {
		justify-content: flex-start;
	}
`;

const AccountNumber = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${theme.font.default};
		margin-right: ${spacing[6]};
	`;
});

const IconContainer = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		height: ${pxToRem(8)};
		width: ${pxToRem(10)};
		background-color: ${theme.button.transparent};
		border: 1px solid ${theme.font.default};
		transform: rotate(90deg);
		margin-right: ${spacing[8]};

		&::after {
			content: '';
			display: block;
			position: relative;
			top: -60%;
			right: -25%;
			height: ${pxToRem(8)};
			width: ${pxToRem(10)};
			border: 1px solid ${theme.font.default};
			background-color: ${theme.background.secondary};
		}
	`;
});

const CopyText = styled.p.attrs((props: { isCopied: boolean }) => props)`
	color: ${({ isCopied }) => isCopied ? '#2ea8e8' : '#B4B4B4'};
	font-size: ${fontSize[14]};
	line-height: ${fontSize[20]};
	margin-top: ${pxToRem(18)};
`;

export const WalletModal = ({ showModal, setShowModal, account }: Props) => {
	const { dispatch } = useStore();
	const [isCopied, setIsCopied] = useState(false);
	const { mobileWidth: isMobile } = useMedia('xs');

	const handleCopy = () => {
		setIsCopied(true);
		void navigator.clipboard.writeText(account);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	const handleDisconnect = async () => {
		await disconnect();
		setShowModal(false);
		dispatch({
			type: ButtonEnum.BUTTON,
			payload: button.CONNECT_WALLET
		});
	};

	return (
		<Portal
			handleClose={() => setShowModal(false)}
			isOpen={showModal}
			size={isMobile ? 'small' : 'xs'}>
			<ModalWrapper>
				<div>
					<AccountTitle>Account</AccountTitle>
					<StatusContainer>Connected with Metamask</StatusContainer>
					<Account>
						<AccountNumber>
							{account?.substring(0, 12)}...{account?.substring(37)}
						</AccountNumber>
						<JazzIcon />
					</Account>
					<CopyContainer>
						<IconContainer />
						<CopyText onClick={handleCopy} isCopied={isCopied}>
							{!isCopied ? 'Copy Address' : 'Copied!'}
						</CopyText>
					</CopyContainer>
				</div>
				<Button variant="secondary" onClick={handleDisconnect}>
					Disconnect
				</Button>
			</ModalWrapper>
		</Portal>
	);
};
