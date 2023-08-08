import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../../components';
import { useStore } from '../../helpers';
import type { ThemeProps } from '../../styles';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_OUTLINE_OFFSET,
	DEFAULT_TRANSITION,
	HORIZONTAL_PADDING,
	fontSize,
	pxToRem,
	spacing
} from '../../styles';

export type AlignProps = 'left' | 'right' | 'center';
export type TypeProps = 'text' | 'number' | 'search' | 'email' | 'radio' | 'checkbox';
export type SizeProps = 'regular' | 'small';
export type ThemeModeProps = 'light' | 'dark' | 'auto';

type StyledProps = {
	align: AlignProps;
	error: boolean;
	type: TypeProps;
	size: SizeProps;
	themeMode: ThemeModeProps;
};

const TextFieldWrapper = styled.div`
	position: relative;
`;

const Input = styled.input(({ align, error, type, size, themeMode }: StyledProps) => {
	const {
		state: { theme }
	} = useStore();

	const isTypeNumber = type === 'number';
	const isTypeSearch = type === 'search';
	const isSmall = size === 'small';

	return css`
		background: none;
		text-align: ${isTypeSearch ? 'left' : align};
		font-size: ${fontSize[16]};
		line-height: ${fontSize[20]};
		padding: ${isTypeSearch
			? `${spacing[isSmall ? 8 : 14]} ${spacing[14]} ${spacing[isSmall ? 8 : 14]} ${spacing[42]}`
			: `${spacing[isSmall ? 12 : 18]} ${spacing[HORIZONTAL_PADDING]}`};
		color: ${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default};
		border: 1px solid ${error && isTypeNumber ? theme.button.error : theme.border.default};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		cursor: pointer;
		transition: ${DEFAULT_TRANSITION};
		width: ${isTypeSearch ? '100%' : `calc(100% - ${pxToRem(HORIZONTAL_PADDING * 2 + 2)})`};
		outline: 1px solid transparent;

		&:hover,
		&:active {
			border-color: ${error && isTypeNumber ? theme.button.error : theme.font.secondary};
			outline: none;
		}

		&:focus-visible {
			outline-offset: ${DEFAULT_OUTLINE_OFFSET};
			outline: 1px solid ${error && isTypeNumber ? theme.button.error : theme.border.secondary};
		}

		&-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		&[type='search']::-webkit-search-cancel-button {
			// TODO: do we not want a cancel button within the search?
			-webkit-appearance: none;
			appearance: none;
		}

		&[type='number'] {
			-moz-appearance: textfield;
		}
	`;
});

const Message = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Description = styled.div`
	color: ${(props: ThemeProps) => props.theme.font.secondary};
	margin: ${spacing[4]} 0;
`;

const Error = styled.div`
	margin: ${spacing[4]} 0;
	color: ${(props: ThemeProps) => props.theme.button.error};
`;

type Props = {
	placeholder?: string;
	disabled?: boolean;
	type?: TypeProps;
	value: string | boolean | number;
	description?: string;
	error?: boolean;
	size?: SizeProps;
	onChange?: (e?: any) => void;
	align?: AlignProps;
	required?: boolean;
	name?: string;
	id?: string;
	checked?: boolean;
	maxLength?: any;
	autocomplete?: string;
	themeMode?: string;
	isLoading?: boolean;
};

export const TextField = ({
	placeholder,
	disabled = false,
	type = 'text',
	value,
	onChange,
	description,
	error,
	size = 'regular',
	align = 'center',
	required = false,
	name,
	id,
	checked = false,
	maxLength,
	autocomplete = 'on',
	themeMode = 'auto',
	isLoading = false
}: Props) => {
	const {
		state: { theme }
	} = useStore();
	const [isActive, setIsActive] = useState(false);
	const isTypeSearch = type === 'search';

	const textField = (
		<>
			{/* @ts-ignore */}
			<Input
				placeholder={placeholder}
				disabled={disabled}
				onChange={onChange}
				align={align}
				value={!isLoading ? value : ''}
				type={type}
				size={size}
				error={error}
				onBlur={() => setIsActive(true)}
				onFocus={() => setIsActive(false)}
				required={required}
				name={name}
				id={id}
				checked={checked}
				maxLength={maxLength}
				autocomplete={autocomplete}
				themeMode={themeMode}
			/>
			{isTypeSearch && (
				<Icon
					icon="search"
					size={20}
					style={{
						position: 'absolute',
						transform: ' translate(-50%, -50%)',
						top: '50%',
						left: 20
					}}
				/>
			)}
			{isLoading && (
				<Icon
					icon='spinnerAnimated'
					size={25}
					style={{
						position: 'absolute',
						transform: ' translate(-50%, -50%)',
						top: '50%',
						left: '50%'
					}}
				/>
			)}
			{(error || description) && type === 'text' && (
				<Message>
					{description && <Description theme={theme}>{description}</Description>}
					{error && isActive && <Error theme={theme}>Invalid input</Error>}
				</Message>
			)}
		</>
	);

	return isTypeSearch ? <TextFieldWrapper>{textField}</TextFieldWrapper> : isLoading ? <TextFieldWrapper>{textField}</TextFieldWrapper> : textField;
};
