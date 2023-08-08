import styled, { css } from 'styled-components';
import { useFees } from '../../hooks';
import type { Theme, ThemeProps } from '../../styles';
import { DEFAULT_BORDER_RADIUS, DEFAULT_OUTLINE, DEFAULT_OUTLINE_OFFSET, spacing } from '../../styles';
import type { Fee } from '../../helpers';
import { beautifyNumbers, isArrayType, useStore } from '../../helpers';

const Summary = styled.summary(
	({ theme }: ThemeProps) => css`
		color: ${theme.font.default};
		margin-top: ${spacing[28]};
		cursor: pointer;

		&:focus-visible {
			outline-offset: ${DEFAULT_OUTLINE_OFFSET};
			outline: ${DEFAULT_OUTLINE(theme)};
		}

		&:active {
			outline: none;
		}
	`
);

const Details = styled.div(
	({ theme }: { theme: Theme }) => css`
		color: ${theme.font.secondary};
		margin-top: ${spacing[28]};
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[16]};
		margin: ${spacing[28]} 0 ${spacing[56]};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		border: 1px solid ${theme.border.default};

		& > * {
			display: flex;
			justify-content: space-between;
		}
	`
);

const DetailWrapper = styled.div`
	& > * {
		padding: ${spacing[4]} 0;
	}
`;

type Props = {
	value: Fee | Fee[];
};

const Detail = ({ value }: Props) => {
	const data = isArrayType(value) ? ( value as Fee[] ) : ( [ value ] as Fee[] );

	return !data[0].name ? (
		<>{beautifyNumbers({ n: data[0].amount, digits: 4 })} USDT</>
	) : (
		<DetailWrapper>
			<div>{data[0]?.name} Fee</div>
			<div>
				{data.map((fee: Fee) => (
					<div style={{ textAlign: 'right' }} key={fee.currency}>
						{fee.amount > 0 ? `${beautifyNumbers({ n: fee.amount })} ${fee.currency}` : '-'}
					</div>
				))}
			</div>
		</DetailWrapper>
	);
};

export const Fees = () => {
	const {
		state: { theme }
	} = useStore();
	const {
		withdrawFee,
		protocolFee,
		networkFee,
		cexFee,
		percentageOfAllFeesToAmount: percentage
	} = useFees();

	return (
		<details>
			<Summary color={theme.font.default} theme={theme}>
				{'Fee: '}
				{percentage && `${beautifyNumbers({ n: percentage, digits: 4 })}%`}
			</Summary>
			<Details theme={theme}>
				<Detail value={networkFee}/>
				<Detail value={protocolFee}/>
				<Detail value={cexFee}/>
				<Detail value={withdrawFee}/>
			</Details>
		</details>
	);
};
