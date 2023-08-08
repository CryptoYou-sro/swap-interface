import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Spinner } from '../../components';
import { isLightTheme, useStore } from '../../helpers';
import type { ColorType } from '../../styles';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_OUTLINE_OFFSET,
	DEFAULT_TRANSITION,
	fontWeight,
	MAIN_MAX_WIDTH,
	pxToRem
} from '../../styles';

interface CommonProps {
	children: ReactNode;
	disabled?: boolean;
	isLoading?: boolean;
	onClick: () => void;
}

interface PrimaryProps {
	variant?: 'primary';
	color?: 'default' | 'transparent';
}

interface PureProps {
	variant: 'pure';
	color?: 'default';
}

type SecondaryProps = {
	variant: 'secondary';
} & { color?: ColorType };

type IndividualProps = PrimaryProps | SecondaryProps | PureProps;
export type ButtonProps = IndividualProps & CommonProps;

const StyledButton = styled.button((props: ButtonProps) => {
	const isPrimary = props.variant === 'primary';
	const isSecondary = props.variant === 'secondary';
	const isPure = props.variant === 'pure';
	const isColorDefault = props.color === 'default';
	const isPrimaryTransparent = props.variant === 'primary' && props.color === 'transparent';
	const isSecondaryDefault = isSecondary && (props.color === 'default' || !props.color);
	const {
		state: { theme }
	} = useStore();

	return css`
		display: ${props.isLoading ? 'inline-flex' : 'inline-block'};
		align-items: center;
		justify-content: ${props.isLoading ? 'center' : 'space-between'};
		max-width: ${isPrimary ? MAIN_MAX_WIDTH : pxToRem(160)};
		width: 100%;
		font-weight: ${isPrimary ? fontWeight.semibold : fontWeight.regular};
		cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
		font-size: ${isPrimary ? pxToRem(16) : pxToRem(14)};
		min-height: ${isPrimary ? pxToRem(57) : pxToRem(35)};
		padding: ${pxToRem(4)} ${pxToRem(12)};
		color: ${isPure
			? theme.font.default
			: isSecondaryDefault || isPrimaryTransparent
				? theme.button.default
				: '#FFF'};
		background-color: ${isPure || isSecondaryDefault || isPrimaryTransparent
			? theme.button.transparent
			: props.disabled
				? theme.button.disabled
				: theme.button[props.color!]};
		border: 1px solid
			${isSecondaryDefault || isPrimaryTransparent
			? theme.button.default
			: isPure || isColorDefault
				? theme.button.transparent
				: '#FFF'};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		transition: ${DEFAULT_TRANSITION};
		margin: ${isSecondaryDefault && '1px'};
		cursor: ${props.disabled && 'not-allowed'};
		outline: 1px solid transparent;

		&[disabled] {
			border-color: ${isPrimary ? theme.button.disabled : props.color};
			color: ${!isPrimary || isPrimaryTransparent ? theme.button.disabled : '#FFF'};
		}

		&:hover {
			opacity: ${!isSecondaryDefault && '0.8'};
			box-shadow: ${isSecondaryDefault && `0 0 0 1px ${theme.button.default}`};
		}

		&:focus-visible {
			outline-offset: ${DEFAULT_OUTLINE_OFFSET};
			outline: 1px solid
				${isPrimary
			? theme.button.default
			: isPure
				? theme.background.secondary
				: isLightTheme(theme)
					? theme.button[props.color!]
					: '#FFF'};
		}

		&:active {
			outline: none;
		}
	`;
});

export const Button = ({
	children,
	variant = 'primary',
	color = 'default',
	disabled = false,
	isLoading,
	onClick
}: ButtonProps) => {
	return (
		// @ts-ignore
		<StyledButton
			color={color}
			variant={variant}
			disabled={disabled}
			onClick={onClick}
			aria-label="button"
			isLoading={isLoading}>
			{isLoading ? <Spinner color={color} /> : children}
		</StyledButton>
	);
};
