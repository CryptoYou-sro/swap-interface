import 'jest-styled-components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../helpers';
import { lightTheme } from '../../styles';
import { Button } from './button';
import { pxToRem } from '../../styles';

const onCheckStyles = (button: string) => {
	if (button === 'primary default') {
		return expect(screen.getByText(/Primary default Button/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.default
			}; color: #FFF; border: 1px solid transparent; max-width: ${pxToRem(428)}; cursor: pointer;`
		);
	} else if (button === 'secondary default') {
		return expect(screen.getByText(/Secondary default Button/)).toHaveStyle(
			`background-color: transparent; color: ${lightTheme.button.default}; border: 1px solid ${
				lightTheme.button.default
			}; max-width: ${pxToRem(160)}`
		);
	} else if (button === 'secondary icon') {
		return expect(screen.getByText(/Secondary icon Button/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.icon
			}; color: #FFF; border: 1px solid #FFF; max-width: ${pxToRem(160)}`
		);
	} else if (button === 'secondary warning') {
		return expect(screen.getByText(/Secondary warning Button/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.warning
			}; color: #FFF; border: 1px solid #FFF; max-width: ${pxToRem(160)}`
		);
	} else if (button === 'secondary error') {
		return expect(screen.getByText(/Secondary error Button/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.error
			}; color: #FFF; border: 1px solid #FFF; max-width: ${pxToRem(160)}`
		);
	} else if (button === 'secondary primary disabled') {
		return expect(screen.getByText(/Secondary primary disabled/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.disabled
			}; color: #FFF; border: 1px solid transparent; max-width: ${pxToRem(428)}`
		);
	} else if (button === 'secondary pure') {
		return expect(screen.getByText(/Secondary pure Button/)).toHaveStyle(
			`background-color: transparent; color: #FFF; border: 1px solid transparent; max-width: ${pxToRem(
				160
			)}`
		);
	}
};

describe('Button Component', () => {
	it('should render a default button', () => {
		const { getByText, getByRole } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')}>Primary default Button</Button>
			</AuthProvider>
		);
		onCheckStyles('primary');
		expect(getByText(/Primary default Button/)).toMatchSnapshot();

		const btn = getByText(/Primary default Button/);
		userEvent.hover(btn);
		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a secondary default button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'}>
					Secondary default Button
				</Button>
			</AuthProvider>
		);
		onCheckStyles('secondary default');

		expect(getByText(/Secondary default Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary default Button/);
		userEvent.hover(btn);
		expect(btn).toHaveStyleRule('box-shadow', `0 0 0 1px ${lightTheme.button.default}`, {
			modifier: ':hover'
		});
	});
	it('should render a secondary icon button', () => {
		const { getByText, getByRole } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant="secondary" icon="moonbeam">
					Secondary icon Button
				</Button>
			</AuthProvider>
		);
		onCheckStyles('secondary icon');

		expect(getByRole('img')).toBeInTheDocument();
		expect(getByText(/Secondary icon Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary icon Button/);
		userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a secondary warning button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'} color={'warning'}>
					Secondary warning Button
				</Button>
			</AuthProvider>
		);
		onCheckStyles('secondary warning');

		expect(getByText(/Secondary warning Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary warning Button/);
		userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a secondary error button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'} color={'error'}>
					Secondary error Button
				</Button>
			</AuthProvider>
		);
		onCheckStyles('secondary error');

		expect(getByText(/Secondary error Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary error Button/);
		userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a primary disabled button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'primary'} disabled>
					Secondary primary disabled Button
				</Button>
			</AuthProvider>
		);
		onCheckStyles('secondary primary disabled');

		expect(getByText(/Secondary primary disabled Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary primary disabled Button/);
		userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a pure button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'pure'}>
					Secondary pure Button
				</Button>
			</AuthProvider>
		);
		onCheckStyles('secondary pure');

		expect(getByText(/Secondary pure Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary pure Button/);
		userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});
});
