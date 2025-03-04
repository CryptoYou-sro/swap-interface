import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../components';
import { KycL2LegalModal } from '../../components/modal/kycL2LegalModal';
import { KycL2BusinessStatusEnum, KycL2StatusEnum, useStore } from '../../helpers';
import { useMedia } from '../../hooks';
import { fontSize, pxToRem, spacing } from '../../styles';

const KYCL2Wrapper = styled.div(() => {
	const { mobileWidth: isMobile } = useMedia('s');

	return css`
	margin: 0 auto;
	margin-top: ${spacing[24]};
	margin-bottom: ${spacing[10]};
	width: 100%;
	text-align: center;
	font-size: ${fontSize[14]};
	padding-top: ${isMobile ? `${spacing[20]}` : `${spacing[80]}`};
`;
});

const WrapperSocial = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		display: flex;
		flex-direction: column;
		align-items: center;
		color: ${theme.font.secondary};
		width: 100%;
		font-size: ${pxToRem(13)};
	`;
});

const SocialContainer = styled.div(() => {

	return css`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	`;
});

const LinkContainer = styled.div(() => {

	return css`
		text-align: center;
		display: flex;
		align-items: baseline;
		justify-content: center;
		flex-wrap: wrap;
		font-size: ${pxToRem(13)};
		margin-bottom: ${spacing[14]};
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


const CopyrightText = styled.p(() => {
	const { mobileWidth } = useMedia('s');

	return css`
		margin: ${!mobileWidth ? `0 0 ${spacing[6]} ${pxToRem(46)}` : null};
	`;
});

export const Footer = () => {
	const {
		state: {
			isUserVerified,
			account,
			kycL2Business,
			kycL2Status
		}
	} = useStore();

	const [showKycL2, setShowKycL2] = useState(false);

	useEffect(() => {
		setShowKycL2(false);
	}, [account]);

	return (
		<KYCL2Wrapper>
			{isUserVerified && account && kycL2Status === KycL2StatusEnum.PASSED && (kycL2Business === KycL2BusinessStatusEnum.INITIAL || kycL2Business === KycL2BusinessStatusEnum.BASIC) ? (
				<Button variant="pure" onClick={() => setShowKycL2(true)} color="default">
					Verify as a business
				</Button>
			) : null}
			<WrapperSocial>
				<SocialContainer>
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
					<CopyrightText>
						© Copyright 2022 - CryptoYou s.r.o. - Vinohradská 2030/44 - 12000 Prague - Czechia.
					</CopyrightText>
					<CopyrightText>
						Company registered in the Commercial Register of Prague under the Identification Number (IČ): 10746358
					</CopyrightText>
				</SocialContainer>
			</WrapperSocial>

			<KycL2LegalModal showKycL2={showKycL2} updateShowKycL2={setShowKycL2} />
		</KYCL2Wrapper>
	);
};
