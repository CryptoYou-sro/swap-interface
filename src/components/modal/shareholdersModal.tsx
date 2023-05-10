import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import countries from '../../data/countries.json';
import COUNTRIES from '../../data/listOfAllCountries.json';
import { BASE_URL, useStore } from '../../helpers';
import { useAxios, useMedia } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';
import { Button } from '../button/button';
import { SelectDropdown } from '../selectDropdown/selectDropdown';
import { TextField } from '../textField/textField';
import { useToasts } from '../toast/toast';
import { ContentTitle, WrapContainer } from './kycL2LegalModal';
import { Portal } from './portal';

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

const LabelInput = styled.label(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		text-align: center;
		cursor: pointer;
		min-width: ${pxToRem(120)};
		margin-bottom: ${pxToRem(20)};
		padding: ${spacing[4]};
		border: 1px solid ${theme.button.wallet};
		border-radius: ${pxToRem(4)};

		&:hover {
			border: 1px solid ${theme.border.secondary};
		}
	`;
});

const FileInput = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -100;
`;

export const DateInput = styled.input((props: any) => {
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

const ShareHoldersContainer = styled.div`
	padding: 0 ${spacing[6]};
`;

type Props = {
	addShareHolder?: boolean;
	updateShareHoldersModalShow?: any;
};
export const ShareHoldersModal = ({ addShareHolder = false, updateShareHoldersModalShow }: Props) => {
	const {
		state: { theme }
	} = useStore();
	const { mobileWidth: isMobile } = useMedia('s');

	const [showModal, setShowModal] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [isShareHolderLegal, setIsShareHolderLegal] = useState<string>('empty');

	// @ts-ignore
	const { addToast } = useToasts();
	const fileIdentification = useRef<HTMLInputElement>();
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
		shareHolderInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			countryOfIncorporate: [],
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		},
		taxResidency: 'Select country'
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
		shareHolderInfo: {
			nameAndSurname: '',
			dateOfBirth: '',
			permanentResidence: '',
			countryOfIncorporate: [],
			subsequentlyBusinessCompany: '',
			registeredOffice: '',
			idNumber: ''
		},
		taxResidency: 'Select country'
	});

	useEffect(() => {
		setIsValid(false);
		if (isShareHolderLegal === 'natural') {
			if (client.fullName && client.placeOfBirth && client.idNumber
				&& client.gender !== 'Select gender' && client.taxResidency !== 'Select country' && client.citizenship.length > 0
				&& client.fileIdentification && client.politicallPerson.length > 0 && client.appliedSanctions.length > 0
				&& !Object.values(client.residence).includes('') && (client.permanentAndMailAddressSame === 'Yes'
					|| client.permanentAndMailAddressSame === 'No' && !Object.values(client.mailAddress).includes(''))) {
				setIsValid(true);
			}
		} else if (isShareHolderLegal === 'legal') {
			if (client.companyName && client.fileIdentification && !Object.values(client.shareHolderInfo).includes('')) {
				setIsValid(true);
			}
		}
	}, [client]);

	useEffect(() => {
		setClient(emptyClient);
	}, [isShareHolderLegal]);
	const handleChangeClientInput = (event: any) => {
		setClient({
			...client,
			[event.target.name]: event.target.value
		});
	};
	const handleChangeFileInput = () => {
		const file: any =
			fileIdentification?.current?.files && fileIdentification.current.files[0];
		setClient({
			...client,
			fileIdentification: file
		});
	};
	const handleDropDownInput = (event: any) => {
		setClient({ ...client, [event.target.name]: event.target.value });
	};
	const handleSelectDropdownNatural = (event: any) => {
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setClient({ ...client, citizenship: countries });
	};
	const handleSelectDropdownShareHolderInfo = (event: any) => {
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setClient({ ...client, shareHolderInfo: { ...client.shareHolderInfo, countryOfIncorporate: countries } });
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
	const handleChangeShareHolderInfoInput = (event: any) => {
		setClient({
			...client,
			shareHolderInfo: { ...client.shareHolderInfo, [event.target.name]: event.target.value }
		});
	};

	const handleClose = () => {
		updateShareHoldersModalShow(false);
	};

	const api = useAxios();
	const handleSubmit = () => {
		console.log('ShareHolder data', client);
		const bodyFormData = new FormData();
		if (isShareHolderLegal === 'natural') {
			bodyFormData.append('full_name', client.fullName);
			bodyFormData.append('birth_id', client.idNumber);
			bodyFormData.append('place_of_birth', client.placeOfBirth);
			bodyFormData.append('gender', client.gender);
			bodyFormData.append('tax_residency', client.taxResidency);
			bodyFormData.append('citizenship', client.citizenship.join(', '));
			bodyFormData.append('identification_doc', client.fileIdentification);
			bodyFormData.append('residence_address', JSON.stringify(client.residence));
			if (client.permanentAndMailAddressSame === 'No') {
				bodyFormData.append('mail_address', JSON.stringify(client.mailAddress));
			}
			bodyFormData.append('political_person', client.politicallPerson === 'Yes' ? 'true' : 'false');
			bodyFormData.append('applied_sanctions', client.appliedSanctions === 'Yes' ? 'true' : 'false');
		} else if (isShareHolderLegal === 'legal') {
			bodyFormData.append('full_name', client.companyName);
			bodyFormData.append('identification_doc', client.fileIdentification);
			bodyFormData.append('statutory_full_name', client.shareHolderInfo.nameAndSurname);
			bodyFormData.append('statutory_doi', client.shareHolderInfo.dateOfBirth);
			bodyFormData.append('statutory_permanent_residence', client.shareHolderInfo.permanentResidence);
			bodyFormData.append('statutory_coi', client.shareHolderInfo.countryOfIncorporate.join(', '));
			bodyFormData.append('statutory_subsequently_business', client.shareHolderInfo.subsequentlyBusinessCompany);
			bodyFormData.append('statutory_office_address', client.shareHolderInfo.registeredOffice);
			bodyFormData.append('statutory_id', client.shareHolderInfo.idNumber);
		}

		api.request({
			method: 'POST',
			url: `${BASE_URL}kyc/l2-business/shareholder/`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then(function (response) {
				// handle success
				console.log(response);
				client.id = response.data.id;
				updateShareHoldersModalShow(false, client);
				setClient(emptyClient);
				addToast('Shareholder was added', 'info');
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				updateShareHoldersModalShow(false);
				addToast('Something went wrong, please fill the form and try again!', 'error');
			});
	};

	const handleBack = () => {
		updateShareHoldersModalShow(false);
	};

	useEffect(() => {
		setShowModal(addShareHolder);
	}, [addShareHolder]);

	return (
		<Portal
			size="xl"
			isOpen={showModal}
			handleClose={handleClose}
			handleBack={handleBack}
			hasBackButton>
			<WrapContainer
				style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 10px' }}>
				<div>
					<ContentTitle>
						Information on majority shareholders or person in control of client<br /> (more than 25%)
					</ContentTitle>
					<div
						style={{
							display: 'flex',
							width: '100%',
							marginBottom: '20px',
							alignItems: 'baseline'
						}}>
						<p style={{ marginBottom: '25px', marginRight: '30px' }}>
							Is the controlling person is a legal entity ?
						</p>
						<label htmlFor="label-typeOfClient-true" style={{ display: 'block', marginRight: '10px' }}>
							<input
								id="label-typeOfClient-true"
								type="radio"
								value="Yes"
								checked={isShareHolderLegal === 'legal'}
								onChange={() => setIsShareHolderLegal('legal')}
							/>
							Yes
						</label>
						<label htmlFor="label-typeOfClient-false">
							<input
								id="label-typeOfClient-false"
								type="radio"
								value="No"
								checked={isShareHolderLegal === 'natural'}
								onChange={() => setIsShareHolderLegal('natural')}
							/>
							No
						</label>
					</div>
					{isShareHolderLegal === 'natural' ? (
						<>
							<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
								<div style={{ width: '48%' }}>
									<label htmlFor="label-shareholder-company-name" style={{ margin: '8px 0', display: 'inline-block' }}>
										Name and surname
									</label>
									<TextField
										id="label-shareholders-company-name"
										value={client.fullName}
										placeholder="Name and surname"
										type="text"
										onChange={handleChangeClientInput}
										size="small"
										align="left"
										name="fullName"
										error={client.fullName.length < 2}
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareholders-id-number"
										style={{
											margin: '8px 0',
											display: 'inline-block'
										}}>
										Birth identification number
									</label>
									<TextField
										id="label-shareholders-id-number"
										value={client.idNumber}
										placeholder="Birth identification number"
										type="text"
										onChange={handleChangeClientInput}
										size="small"
										align="left"
										name="idNumber"
										error={client.idNumber.length < 2}
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareholders-place-of-birth"
										style={{
											margin: '8px 0',
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
										error={client.placeOfBirth.length < 2}
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label htmlFor="label-shareholder-select-gender" style={{ display: 'inline-block', margin: '8px 0' }}>
										Gender
									</label>
									<Select
										name="gender"
										onChange={handleDropDownInput}
										value={client.gender}
										id="label-shareholder-select-gender"
										style={{
											maxHeight: '45px',
										}}>
										<option value="Select gender">Select gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</Select>
								</div>
								<div style={{ width: '48%' }}>
									<label htmlFor="label-select-shareholder-tax-residency"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Tax Residency
									</label>
									<Select
										name="taxResidency"
										onChange={handleDropDownInput}
										value={client.taxResidency}
										id="label-select-shareholder-tax-residency"
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
									<label htmlFor="label-citizenship-natural-share"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
										Citizenship(s)
									</label>
									<SelectDropdown
										onChange={(e: any) => handleSelectDropdownNatural(e)}
										options={countries}
										placeholder='Select...'
									/>
								</div>
							</div>

							<div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
								<ContentTitle style={{ width: '80%' }}>Identification (ID card or passport). Copy of
									personal
									identification or
									passport of the representatives
								</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px' }}>
									<LabelInput htmlFor="label-input-file-natural">
										<FileInput
											id="label-input-file-natural"
											type="file"
											ref={fileIdentification as any}
											onChange={handleChangeFileInput}></FileInput>
										{client.fileIdentification && client.fileIdentification.name.length < 15 ? client.fileIdentification.name : client.fileIdentification && client.fileIdentification.name.length >= 15 ? client.fileIdentification.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
								</div>
							</div>
							<ContentTitle>Permanent or other residence</ContentTitle>
							<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareholder-address-permanent-state-Or-Country"
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
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareholder-address-permanent-street-number"
										style={{ margin: '10px 0', display: 'inline-block' }}>
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
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareholder-address-permanent-municipality"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
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
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareholder-address-permanent-zipCode"
										style={{ margin: '6px 0 8px 0', display: 'inline-block' }}>
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
									/>
								</div>
							</div>
							<div
								style={{
									display: 'flex',
									width: '100%',
									alignItems: 'baseline'
								}}>
								<p style={{ marginRight: '30px' }}>
									Is your permanent (RESIDENCE) address the same as your mailing address?
								</p>
								<label htmlFor="label-shareholder-mailing-permanent-address-true"
									style={{ display: 'block', marginRight: '10px' }}>
									<input
										id="label-shareholder-mailing-permanent-address-true"
										type="radio"
										value="Yes"
										checked={client.permanentAndMailAddressSame === 'Yes'}
										onChange={handleChangeClientInput}
										name="permanentAndMailAddressSame"
									/>
									Yes
								</label>
								<label htmlFor="label-shareholder-mailing-permanent-address-false">
									<input
										id="label-shareholder-mailing-permanent-address-false"
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
									<p style={{ textAlign: 'center', fontSize: '18px' }}>Mailing address</p>
									<div
										style={{
											margin: '0 0 10px 0',
											display: 'flex',
											flexWrap: 'wrap',
											justifyContent: 'space-between'
										}}>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-shareholder-mail-address-state-Or-Country"
												style={{
													marginTop: '10px',
													display: 'inline-block'
												}}>
												Country
											</label>
											<Select
												name="stateOrCountry"
												onChange={handleChangeMailInput}
												value={client.mailAddress.stateOrCountry}
												id="label-shareholder-mail-address-state-Or-Country"
												style={{
													minHeight: '46px',
													marginTop: '8px',
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
												htmlFor="label-shareholder-address-street"
												style={{
													margin: '6px 0 8px 0',
													display: 'inline-block'
												}}>
												Street
											</label>
											<TextField
												id="label-shareholder-address-street"
												value={client.mailAddress.street}
												placeholder="Street"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="street"
											/>
										</div>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-shareholder-address-street-number"
												style={{
													margin: '6px 0 8px 0',
													display: 'inline-block'
												}}>
												Street number
											</label>
											<TextField
												id="label-shareholder-address-street-number"
												value={client.mailAddress.streetNumber}
												placeholder="Street number"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="streetNumber"
											/>
										</div>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-shareholder-address-municipality"
												style={{
													margin: '6px 0 8px 0',
													display: 'inline-block'
												}}>
												City
											</label>
											<TextField
												id="label-shareholder-address-municipality"
												value={client.mailAddress.municipality}
												placeholder="City"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="municipality"
											/>
										</div>
										<div style={{ width: '48%' }}>
											<label
												htmlFor="label-shareholder-address-zipCode"
												style={{
													margin: '6px 0 8px 0',
													display: 'inline-block'
												}}>
												ZIP Code
											</label>
											<TextField
												id="label-shareholder-address-zipCode"
												value={client.mailAddress.zipCode}
												placeholder="ZIP Code"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="zipCode"
											/>
										</div>
									</div>
								</>
							)}
							<div
								style={{
									display: 'flex',
									width: '100%',
									alignItems: 'baseline'
								}}>
								<p style={{ marginRight: '30px' }}>Are you a politically exposed person?</p>
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
							<div
								style={{
									display: 'flex',
									width: '100%',
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
						</>
					) : isShareHolderLegal === 'legal' ? (
						<ShareHoldersContainer>
							<div style={{ width: `${isMobile ? '100%' : '48%'}` }}>
								<label
									htmlFor="label-shareholder-company-name"
									style={{
										marginBottom: '8px',
										display: 'inline-block'
									}}>
									Company name
								</label>
								<TextField
									id="label-shareholders-company-name"
									value={client.companyName}
									placeholder="Company name"
									type="text"
									onChange={handleChangeClientInput}
									size="small"
									align="left"
									name="companyName"
									error={client.companyName.length < 2}
								/>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
								<ContentTitle style={{ width: '80%' }}>Copy of
									excerpt of public register or
									other valid documents proving the existence of legal entity
									(Articles of Associations, Deed of Foundation etc.).
								</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px' }}>
									<LabelInput htmlFor="file-input">
										<FileInput
											id="file-input"
											type="file"
											ref={fileIdentification as any}
											onChange={handleChangeFileInput}></FileInput>
										{client.fileIdentification && client.fileIdentification.name.length < 15 ? client.fileIdentification.name : client.fileIdentification && client.fileIdentification.name.length >= 15 ? client.fileIdentification.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
								</div>
							</div>
							<ContentTitle>
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
										htmlFor="label-shareHolderInfo-name-surname"
										style={{ margin: '8px 0', display: 'inline-block' }}>
										Name and Surname
									</label>
									<TextField
										id="label-shareHolderInfo-name-surname"
										value={client.shareHolderInfo.nameAndSurname}
										placeholder="Name and Surname"
										type="text"
										onChange={handleChangeShareHolderInfoInput}
										size="small"
										align="left"
										name="nameAndSurname"
									/>
								</div>
								<div style={{
									width: '48%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between'
								}}>
									<label
										htmlFor="label-shareHolderInfo-dateOfBirth"
										style={{
											margin: '8px 0',
											display: 'inline-block'
										}}>
										Date of incorporation
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
										id="label-shareHolderInfo-dateOfBirth"
										value={client.shareHolderInfo.dateOfBirth}
										min="1900-01-01"
										name="dateOfBirth"
										onChange={handleChangeShareHolderInfoInput}
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-country-incorporate"
										style={{ margin: '8px 0', display: 'inline-block' }}>
										Country of incorporation
									</label>
									<SelectDropdown
										onChange={(e: any) => handleSelectDropdownShareHolderInfo(e)}
										options={countries}
										placeholder='Select...'
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareHolderInfo-subsequentlyBusinessCompany"
										style={{ margin: '8px 0', display: 'inline-block' }}>
										Subsequently business company
									</label>
									<TextField
										id="label-shareHolderInfo-subsequentlyBusinessCompany"
										value={client.shareHolderInfo.subsequentlyBusinessCompany}
										placeholder="Subsequently business company"
										type="text"
										onChange={handleChangeShareHolderInfoInput}
										size="small"
										align="left"
										name="subsequentlyBusinessCompany"
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareHolderInfo-registeredOffice"
										style={{ margin: '8px 0', display: 'inline-block' }}>
										Registered office address
									</label>
									<TextField
										id="label-shareHolderInfo-registeredOffice"
										value={client.shareHolderInfo.registeredOffice}
										placeholder="Registered office address"
										type="text"
										onChange={handleChangeShareHolderInfoInput}
										size="small"
										align="left"
										name="registeredOffice"
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareHolderInfo-permanentResidence"
										style={{ margin: '8px 0', display: 'inline-block' }}>
										Permanent Residence
									</label>
									<TextField
										id="label-shareHolderInfo-permanentResidence"
										value={client.shareHolderInfo.permanentResidence}
										placeholder="Permanent Residence"
										type="text"
										onChange={handleChangeShareHolderInfoInput}
										size="small"
										align="left"
										name="permanentResidence"
									/>
								</div>
								<div style={{ width: '48%' }}>
									<label
										htmlFor="label-shareHolderInfo-idNumber"
										style={{ margin: '8px 0', display: 'inline-block' }}>
										Identification number
									</label>
									<TextField
										id="label-shareHolderInfo-idNumber"
										value={client.shareHolderInfo.idNumber}
										placeholder="Identification number"
										type="text"
										onChange={handleChangeShareHolderInfoInput}
										size="small"
										align="left"
										name="idNumber"
									/>
								</div>
							</div>
						</ShareHoldersContainer>
					) : null}
				</div>
				<div style={{ textAlign: 'center' }}>
					<Button variant="secondary" onClick={handleSubmit} disabled={!isValid}>
						{isValid ? 'Submit' : 'Please fill up all fields'}
					</Button>
				</div>
			</WrapContainer>

		</Portal>
	);
};
