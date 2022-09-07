import { useEffect, useState } from 'react';
import styled from 'styled-components';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Button } from '..';
import { mediaQuery, spacing } from '../../styles';
import { SelectList } from '../../components';
import { Modal } from './modal';
import { DestinationNetworkEnum, useBreakpoint, useStore } from '../../helpers';

const ChildWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: ${spacing[56]} 0;
	justify-content: center;
	column-gap: ${spacing[28]};
	row-gap: ${spacing[22]};

	${mediaQuery('xs')} {
		flex-direction: column;
		flex-wrap: nowrap;
	}
`;

type Props = {
	showModal: boolean;
	setShowModal: (prev: boolean) => void;
};

export const NetworkTokenModal = ({ showModal, setShowModal }: Props) => {
	const { isBreakpointWidth } = useBreakpoint('xs');
	const [isDisabled, setIsDisabled] = useState(true);
	const [isMobile, setIsMobile] = useState(isBreakpointWidth);
	const [isShowList, setIsShowList] = useState(true);
	const {
		dispatch,
		state: { destinationNetwork, destinationToken }
	} = useStore();
	useEffect(() => {
		setIsMobile(isBreakpointWidth);
	}, [isBreakpointWidth]);
	useEffect(() => {
		setIsDisabled(
			() => destinationNetwork === 'Select Network' || destinationToken === 'Select Token'
		);
	}, [destinationNetwork, destinationToken]);

	const networksList = Object.keys(destinationNetworks);
	const networkTokensList =
		destinationNetwork !== 'Select Network' &&
		// @ts-ignore
		Object.keys(destinationNetworks?.[destinationNetwork]?.['tokens']);

	const handleSubmit = () => {
		setShowModal(!showModal);
	};

	const handleBack = () => {
		setIsShowList(true);
		dispatch({ type: DestinationNetworkEnum.TOKEN, payload: 'Select Token' });
	};

	return !isMobile ? (
		<div data-testid="network">
			<Modal showModal={showModal} setShowModal={setShowModal} background="mobile">
				<ChildWrapper>
					{networksList && networksList.length > 0 ? (
						<>
							<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
							<SelectList value="TOKEN" data={networkTokensList} placeholder="Token Name" />
						</>
					) : (
						<div>No available networks...</div>
					)}
					<Button disabled={isDisabled} onClick={handleSubmit} color="default">
						{isDisabled ? 'Please select Network and Token' : 'Select'}
					</Button>
				</ChildWrapper>
			</Modal>
		</div>
	) : (
		<div data-testid="network">
			<Modal showModal={showModal} setShowModal={setShowModal} background="mobile">
				<ChildWrapper>
					{networksList && networksList.length > 0 ? (
						<>
							{isShowList && (
								<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
							)}
							{!isShowList && (
								<SelectList value="TOKEN" data={networkTokensList} placeholder="Token Name" />
							)}
						</>
					) : (
						<div>No available networks...</div>
					)}
					{isShowList && (
						<Button
							onClick={() => setIsShowList(false)}
							// @ts-ignore
							color={destinationNetwork !== 'Select Network' ? 'transparent' : 'default'}
							disabled={destinationNetwork === 'Select Network'}>
							NEXT
						</Button>
					)}
					{!isShowList && (
						<Button disabled={isDisabled} onClick={handleSubmit} color="default">
							{isDisabled ? 'Please select Network and Token' : 'Select'}
						</Button>
					)}
					{!isShowList && (
						<Button onClick={handleBack} color="default">
							BACK
						</Button>
					)}
				</ChildWrapper>
			</Modal>
		</div>
	);
};
