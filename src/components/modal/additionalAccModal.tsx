import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Portal } from '..';
import { useStore } from '../../helpers';
import { useMedia } from '../../hooks';
import { fontSize, mediaQuery, pxToRem, spacing } from '../../styles';

const ModalWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing[8]};
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
		margin-bottom: ${spacing[20]};
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


const LinkContainer = styled.div(() => {
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

const Link = styled.a(() => {
    const {
        state: { theme }
    } = useStore();

    return css`
    &:visited {
		color: ${theme.font.default};
    }
    `;
});

const CopyText = styled.p.attrs((props: { isCopied: boolean }) => props)`
	color: ${({ isCopied }) => isCopied ? '#2ea8e8' : '#B4B4B4'};
	font-size: ${fontSize[14]};
	line-height: ${fontSize[20]};
	margin-top: ${pxToRem(18)};
`;

type Props = {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    link: string;
    isCopied?: boolean;
};

export const AdditionalAccModal = ({ showModal, setShowModal, link }: Props) => {
    const [isCopied, setIsCopied] = useState(false);
    const { mobileWidth: isMobile } = useMedia('xs');

    const handleCopy = () => {
        setIsCopied(true);
        void navigator.clipboard.writeText(link);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <Portal
            handleClose={() => setShowModal(false)}
            isOpen={showModal}
            size={isMobile ? 'small' : 'xs'}>
            <ModalWrapper>
                <div>
                    <AccountTitle>Special Link</AccountTitle>
                    <LinkContainer>
                        <Link href='https://app.cryptoyou.io/'>
                            {link}
                        </Link>
                    </LinkContainer>
                    <CopyContainer>
                        <IconContainer />
                        <CopyText onClick={handleCopy} isCopied={isCopied}>
                            {!isCopied ? 'Copy Link' : 'Copied!'}
                        </CopyText>
                    </CopyContainer>
                </div>
            </ModalWrapper>
        </Portal>
    );
};