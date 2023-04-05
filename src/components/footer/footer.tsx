import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { spacing } from '../../styles';
import { KycL2LegalModal } from '../../components/modal/kycL2LegalModal';
import { Button } from '../../components';
import { KycL2BusinessStatusEnum, useStore } from '../../helpers';

const KYCL2Wrapper = styled.div`
	margin-top: ${spacing[26]};
	margin-bottom: ${spacing[26]};
	width: 100%;
	text-align: center;
`;

export const Footer = () => {
	const {
		state: {
			isUserVerified,
			account,
			kycL2Business
		}
	} = useStore();

	const [ showKycL2, setShowKycL2 ] = useState(false);

	useEffect(() => {
		setShowKycL2(false);
	}, [ account ]);

	return (
		<KYCL2Wrapper>
			{isUserVerified && account && ( kycL2Business === KycL2BusinessStatusEnum.INITIAL || kycL2Business === KycL2BusinessStatusEnum.BASIC ) ? (
				<Button variant="pure" onClick={() => setShowKycL2(true)} color="default">
					Verify as a business
				</Button>
			) : null}
			<KycL2LegalModal showKycL2={showKycL2} updateShowKycL2={setShowKycL2}/>
		</KYCL2Wrapper>
	);
};
