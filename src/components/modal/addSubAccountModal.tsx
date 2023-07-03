import { useState } from 'react';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import { BASE_URL, useStore } from '../../helpers';
import { useAxios, useClickOutside } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { TextField } from '../textField/textField';
import { Portal } from './portal';

const Wrapper = styled.div(({ themeMode }: WrapperProps) => {
    const { state: { theme } } = useStore();

    return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
        justify-content: space-around;
		color: ${themeMode === 'dark' ? '#000000' : themeMode === 'light' ? '#ffffff' : theme.font.default};
		`;
});

const Title = styled.h2(() => {

    return css`
	text-align: center;
	font-size: ${fontSize[18]};
	font-weight: normal;
    margin: 0;
	margin-bottom: ${spacing[20]};
`;
});

const InputContainer = styled.div(() => {
    return css`
        width: 100%;
        margin-bottom: ${spacing[10]};
    `;
});

const SubmitBtn = styled.button((props: any) => {

    return css`
		background-color: ${!props.disabled ? '#20A100' : 'grey'};
		width: 100%;
		max-width: ${pxToRem(200)};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		border: none;
		padding: ${pxToRem(12)} 0;
		text-align: center;
		color: white;
		font-size: ${fontSize[16]};
        margin-bottom: ${spacing[20]};
		cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
        transition: transform 0.7 ease;

        &:hover {
            transform: scale(1.06);
        }
	`;
});

type WrapperProps = {
    themeMode?: string;
};

type AdditionalAccount = {
    id: number;
    address: string;
    nonce: string;
    is_confirmed: boolean;
};

type Props = {
    showModal: boolean;
    setShowModal: (showModal: boolean, account?: AdditionalAccount) => void;
};

export const AddSubAccountModal = ({ showModal, setShowModal }: Props) => {
    const api = useAxios();
    const { state: { theme } } = useStore();
    const [address, setAddress] = useState<string>('');
    const isValid = address.length >= 2;

    const domNode = useClickOutside(() => {
        setShowModal(false);
    });

    const handleChangeInput = (event: any) => {
        setAddress(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const obj = {
                address,
            };
            await api.request({
                method: 'POST',
                url: `${BASE_URL}account/wallet/`,
                data: obj,
            }).then((res) => {
                setAddress('');
                const newAcc: AdditionalAccount = res.data;
                setShowModal(false, newAcc);
                toast.success('Additional account has been successfully added!', { theme: theme.name });
            });

        } catch (error) {
            setAddress('');
            toast.error('Something went wrong please try again!', { theme: theme.name });
            setShowModal(false);
            console.log('something went wrong please try again!', error);
        }
    };

    return (
        <Portal
            size='xs'
            isOpen={showModal}
            handleClose={() => setShowModal(false)}
            hasBackButton={false}
            backgroundColor='light'
            closeOutside
            themeMode='light'>
            {/* @ts-ignore */}
            <Wrapper ref={domNode} themeMode='dark'>
                <InputContainer>
                    <Title>Provide your additional account address</Title>
                    <TextField
                        size='small'
                        themeMode='light'
                        align='center'
                        onChange={handleChangeInput}
                        placeholder=" Additional account address"
                        type="text"
                        value={address}
                        maxLength={50}
                    />
                </InputContainer>
                <SubmitBtn
                    disabled={!isValid}
                    onClick={handleSubmit}>
                    Submit
                </SubmitBtn>
            </Wrapper>
        </Portal>
    );
};