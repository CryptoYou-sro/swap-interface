import styled, { css } from 'styled-components';
import { Portal } from './portal';
import { useEffect, useState } from 'react';
import { spacing } from '../../styles';
import { useStore } from '../../helpers';

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
`;

const Title = styled.h2`
	margin: 0 0 ${spacing[12]} 0;
`;

const Text = styled.div``;

const LinkContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
`;

const Link = styled.a(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		text-decoration: none;
		color: ${theme.font.default};

		&:hover {
			text-decoration: underline;
		}
	`;
});

type Props = {
	showStatusKycL2Modal?: boolean;
	updateStatusKycL2Modal?: any;
};
export const StatusKycL2Modal = ({ showStatusKycL2Modal, updateStatusKycL2Modal }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);

	const handleClose = () => {
		setShowModal(false);
		updateStatusKycL2Modal(false);
	};

	useEffect(() => {
		setShowModal(showStatusKycL2Modal as boolean);
	}, [showStatusKycL2Modal]);

	return (
		<Portal isOpen={showModal} handleClose={handleClose} size="small">
			<Wrapper>
				<Title>KYC STATUS</Title>
				<Text>
					Your documents are under review, please wait for the results of the verification!
				</Text>
				<LinkContainer>
					<Link href="https://cryptoyou.io/" target="_blank" rel="noopener noreferrer">
						CryptoYou.io
					</Link>
				</LinkContainer>
			</Wrapper>
		</Portal>
	);
};
