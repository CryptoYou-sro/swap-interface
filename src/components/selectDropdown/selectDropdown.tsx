import SelectDropDown from 'react-select';
import makeAnimated from 'react-select/animated';
import { useStore } from '../../helpers';
import { pxToRem } from '../../styles';

type Props = {
	onChange?: (e?: any) => void;
	name?: string;
	id?: string;
	placeholder?: string;
	defaultValue?: any;
	options?: any;
	isMulti?: boolean;
	components?: any;
	isSearchable?: boolean;
	styles?: any;
	themeMode?: string;
};

export const SelectDropdown = ({
	onChange,
	defaultValue,
	name,
	id,
	placeholder,
	options,
	isMulti = true,
	isSearchable = true,
	themeMode = 'auto'
}: Props) => {
	const {
		state: { theme }
	} = useStore();

	const animatedComponents = makeAnimated();
	const selectDropDownStyles: any = {
		multiValueRemove: (styles: any): any => ({
			...styles,
			color: 'red',
			':hover': {
				backgroundColor: 'red',
				color: 'white'
			}
		}),
		menu: (base: any): any => ({
			...base,
			backgroundColor: `${themeMode === 'light' ? '#ffffff' : themeMode === 'dark' ? '#000000' : theme.background.secondary}`,
		}),
		option: (base: any, state: any): any => ({
			...base,
			border: state.isFocused ? `1px solid ${theme.border.default}` : 'none',
			height: '100%',
			color: `${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default}`,
			backgroundColor: `${themeMode === 'light' ? '#ffffff' : themeMode === 'dark' ? '#000000' : theme.background.secondary}`,
			cursor: 'pointer',

		}),
		control: (baseStyles: any): any => ({
			...baseStyles,
			borderColor: 'grey',
			background: 'none',
			color: `${theme.font.default}`,
			minHeight: `${pxToRem(46)}`,
			padding: 0
		}),
		input: (provided: any): any => ({
			...provided,
			color: `${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default}`,
		}),
	};

	return (
		<SelectDropDown
			onChange={onChange}
			defaultValue={defaultValue}
			name={name}
			id={id}
			placeholder={placeholder}
			options={options}
			isMulti={isMulti}
			components={animatedComponents}
			isSearchable={isSearchable}
			styles={selectDropDownStyles}
		/>
	);
};
