import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useDisconnect } from 'wagmi';
import { Portal } from '..';
import { useStore } from '../../helpers';
import { useClickOutside, useMedia } from '../../hooks';
import { fontSize, mediaQuery, pxToRem, spacing } from '../../styles';

const ModalWrapper = styled.div(({ themeMode }: any) => {
    const {
        state: { theme }
    } = useStore();

    return css`
    width: 100%;
    color: ${themeMode === 'dark' ? '#000000' : themeMode === 'light' ? '#ffffff' : theme.font.default};
`;
});

const AccountWrapper = styled.div(() => {
    return css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;        
    `;
});

const AccountTitle = styled.h1(() => {
    return css`
        font-size: ${fontSize[18]};
        line-height: ${fontSize[22]};
        margin: 0;
    `;
});

const CopyContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    justify-content: flex-end;

    ${mediaQuery('xs')} {
        margin-bottom: ${spacing[16]};
    }
`;


const LinkContainer = styled.div(() => {
    const { mobileWidth: isMobile } = useMedia('s');

    return css`
        margin: 0;
        margin-right: ${spacing[6]};
        margin-bottom: ${spacing[10]};
        word-break: break-all;
        width: 100%;
        max-width: ${isMobile ? pxToRem(260) : pxToRem(450)};
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
        border: 1px solid black;
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
            border: 1px solid black;
            background-color: white;
        }
    `;
});

const TextLink = styled.p(() => {
    return css`
        cursor: pointer;
        text-align: left;
        margin-bottom: 0;

        &:hover {
            text-decoration: underline;
        }
    `;
});

const CopyText = styled.p.attrs((props: { isCopied: boolean }) => props)`
    color: ${({ isCopied }) => isCopied ? '#2ea8e8' : '#000000'};
    font-size: ${fontSize[14]};
    line-height: ${fontSize[20]};
    margin-top: ${pxToRem(18)};
`;

const ConfirmedText = styled.p(() => {
    return css`
    font-size: ${fontSize[18]};
    `;
});

type AdditionalAccount = {
    id: number;
    address: string;
    nonce: string;
    is_confirmed: boolean;
};

type Props = {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    account: AdditionalAccount;
    isCopied?: boolean;
};

export const SubAccountModal = ({ showModal, setShowModal, account }: Props) => {
    const { disconnect } = useDisconnect();
    const [isCopied, setIsCopied] = useState(false);
    const isConfirmed = account.is_confirmed;

    const handleCopy = () => {
        setIsCopied(true);
        void navigator.clipboard.writeText(`https://app.cryptoyou.io/?address=${account.address}&nonce=${account.nonce}`);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const domNode = useClickOutside(() => {
        setShowModal(false);
    });

    const handleLink = () => {
        disconnect();
        window.location.href = `https://app.cryptoyou.io/?address=${account.address}&nonce=${account.nonce}`;
    };


    return (
        <Portal
            size='small'
            isOpen={showModal}
            handleClose={() => setShowModal(false)}
            hasBackButton={false}
            backgroundColor='light'
            themeMode='light'>
            {/* @ts-ignore */}
            <ModalWrapper ref={domNode} themeMode='dark'>
                {!isConfirmed ? (
                    <AccountWrapper>
                        <AccountTitle>Verification link</AccountTitle>
                        <p>To verify your additional account, follow the link below and log in to your additional account.</p>
                        <LinkContainer>
                            <TextLink onClick={handleLink}>
                                https://app.cryptoyou.io/?address=${account.address}&nonce=${account.nonce}
                            </TextLink>
                        </LinkContainer>
                        <CopyContainer>
                            <IconContainer />
                            <CopyText onClick={handleCopy} isCopied={isCopied}>
                                {!isCopied ? 'Copy Link' : 'Copied!'}
                            </CopyText>
                        </CopyContainer>
                    </AccountWrapper>
                ) : (
                    <ConfirmedText>
                        Account
                        <span style={{ fontWeight: 'bold' }}> {account.address.slice(0, 10)}...{account.address.slice(-5)} </span>
                        already confirmed!
                    </ConfirmedText>
                )}
            </ModalWrapper>
        </Portal>
    );
};