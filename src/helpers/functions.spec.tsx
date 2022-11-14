import { lightTheme, darkTheme } from '../styles';
import { isLightTheme, beautifyNumbers, isNetworkSelected, isTokenSelected } from '../helpers';

describe('Helpers should return the correct values', () => {
	it(' isLightTheme() function should return the correct theme', () => {
		expect(isLightTheme(lightTheme)).toBeTruthy();
		expect(isLightTheme(darkTheme)).not.toBeTruthy();
	});

	it('beautifyNumbers() function should return the correct value', () => {
		expect(beautifyNumbers({ n: '12.00000000001', digits: 11 })).toBe('12.00000000001');
		expect(beautifyNumbers({ n: '12.0010000000' })).toBe('12.001');
		expect(beautifyNumbers({ n: 12.00000000001, digits: 11 })).toBe('12.00000000001');
		expect(beautifyNumbers({ n: 12.001 })).toBe('12.001');
	});

	it('isNetworkSelected() function should return the correct value', () => {
		expect(isNetworkSelected('Select Network')).toBe(false);
		expect(isNetworkSelected('')).toBe(false);
		expect(isNetworkSelected('BNB')).toBe(true);
	});

	it('isTokenSelected() function should return the correct value', () => {
		expect(isTokenSelected('Select Token')).toBe(false);
		expect(isTokenSelected('')).toBe(false);
		expect(isTokenSelected('ETH')).toBe(true);
	});
});
