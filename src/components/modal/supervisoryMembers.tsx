import styled, { css } from 'styled-components';
import { Portal } from './portal';
import { TextField } from '../textField/textField';
import { useEffect, useState } from 'react';
import { Button } from '../button/button';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';
import COUNTRIES from '../../data/listOfAllCountries.json';
import { toast } from 'react-toastify';
import { ContentTitle, WrapContainer } from './kycL2LegalModal';
import { useAxios, useMedia } from '../../hooks';
import { BASE_URL, useStore } from '../../helpers';
import countries from '../../data/countries.json';
import { DateInput } from './shareholdersModal';
import { SelectDropdown } from '../selectDropdown/selectDropdown';

const Wrapper = styled.div(() => {
	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};
	`;
});

const Select = styled.select(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${theme.font.default};
		background-color: ${theme.background.secondary};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		width: 100%;
		height: 100%;
		max-height: ${pxToRem(46)};
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
			gender !== 'Select gender'
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
		setClient({ ...client, dateOfBirth: event.target.value });
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
			size="xl"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton>
			<Wrapper>
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
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block'
								}}>
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
							/>
						</div>
						<div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
							<label
								htmlFor="label-supervisory-date"
								style={{
									margin: '8px 0',
									display: 'inline-block'
								}}>
								Date of birth
							</label>
							<DateInput
								style={{
									backgroundColor: `${theme.background.secondary}`,
									color: `${theme.font.default}`,
									minHeight: '40px',
									border: '1px solid grey',
									borderRadius: `${DEFAULT_BORDER_RADIUS}`
								}}
								type="date"
								id="label-supervisory-date"
								value={client.dateOfBirth}
								min="1900-01-01"
								name="dateOfBirth"
								onChange={(e: any) => handleChangeDate(e)}
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-shareholders-place-of-birth"
								style={{
									margin: '6px 0 8px 0',
									display: 'inline-block'
								}}>
								Place of Birth
							</label>
							<TextField
								id="label-shareholders-place-of-birth"
								value={client.placeOfBirth}
								placeholder="Place of Birth"
								type="text"
								onChange={handleChangeClientInput}
								size="small"
								align="left"
								name="placeOfBirth"
								maxLength={50}
								error={client.placeOfBirth.length < 2}
							/>
						</div>
						<div style={{
							width: '48%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end'
						}}>
							<label htmlFor="label-shareholder-select-gender">
								Gender
							</label>
							<Select
								name="gender"
								onChange={handleDropDownInput}
								value={client.gender}
								id="label-shareholder-select-gender"
								style={{
									minHeight: '46px',
									marginTop: '8px',
								}}>
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
							<label htmlFor="label-shareholder-address-permanent-state-Or-Country"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								Country
							</label>
							<Select
								name="stateOrCountry"
								onChange={handleChangeResidenceInput}
								value={client.residence.stateOrCountry}
								id="label-shareholder-address-permanent-state-Or-Country"
								style={{
									maxHeight: '45px',
								}}>
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
								htmlFor="label-shareholder-address-permanent-street"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								Street
							</label>
							<TextField
								id="label-shareholder-address-permanent-street"
								value={client.residence.street}
								placeholder="Street"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="street"
								maxLength={50}
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-shareholder-address-permanent-street-number"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								Street number
							</label>
							<TextField
								id="label-shareholder-address-permanent-street-number"
								value={client.residence.streetNumber}
								placeholder="Street number"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="streetNumber"
								maxLength={50}
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-shareholder-address-permanent-municipality"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								City
							</label>
							<TextField
								id="label-shareholder-address-permanent-municipality"
								value={client.residence.municipality}
								placeholder="City"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="municipality"
								maxLength={50}
							/>
						</div>
						<div style={{ width: '48%' }}>
							<label
								htmlFor="label-shareholder-address-permanent-zipCode"
								style={{ margin: '8px 0', display: 'inline-block' }}>
								ZIP Code
							</label>
							<TextField
								id="label-shareholder-address-permanent-zipCode"
								value={client.residence.zipCode}
								placeholder="ZIP Code"
								type="text"
								onChange={handleChangeResidenceInput}
								size="small"
								align="left"
								name="zipCode"
								maxLength={50}
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
				<Button variant="secondary" onClick={handleSubmit} disabled={!isValid}>
					{isValid ? 'Submit' : 'Please fill up all fields'}
				</Button>
			</Wrapper>
		</Portal>
	);
};
