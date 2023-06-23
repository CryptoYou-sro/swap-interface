import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import countries from '../../data/countries.json';
import COUNTRIES from '../../data/listOfAllCountries.json';
import { BASE_URL, getTodaysDate, useStore } from '../../helpers';
import { useAxios, useMedia } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { Icon } from '../icon/icon';
import { SelectDropdown } from '../selectDropdown/selectDropdown';
import { TextField } from '../textField/textField';
import { ContentTitle } from './kycL2LegalModal';
import { Portal } from './portal';

const WrapContainer = styled.div(({ themeMode }: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		overflow-y: auto;
		margin-bottom: ${spacing[10]};
		color: ${themeMode === 'dark' ? '#000000' : themeMode === 'light' ? '#ffffff' : theme.font.default};


		::-webkit-scrollbar {
			display: block;
			width: 1px;
			background-color: ${theme.background.tertiary};
		}

		::-webkit-scrollbar-thumb {
			display: block;
			background-color: ${theme.button.default};
			border-radius: ${pxToRem(4)};
			border-right: none;
			border-left: none;
		}

		::-webkit-scrollbar-track-piece {
			display: block;
			background: ${theme.button.disabled};
		}
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

const FileInput = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -100;
`;

const LabelInput = styled.label(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		text-align: center;
		cursor: pointer;
		min-width: ${pxToRem(120)};
		/* margin-bottom: ${pxToRem(20)}; */
		padding: ${spacing[4]};
		border: 1px solid ${theme.button.wallet};
		border-radius: ${DEFAULT_BORDER_RADIUS};

		&:hover {
			border: 1px solid ${theme.button.default};
			color: ${theme.button.default};
		}
	`;
});

const UboLegalContainer = styled.div`
	padding: 0 ${spacing[6]};
`;

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

const IconContainer = styled.div(() => {

	return css`
	cursor: pointer;
	margin-left: ${spacing[10]};

	&:hover {
		fill: red;
	}

	&:focus {
		outline: 6px solid red;
	}
	`;
});

type Props = {
	addUbo?: any;
	updateUboModalShow?: any;
};
export const UboModal = ({ addUbo = false, updateUboModalShow }: Props) => {
	const {
		state: { theme }
	} = useStore();
	const { mobileWidth: isMobile } = useMedia('s');
	const fileIdentification = useRef<HTMLInputElement>();
	const [isUBOLegalEntity, setIsUBOLegalEntity] = useState<string>('empty');
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	const today = getTodaysDate();
	const [client, setClient] = useState<any>({
		appliedSanctions: '',
		citizenship: [],
		companyName: '',
		fileIdentification: null,
		fullName: '',
		gender: 'Select gender',
		idNumber: '',
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		permanentAndMailAddressSame: '',
		placeOfBirth: '',
		politicallPerson: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		taxResidency: 'Select country',
		uboInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			countryOfIncorporate: [],
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		}
	});

	const [emptyClient] = useState({
		appliedSanctions: '',
		citizenship: [],
		companyName: '',
		fileIdentification: null,
		fullName: '',
		gender: 'Select gender',
		idNumber: '',
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		permanentAndMailAddressSame: '',
		placeOfBirth: '',
		politicallPerson: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		taxResidency: 'Select country',
		uboInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			countryOfIncorporate: [],
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		}
	});

	useEffect(() => {
		setIsValid(false);
		if (isUBOLegalEntity === 'natural') {
			if (client.fullName && client.idNumber && client.placeOfBirth && client.gender !== 'Select gender'
				&& client.citizenship.length > 0 && client.taxResidency !== 'Select country' && !Object.values(client.residence).includes('')
				&& client.fileIdentification && client.politicallPerson.length > 0 && client.appliedSanctions.length > 0
				&& (client.permanentAndMailAddressSame === 'Yes'
					|| client.permanentAndMailAddressSame === 'No'
					&& !Object.values(client.mailAddress).includes(''))) {
				setIsValid(true);
			}
		} else if (isUBOLegalEntity === 'legal') {
			if (client.companyName && client.fileIdentification
				&& !Object.values(client.uboInfo).includes('')
				&& client.uboInfo.countryOfIncorporate.length > 0
				&& new Date(client.uboInfo.dateOfBirth) <= new Date()
				&& new Date(client.uboInfo.dateOfBirth) >= new Date('01-01-1900')) {
				setIsValid(true);
			}
		}
	}, [client]);

	useEffect(() => {
		setClient(emptyClient);
	}, [isUBOLegalEntity]);

	useEffect(() => {
		setShowModal(addUbo);
	}, [addUbo]);

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

	const handleSelectDropdownUboInfo = (event: any) => {
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setClient({ ...client, uboInfo: { ...client.uboInfo, countryOfIncorporate: countries } });
	};

	const handleChangeResidenceInput = (event: any) => {
		setClient({
			...client,
			residence: { ...client.residence, [event.target.name]: event.target.value }
		});
	};

	const handleChangeMailInput = (event: any) => {
		setClient({
			...client,
			mailAddress: { ...client.mailAddress, [event.target.name]: event.target.value }
		});
	};

	const handleChangeUboInfoInput = (event: any) => {
		if (event.target.name === 'dateOfBirth') {
			const inputDate = new Date(event.target.value);
			const today = new Date();
			if (inputDate > today) {
				setClient({
					...client,
					uboInfo: { ...client.uboInfo, dateOfBirth: '' }
				});
			} else {
				setClient({
					...client,
					uboInfo: { ...client.uboInfo, [event.target.name]: event.target.value }
				});
			}
		} else {
			setClient({
				...client,
				uboInfo: { ...client.uboInfo, [event.target.name]: event.target.value }
			});
		}
	};

	const handleChangeFileInput = () => {
		const file: any =
			fileIdentification?.current?.files && fileIdentification.current.files[0];
		setClient({
			...client,
			fileIdentification: file
		});
	};

	const handleClose = () => {
		updateUboModalShow(false);
	};

	const api = useAxios();
	const handleSubmit = () => {
		console.log('ubo data', client);
		const bodyFormData = new FormData();
		if (isUBOLegalEntity === 'natural') {
			bodyFormData.append('full_name', client.fullName);
			bodyFormData.append('birth_id', client.idNumber);
			bodyFormData.append('place_of_birth', client.placeOfBirth);
			bodyFormData.append('gender', client.gender);
			bodyFormData.append('citizenship', client.citizenship.join(', '));
			bodyFormData.append('tax_residency', client.taxResidency);
			bodyFormData.append('residence_address', JSON.stringify(client.residence));
			bodyFormData.append('identification_doc', client.fileIdentification);
			if (client.permanentAndMailAddressSame === 'No') {
				bodyFormData.append('mail_address', JSON.stringify(client.mailAddress));
			}
			bodyFormData.append('political_person', client.politicallPerson === 'Yes' ? 'true' : 'false');
			bodyFormData.append('applied_sanctions', client.appliedSanctions === 'Yes' ? 'true' : 'false');
		} else if (isUBOLegalEntity === 'legal') {
			bodyFormData.append('full_name', client.companyName);
			bodyFormData.append('identification_doc', client.fileIdentification);
			bodyFormData.append('statutory_coi', client.uboInfo.countryOfIncorporate.join(', '));
			bodyFormData.append('statutory_full_name', client.uboInfo.nameAndSurname);
			bodyFormData.append('statutory_subsequently_business', client.uboInfo.subsequentlyBusinessCompany);
			bodyFormData.append('statutory_permanent_residence', client.uboInfo.permanentResidence);
			bodyFormData.append('statutory_office_address', client.uboInfo.registeredOffice);
			bodyFormData.append('statutory_id', client.uboInfo.idNumber);
			bodyFormData.append('statutory_doi', client.uboInfo.dateOfBirth);
		}

		api.request({
			method: 'POST',
			url: `${BASE_URL}kyc/l2-business/ubo/`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then(function (response) {
				// handle success
				console.log(response);
				client.id = response.data.id;
				updateUboModalShow(false, client);
				setClient(emptyClient);
				toast.success('The UBO was added', { theme: theme.name });
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				updateUboModalShow(false);
				toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
			});
	};

	const handleBack = () => {
		updateUboModalShow(false);
	};

	const handleDeleteFile = () => {
		setClient({
			...client,
			fileIdentification: null
		});

		if (fileIdentification?.current) {
			fileIdentification.current.value = '';
		}
	};

	return (
		<Portal
			size="xxl"
			isOpen={showModal}
			handleClose={handleClose}
			hasBackButton
			backgroundColor='light'
			handleBack={handleBack}
			themeMode='light'>
			{/* @ts-ignore */}
			<WrapContainer themeMode='dark'>
				<div>
					<ContentTitle>Information on Ultimate Beneficial Owner(s) (optional)</ContentTitle>
					<div
						style={{
							display: 'flex',
							width: '100%',
							marginBottom: '20px',
							alignItems: 'baseline'
						}}>
						<p style={{ textAlign: 'left', marginRight: '30px' }}>
							Is the Ultimate Beneficial Owner (UBO) a legal entity?
						</p>
						<label htmlFor="label-typeOfClient-true" style={{ display: 'inline-block', marginRight: '30px' }}>
							<input
								id="label-typeOfClient-true"
								type="radio"
								value="Yes"
								checked={isUBOLegalEntity === 'legal'}
								onChange={() => setIsUBOLegalEntity('legal')}
							/>
							Yes
						</label>
						<label htmlFor="label-typeOfClient-false">
							<input
								id="label-typeOfClient-false"
								type="radio"
								value="No"
								checked={isUBOLegalEntity === 'natural'}
								onChange={() => setIsUBOLegalEntity('natural')}
							/>
							No
						</label>
					</div>
					{isUBOLegalEntity === 'natural' ? (
						<>
							<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-ubo-full-name" style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Name and surname
									</label>
									<TextField
										id="label-ubo-full-name"
										value={client.fullName}
										placeholder="Name and surname"
										type="text"
										onChange={handleChangeClientInput}
										size="small"
										align="left"
										name="fullName"
										error={client.fullName.length < 2}
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-ubo-place-of-birth" style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Place of Birth
									</label>
									<TextField
										id="label-ubo-place-of-birth"
										value={client.placeOfBirth}
										placeholder="Place of Birth"
										type="text"
										onChange={handleChangeClientInput}
										size="small"
										align="left"
										name="placeOfBirth"
										error={client.placeOfBirth.length < 2}
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-ubo-id-number" style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Birth identification number
									</label>
									<TextField
										id="label-ubo-id-number"
										value={client.idNumber}
										placeholder="Birth identification number"
										type="text"
										onChange={handleChangeClientInput}
										size="small"
										align="left"
										name="idNumber"
										error={client.idNumber.length < 2}
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{
									width: '48%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between'
								}}>
									<label htmlFor="label-select-gender" style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Gender
									</label>
									<Select
										name="gender"
										onChange={handleDropDownInput}
										value={client.gender}
										id="label-select-gender"
										// @ts-ignore
										themeMode='light'>
										<option value="Select gender">Select gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</Select>
								</div>
								<div style={{ width: '48%' }}>
									<label htmlFor="label-select-tax-residency"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Tax Residency
									</label>
									<Select
										name="taxResidency"
										onChange={handleDropDownInput}
										value={client.taxResidency}
										id="label-select-tax-residency"
										// @ts-ignore
										themeMode='light'
										style={{
											minHeight: '46px',
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
									<label htmlFor="label-citizenship-natural-ubo"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Citizenship(s)
									</label>
									<SelectDropdown
										onChange={(e: any) => handleSelectDropdownNatural(e)}
										id='label-citizenship-natural-ubo'
										options={countries}
										themeMode='light'
										placeholder='Select country...'
									/>
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'baseline', marginTop: '20px', flexDirection: 'column' }}>
								<ContentTitle style={{ width: '80%' }}>Identification (ID card or passport). Copy of
									personal identification
									or passport of the
									representatives</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', alignItems: 'center' }}>
									<LabelInput htmlFor="file-input-address">
										<FileInput
											id="file-input-address"
											type="file"
											ref={fileIdentification as any}
											onChange={handleChangeFileInput} />
										{client.fileIdentification && client.fileIdentification.name.length < 15 ? client.fileIdentification.name : client.fileIdentification && client.fileIdentification.name.length >= 15 ? client.fileIdentification.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
									<IconContainer>
										<Icon icon='trashBin' size='small' onClick={handleDeleteFile} style={{ outline: 'none' }} />
									</IconContainer>
								</div>
							</div>
							<ContentTitle>
								Permanent or other residence
							</ContentTitle>
							<div
								style={{
									margin: '0 0 10px 0',
									display: 'flex',
									flexWrap: 'wrap',
									justifyContent: 'space-between'
								}}>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-address-permanent-state-Or-Country"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Country
									</label>
									<Select
										name="stateOrCountry"
										onChange={handleChangeResidenceInput}
										value={client.residence.stateOrCountry}
										id="label-address-permanent-state-Or-Country"
										// @ts-ignore
										themeMode='light'
										style={{
											minHeight: '35px',
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
										htmlFor="label-address-permanent-street"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Street
									</label>
									<TextField
										id="label-address-permanent-street"
										value={client.residence.street}
										placeholder="Street"
										type="text"
										onChange={handleChangeResidenceInput}
										size="small"
										align="left"
										name="street"
										maxLength={100}
										themeMode='light'
									/>
								</div>

								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-address-permanent-street-number"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Street number
									</label>
									<TextField
										id="label-address-permanent-street-number"
										value={client.residence.streetNumber}
										placeholder="Street number"
										type="text"
										onChange={handleChangeResidenceInput}
										size="small"
										align="left"
										name="streetNumber"
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-address-permanent-municipality"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										City
									</label>
									<TextField
										id="label-address-permanent-municipality"
										value={client.residence.municipality}
										placeholder="City"
										type="text"
										onChange={handleChangeResidenceInput}
										size="small"
										align="left"
										name="municipality"
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-address-permanent-zipCode"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										ZIP Code
									</label>
									<TextField
										id="label-address-permanent-zipCode"
										value={client.residence.zipCode}
										placeholder="ZIP Code"
										type="text"
										onChange={handleChangeResidenceInput}
										size="small"
										align="left"
										name="zipCode"
										maxLength={100}
										themeMode='light'
									/>
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
								<p style={{ marginBottom: '25px' }}>
									Is your permanent (RESIDENCE) address the same as your mailing address?
								</p>
								<label htmlFor="label-mailing-permanent-address-true" style={{ display: 'block', marginRight: '10px' }}>
									<input
										id="label-mailing-permanent-address-true"
										type="radio"
										value="Yes"
										checked={client.permanentAndMailAddressSame === 'Yes'}
										onChange={handleChangeClientInput}
										name="permanentAndMailAddressSame"
									/>
									Yes
								</label>
								<label htmlFor="label-mailing-permanent-address-false">
									<input
										id="label-mailing-permanent-address-false"
										type="radio"
										value="No"
										checked={client.permanentAndMailAddressSame === 'No'}
										onChange={handleChangeClientInput}
										name="permanentAndMailAddressSame"
									/>
									No
								</label>
							</div>
							{client.permanentAndMailAddressSame === 'No' && (
								<>
									<ContentTitle>Mailing address</ContentTitle>
									<div
										style={{
											margin: '0 0 10px 0',
											display: 'flex',
											flexWrap: 'wrap',
											justifyContent: 'space-between'
										}}>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-mail-address-state-Or-Country"
												style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
												Country
											</label>
											<Select
												name="stateOrCountry"
												onChange={handleChangeMailInput}
												value={client.mailAddress.stateOrCountry}
												id="label-mail-address-state-Or-Country"
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
												htmlFor="label-address-street"
												style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
												Street
											</label>
											<TextField
												id="label-address-street"
												value={client.mailAddress.street}
												placeholder="Street"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="street"
												maxLength={100}
												themeMode='light'
											/>
										</div>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-address-street-number"
												style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
												Street number
											</label>
											<TextField
												id="label-address-street-number"
												value={client.mailAddress.streetNumber}
												placeholder="Street number"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="streetNumber"
												maxLength={100}
												themeMode='light'
											/>
										</div>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-address-municipality"
												style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
												City
											</label>
											<TextField
												id="label-address-municipality"
												value={client.mailAddress.municipality}
												placeholder="City"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="municipality"
												maxLength={100}
												themeMode='light'
											/>
										</div>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-address-zipCode"
												style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
												ZIP Code
											</label>
											<TextField
												id="label-address-zipCode"
												value={client.mailAddress.zipCode}
												placeholder="ZIP Code"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="zipCode"
												maxLength={100}
												themeMode='light'
											/>
										</div>
									</div>
								</>
							)}
							<div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
								<p style={{ marginBottom: '25px' }}>Are you a politically exposed person?</p>
								<label htmlFor="politicallPersonTrue" style={{ display: 'block', marginRight: '10px' }}>
									<input
										id="politicallPersonTrue"
										type="radio"
										value="Yes"
										checked={client.politicallPerson === 'Yes'}
										onChange={handleChangeClientInput}
										name="politicallPerson"
									/>
									Yes
								</label>
								<label htmlFor="politicallPersonFalse">
									<input
										id="politicallPersonFalse"
										type="radio"
										value="No"
										checked={client.politicallPerson === 'No'}
										onChange={handleChangeClientInput}
										name="politicallPerson"
									/>
									No
								</label>
							</div>
							<div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
								<p style={{ marginBottom: '25px' }}>
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
						</>
					) : isUBOLegalEntity === 'legal' ? (
						<UboLegalContainer>
							<div style={{ width: `${isMobile ? '100%' : '48%'}` }}>
								<label
									style={{ display: 'block', marginBottom: '10px' }}
									htmlFor="label-ubo-company-name">
									Company name
								</label>
								<TextField
									id="label-ubo-company-name"
									value={client.companyName}
									placeholder="Company name"
									type="text"
									onChange={handleChangeClientInput}
									size="small"
									align="left"
									name="companyName"
									error={client.companyName.length < 2}
									maxLength={100}
									themeMode='light'
								/>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
								<ContentTitle style={{ width: '80%' }}>Copy of excerpt of public register
									or other valid documents proving the existence of legal entity (Articles of Associations, Deed of
									Foundation etc.)</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', alignItems: 'center' }}>
									<LabelInput htmlFor="fileIdentification">
										<FileInput
											id="fileIdentification"
											type="file"
											ref={fileIdentification as any}
											onChange={handleChangeFileInput} />
										{client.fileIdentification && client.fileIdentification.name.length < 15 ? client.fileIdentification.name : client.fileIdentification && client.fileIdentification.name.length >= 15 ? client.fileIdentification.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
									<IconContainer>
										<Icon icon='trashBin' size='small' onClick={handleDeleteFile} style={{ outline: 'none' }} />
									</IconContainer>
								</div>
							</div>
							<div
								style={{
									margin: '0 0 20px',
									display: 'flex',
									flexDirection: 'column'
								}}>
								<ContentTitle style={{ marginBottom: '16px' }}>
									Provide information about your statutory body
								</ContentTitle>
								<div
									style={{
										margin: '10px 0',
										display: 'flex',
										flexWrap: 'wrap',
										justifyContent: 'space-between',
										alignItems: 'flex-end',
									}}>
									<div style={{ width: '48%' }}>
										<label
											htmlFor="label-uboInfo-name-surname"
											style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
											Name and Surname
										</label>
										<TextField
											id="label-uboInfo-name-surname"
											value={client.uboInfo.nameAndSurname}
											placeholder="Name and Surname"
											type="text"
											onChange={handleChangeUboInfoInput}
											size="small"
											align="left"
											name="nameAndSurname"
											maxLength={100}
											themeMode='light'
										/>
									</div>
									<div style={{
										width: '48%',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between'
									}}>
										<label
											htmlFor="label-uboInfo-dateOfBirth"
											style={{
												margin: '8px 0',
												display: 'inline-block'
											}}>
											Date of incorporation
										</label>
										<DateInput
											type="date"
											id="label-uboInfo-dateOfBirth"
											value={client.uboInfo.dateOfBirth}
											min="1900-01-01"
											name="dateOfBirth"
											onChange={handleChangeUboInfoInput}
											max={today && today}
											// @ts-ignore
											themeMode='light'
										/>
									</div>
									<div style={{ width: '48%' }}>
										<label
											htmlFor="label-uboInfo-country-incorporate"
											style={{ margin: '8px 0', display: 'inline-block' }}>
											Country of incorporation
										</label>
										<SelectDropdown
											themeMode='light'
											onChange={(e: any) => handleSelectDropdownUboInfo(e)}
											options={countries}
										/>
									</div>
									<div style={{ width: '48%' }}>
										<label
											htmlFor="label-uboInfo-subsequentlyBusinessCompany"
											style={{ margin: '8px 0', display: 'inline-block' }}>
											Subsequently business company
										</label>
										<TextField
											id="label-uboInfo-subsequentlyBusinessCompany"
											value={client.uboInfo.subsequentlyBusinessCompany}
											placeholder="Subsequently business company"
											type="text"
											onChange={handleChangeUboInfoInput}
											size="small"
											align="left"
											name="subsequentlyBusinessCompany"
											maxLength={100}
											themeMode='light'
										/>
									</div>
									<div style={{ width: '48%' }}>
										<label
											htmlFor="label-uboInfo-registeredOffice"
											style={{ margin: '8px 0', display: 'inline-block' }}>
											Registered office address
										</label>
										<TextField
											id="label-uboInfo-registeredOffice"
											value={client.uboInfo.registeredOffice}
											placeholder="Registered office address"
											type="text"
											onChange={handleChangeUboInfoInput}
											size="small"
											align="left"
											name="registeredOffice"
											maxLength={100}
											themeMode='light'
										/>
									</div>
									<div style={{ width: '48%' }}>
										<label
											htmlFor="label-uboInfo-permanentResidence"
											style={{ margin: '8px 0', display: 'inline-block' }}>
											Permanent Residence
										</label>
										<TextField
											id="label-uboInfo-permanentResidence"
											value={client.uboInfo.permanentResidence}
											placeholder="Permanent Residence"
											type="text"
											onChange={handleChangeUboInfoInput}
											size="small"
											align="left"
											name="permanentResidence"
											maxLength={100}
											themeMode='light'
										/>
									</div>
									<div style={{ width: '48%' }}>
										<label
											htmlFor="label-uboInfo-idNumber"
											style={{ margin: '8px 0', display: 'inline-block' }}>
											Identification number
										</label>
										<TextField
											id="label-uboInfo-idNumber"
											value={client.uboInfo.idNumber}
											placeholder="Identification number"
											type="text"
											onChange={handleChangeUboInfoInput}
											size="small"
											align="left"
											name="idNumber"
											maxLength={100}
											themeMode='light'
										/>
									</div>
								</div>
							</div>
						</UboLegalContainer>
					) : null}
				</div>
				<div style={{ textAlign: 'center' }}>
					<SubmitBtn onClick={handleSubmit} disabled={!isValid}>
						{isValid ? 'Submit' : 'Please fill up all fields'}
					</SubmitBtn>
				</div>
			</WrapContainer>

		</Portal>
	);
};
