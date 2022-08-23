import { useEffect, useState } from 'react';
import styled from 'styled-components';
import destinationNetworks from '../../destinationNetworks.json';
import { Button } from '..';
import { spacing } from '../../styles';
import { SelectList } from '../../components';
import { Modal } from './modal';
import { useStore } from '../../helpers';

type NetworkTokenModalProps = {
	showModal: boolean;
	setShowModal: (prev: boolean) => void;
};

const ChildWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: ${spacing[56]} 0;
	justify-content: center;
	column-gap: ${spacing[28]};
	row-gap: ${spacing[22]};
`;

export const NetworkTokenModal = ({ showModal, setShowModal }: NetworkTokenModalProps) => {
	const [isDisabled, setIsDisabled] = useState(true);
	const { state: { destinationNetwork, destinationToken } } = useStore();

	useEffect(() => {
		setIsDisabled(() => (destinationNetwork === 'Select Network' || destinationToken === 'Select Token'));
	}, [destinationNetwork, destinationToken]);

	const networksList = Object.keys(destinationNetworks);
	// @ts-ignore
	const networkTokensList = destinationNetwork !== 'Select Network' && destinationNetworks[destinationNetwork].tokens;

	const handleSelectClick = (): void => {
		setShowModal(!showModal);
		console.log({
			destinationNetwork,
			destinationToken
		});
	};

	return (
		<div data-testid="network">
			<Modal
				showModal={showModal}
				setShowModal={setShowModal}
				background="mobile">
				<ChildWrapper>
					{networksList && networksList.length > 0 ? (
						<>
							<SelectList
								value="NETWORK"
								data={networksList}
								placeholder="Network Name" />
							<SelectList
								value="TOKEN"
								data={networkTokensList}
								placeholder="Token Name" />
						</>) : <div>No available networks...</div>}
					<Button
						disabled={isDisabled}
						onClick={handleSelectClick}>{isDisabled ? 'Please select Network and Token' : 'Select'}</Button>
				</ChildWrapper>
			</Modal>
		</div>
	);
};
