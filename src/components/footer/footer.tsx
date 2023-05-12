import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../components';
import { KycL2LegalModal } from '../../components/modal/kycL2LegalModal';
import { KycL2BusinessStatusEnum, useStore } from '../../helpers';
import { useMedia } from '../../hooks';
import { fontSize, pxToRem, spacing } from '../../styles';

const KYCL2Wrapper = styled.div(() => {
	const { mobileWidth: isMobile } = useMedia('s');

	return css`
	/* outline: 1px solid red; */
	margin: 0 auto;
	margin-top: ${spacing[24]};
	margin-bottom: ${spacing[10]};
	width: 100%;
	text-align: center;
	/* max-width: ${pxToRem(720)}; */
	text-align: center;
	font-size: ${fontSize[14]};
	padding-top: ${isMobile ? `${spacing[20]}` : `${spacing[80]}`};
`;
});

const VerifyContainer = styled.div`
/* outline: 1px solid blue; */
`;

const LinkContainer = styled.div(() => {

	return css`
		/* outline: 1px solid orange; */
		text-align: center;
		display: flex;
		align-items: baseline;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: ${spacing[8]};
		padding-top: ${spacing[20]};
		width: 100%;
	`;
});

const Link = styled.a(() => {
	const { state: { theme } } = useStore();

	return css`
	 color: ${theme.font.default};
	 text-decoration: none;
	 font-weight: 400;
	 line-height: ${pxToRem(21)};
	 margin-right: ${spacing[6]};

	 &:hover {
			color: ${theme.button.default};
			text-decoration: underline;
		}
	`;
});

const Span = styled.span(() => {
	const { state: { theme } } = useStore();

	return css`
		margin-right: ${spacing[6]};
		color: ${theme.font.select};
	`;
});

const CopyRightContainer = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		text-align: center;
		color: ${theme.font.secondary};
		width: 100%;
		
	`;
});

const CopyrightText = styled.p`
	margin-top: 0;
	margin-bottom: 0;
`;

export const Footer = () => {
	const { mobileWidth: isMobile } = useMedia('s');
	const {
		state: {
			isUserVerified,
			account,
			kycL2Business
		}
	} = useStore();

	const [showKycL2, setShowKycL2] = useState(false);

	useEffect(() => {
		setShowKycL2(false);
	}, [account]);

	return (
		<KYCL2Wrapper>
			{isUserVerified && account && (kycL2Business === KycL2BusinessStatusEnum.INITIAL || kycL2Business === KycL2BusinessStatusEnum.BASIC) ? (
				<VerifyContainer>
					<Button variant="pure" onClick={() => setShowKycL2(true)} color="default">
						Verify as a business
					</Button>
				</VerifyContainer>
			) : null}
			<LinkContainer>
				<Link href='https://cryptoyou.io/blog/' target='_blank' rel='noopener noreferrer'>Blog</Link>
				<Span>-</Span>
				<Link href='https://cryptoyou.io/about-us/' target='_blank' rel='noopener noreferrer'>About Us</Link>
				<Span>-</Span>
				<Span>Follow us on</Span>
				<Link href='https://twitter.com/Cryptoyou_io' target='_blank' rel='noopener noreferrer'>Twitter</Link>
				<Span>or</Span>
				<Link href='https://www.linkedin.com/company/cryptoyou-cross-chain-swap/' target='_blank' rel='noopener noreferrer'>LinkedIn</Link>
				<Span>-</Span>
				<Link href='https://cryptoyou.io/contact-us/' target='_blank' rel='noopener noreferrer'>Contact Us</Link>
				<Span>-</Span>
				<Link href='https://cryptoyou.io/terms-of-use/' target='_blank' rel='noopener noreferrer'>Term of Use</Link>
				<Span>-</Span>
				<Link href='https://cryptoyou.io/privacy-policy/' target='_blank' rel='noopener noreferrer'>Privacy Policy</Link>
			</LinkContainer>
			<CopyRightContainer>
				<div>
					<CopyrightText style={{ marginRight: `${!isMobile && pxToRem(86)}` }}>
						© Copyright 2022 - CryptoYou s.r.o. - Vinohradská 2030/44 - 12000 Prague - Czechia.
					</CopyrightText>
					<CopyrightText style={{ marginLeft: `${!isMobile && pxToRem(56)}` }}>
						Company registered in the Commercial Register of Prague under the Identification Number (IČ): 10746358
					</CopyrightText>
				</div>
			</CopyRightContainer>

			<KycL2LegalModal showKycL2={showKycL2} updateShowKycL2={setShowKycL2} />
		</KYCL2Wrapper>
	);
};
