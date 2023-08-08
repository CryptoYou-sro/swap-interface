import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import countries from '../../data/countries.json';
import COUNTRIES from '../../data/listOfAllCountries.json';
import { BASE_URL, getTodaysDate, useStore } from '../../helpers';
import { useAxios, useMedia } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { SelectDropdown } from '../selectDropdown/selectDropdown';
import { TextField } from '../textField/textField';
import { ContentTitle, WrapContainer } from './kycL2LegalModal';
import { Portal } from './portal';

const Wrapper = styled.div(({ themeMode }: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};
		color: ${themeMode === 'dark' ? '#000000' : themeMode === 'light' ? '#ffffff' : theme.font.default};
	`;
});

const Select = styled.select(({ themeMode }: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		width: 100%;
		height: 100%;
		max-height: ${pxToRem(46)};
		color: ${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default};
		background-color: transparent;
		border-radius: ${DEFAULT_BORDER_RADIUS};

		option {
			color: ${theme.font.default};
			background: ${theme.background.default};
		}
	`;
});

const DateInput = styled.input((props: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		padding: 0 6px;
		cursor: pointer;
		background: none;
		color: ${props.themeMode === 'light' ? '#000' : theme.font.default};
		min-height: ${pxToRem(45)};
		border: 1px solid ${theme.border.default};
		border-radius: ${DEFAULT_BORDER_RADIUS};

		::-webkit-calendar-picker-indicator {
			color: transparent;
			opacity: 1;
			background: url(https://cdn-icons-png.flaticon.com/512/591/591576.png) no-repeat center;
			background-size: contain;
		}
	`;
});

const SubmitBtn = styled.button((props: any) => {

	return css`
		background-color: ${!props.disabled ? '#20A100' : 'grey'};
		width: 100%;
		max-width: ${pxToRem(430)};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		border: none;
		padding: ${pxToRem(16)} 0;
		text-align: center;
		color: white;
		font-size: ${fontSize[18]};
		line-height: ${pxToRem(25)};
		max-height: ${pxToRem(55)};
		cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
	`;
});

type Props = {
	addSupervisor?: boolean;
	updateSupervisorModalShow?: any;
};
export const SupervisoryMembers = ({
	addSupervisor = false,
	updateSupervisorModalShow
}: Props) => {
	const {
		state: { theme }
	} = useStore();
	const { mobileWidth: isMobile } = useMedia('s');
	const today = getTodaysDate();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [client, setClient] = useState<any>({
		fullName: '',
		dateOfBirth: '',
		placeOfBirth: '',
		gender: 'Select gender',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		citizenship: [],
		appliedSanctions: ''
	});

	const [emptyClient] = useState({
		fullName: '',
		dateOfBirth: '',
		placeOfBirth: '',
		gender: 'Select gender',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		citizenship: [],
		appliedSanctions: ''
	});

	useEffect(() => {
		setIsValid(false);
		const {
			fullName,
			dateOfBirth,
			placeOfBirth,
			residence,
			citizenship,
			appliedSanctions,
			gender
		} = client;
		if (
			fullName.length &&
			dateOfBirth.length &&
			placeOfBirth.length &&
			residence.street.length &&
			residence.streetNumber.length &&
			residence.municipality.length &&
			residence.zipCode.length &&
			residence.stateOrCountry !== 'Select country' &&
			citizenship.length &&
			appliedSanctions.length &&
			gender !== 'Select gender' &&
			new Date(dateOfBirth) <= new Date() &&
			new Date(dateOfBirth) >= new Date('01-01-1900')
		) {
			setIsValid(true);
		}
	}, [client]);

	const handleChangeClientInput = (event: any) => {
		setClient({
			...client,
			[event.target.name]: event.target.value
		});
	};
	const handleDropDownInput = (event: any) => {
		setClient({ ...client, [event.target.name]: event.target.value });
	};

	const handleSelectDropdownNatural = (event: any) => {
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setClient({ ...client, citizenship: countries });
	};
	const handleChangeResidenceInput = (event: any) => {
		setClient({
			...client,
			residence: { ...client.residence, [event.target.name]: event.target.value }
		});
	};

	const handleChangeDate = (event: any) => {
		const inputDate = new Date(event.target.value);
		const today = new Date();

		if (inputDate > today) {
			setClient({ ...client, dateOfBirth: '' });
		} else {
			setClient({ ...client, dateOfBirth: event.target.value });
		}
	};
	const handleClose = () => {
		updateSupervisorModalShow(false);
	};

	const api = useAxios();

	const handleSubmit = () => {
		console.log('Board member data', client);
		const bodyFormData = new FormData();
		bodyFormData.append('full_name', client.fullName);
		bodyFormData.append('dob', client.dateOfBirth);
		bodyFormData.append('place_of_birth', client.placeOfBirth);
		bodyFormData.append('residence_address', JSON.stringify(client.residence));
		bodyFormData.append('gender', client.gender);
		bodyFormData.append('citizenship', client.citizenship.join(', '));
		bodyFormData.append('applied_sanctions', client.appliedSanctions === 'Yes' ? 'true' : 'false');

		api.request({
			method: 'POST',
			url: `${BASE_URL}kyc/l2-business/boardmember/`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then(function (response) {
				// handle success
				console.log(response);
				client.id = response.data.id;
				updateSupervisorModalShow(false, client);
				setClient(emptyClient);
				toast.success('The supervisory board member was added', { theme: theme.name });
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				updateSupervisorModalShow(false);
				toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
			});
	};
	const handleBack = () => {
		updateSupervisorModalShow(false);
	};

	useEffect(() => {
		setShowModal(addSupervisor);
	}, [addSupervisor]);

	return (
		<Portal
			size="xxl"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton
			backgroundColor='light'
			themeMode='light'>
			{/* @ts-ignore */}
			<Wrapper themeMode='dark' data-testid='supervisoryMembersTest'>
				<ContentTitle>Information on members of the supervisory board</ContentTitle>
				<WrapContainer style={{ padding: '0 10px' }}>
					<div style={{
						margin: '0 0 10px 0',
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-between'
					}}>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-supervisory-full-name"
								style={{ display: 'inline-block', margin: '8px 0' }}>
								Full name
							</label>
							<TextField
								id="label-supervisory-full-name"
								value={client.fullName}
								placeholder="Full name"
								type="text"
								onChange={handleChangeClientInput}
								size="small"
								align="left"
								name="fullName"
								maxLength={50}
								error={client.fullName.length < 2}
								themeMode='light'
							/>
						</div>
						<div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
							<label
								htmlFor="label-supervisory-date"
								style={{ display: 'inline-block', margin: '8px 0' }}>
								Date of birth
							</label>
							<DateInput
								type="date"
								id="label-supervisory-date"
								value={client.dateOfBirth}
								min="1900-01-01"
								name="dateOfBirth"
								onChange={(e: any) => handleChangeDate(e)}
								// @ts-ignore
								themeMode='light'
								max={today && today}
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-supervisory-place-of-birth"
								style={{ display: 'inline-block', margin: '8px 0' }}>
								Place of Birth
							</label>
							<TextField
								id="label-supervisory-place-of-birth"
								value={client.placeOfBirth}
								placeholder="Place of Birth"
								type="text"
								onChange={handleChangeClientInput}
								size="small"
								align="left"
								name="placeOfBirth"
								maxLength={50}
								error={client.placeOfBirth.length < 2}
								themeMode='light'
							/>
						</div>
						<div style={{
							width: '48%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end'
						}}>
							<label htmlFor="label-supervisory-select-gender" style={{ display: 'inline-block', margin: '8px 0' }}>
								Gender
							</label>
							<Select
								name="gender"
								onChange={handleDropDownInput}
								value={client.gender}
								id="label-supervisory-select-gender"
								// @ts-ignore
								themeMode='light'>
								<option value="Select gender">Select gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</Select>
						</div>
					</div>
					<div style={{ width: `${isMobile ? '100%' : '48%'}` }}>
						<ContentTitle>
							Citizenship(s)
						</ContentTitle>
						<SelectDropdown
							themeMode='light'
							onChange={(e: any) => handleSelectDropdownNatural(e)}
							options={countries}
							placeholder='Select country...'
						/>
					</div>
					<ContentTitle>
						Permanent or other residence
					</ContentTitle>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
						<div style={{ width: '48%' }}>
							<label htmlFor="label-supervisory-address-permanent-state-or-Country"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								Country
							</label>
							<Select
								name="stateOrCountry"
								onChange={handleChangeResidenceInput}
								value={client.residence.stateOrCountry}
								id="label-supervisory-address-permanent-state-or-Country"
								// @ts-ignore
								themeMode='light'>
								<option value="Select country">Select country</option>
								{COUNTRIES.map((country: any) => {
									return (
										<option value={country.name} key={country.name}>
											{country.name}
										</option>
									);
								})}
								;
							</Select>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-supervisory-address-permanent-street"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								Street
							</label>
							<TextField
								id="label-supervisory-address-permanent-street"
								value={client.residence.street}
								placeholder="Street"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="street"
								maxLength={50}
								themeMode='light'
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-supervisory-address-permanent-street-number"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								Street number
							</label>
							<TextField
								id="label-supervisory-address-permanent-street-number"
								value={client.residence.streetNumber}
								placeholder="Street number"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="streetNumber"
								maxLength={50}
								themeMode='light'
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-supervisory-address-permanent-municipality"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								City
							</label>
							<TextField
								id="label-supervisory-address-permanent-municipality"
								value={client.residence.municipality}
								placeholder="City"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="municipality"
								maxLength={50}
								themeMode='light'
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-supervisory-address-permanent-zipCode"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								ZIP Code
							</label>
							<TextField
								id="label-supervisory-address-permanent-zipCode"
								value={client.residence.zipCode}
								placeholder="ZIP Code"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="zipCode"
								maxLength={50}
								themeMode='light'
							/>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							width: '100%',
							margin: '20px 0',
							alignItems: 'baseline'
						}}>
						<p style={{ marginBottom: '25px', marginRight: '30px' }}>
							Are you a person against whom are applied Czech or international sanctions?
						</p>
						<label htmlFor="appliedSanctionsTrue" style={{ display: 'block', marginRight: '10px' }}>
							<input
								id="appliedSanctionsTrue"
								type="radio"
								value="Yes"
								checked={client.appliedSanctions === 'Yes'}
								onChange={handleChangeClientInput}
								name="appliedSanctions"
							/>
							Yes
						</label>
						<label htmlFor="appliedSanctionsFalse">
							<input
								id="appliedSanctionsFalse"
								type="radio"
								value="No"
								checked={client.appliedSanctions === 'No'}
								onChange={handleChangeClientInput}
								name="appliedSanctions"
							/>
							No
						</label>
					</div>
				</WrapContainer>
				<SubmitBtn onClick={handleSubmit} disabled={!isValid}>
					{isValid ? 'Submit' : 'Please fill up all fields'}
				</SubmitBtn>
			</Wrapper>
		</Portal>
	);
};
