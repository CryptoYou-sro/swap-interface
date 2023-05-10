import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../../components';
import countries from '../../data/countries.json';
import FUNDS_IRREGULAR_FOR_BUSINESS_LIST from '../../data/fundsIrregularForBussinesList.json';
import COUNTRIES from '../../data/listOfAllCountries.json';
import SOURCE_OF_FUNDS_LIST from '../../data/sourceOfFundsList.json';
import SOURCE_OF_INCOME_NATURE_LIST from '../../data/sourceOfIncomeNatureList.json';
import WORK_AREA_LIST from '../../data/workAreaList.json';
import { BASE_URL, ButtonEnum, button, findAndReplace, routes, useStore } from '../../helpers';
import { useAxios, useMedia } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { SelectDropdown } from '../selectDropdown/selectDropdown';
import { TextField } from '../textField/textField';
import { useToasts } from '../toast/toast';
import { ContentTitle } from './kycL2LegalModal';
import { Portal } from './portal';

type WrapperProps = {
	themeMode?: string;
};

const Wrapper = styled.div(({ themeMode }: WrapperProps) => {
	const { state: { theme } } = useStore();

	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		padding: ${spacing[10]} ${spacing[20]};
		color: ${themeMode === 'dark' ? '#000000' : themeMode === 'light' ? '#ffffff' : theme.font.default};
		`;
});

const ContentContainer = styled.div(() => {
	return css`
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	`;
});

const DisclaimerContainer = styled.div(() => {

	return css`
		display: flex;
		align-items: center;
		flex-direction: column;
	`;
});

const Label = styled.label(() => {

	return css`
		display: inline-block;
		margin-bottom: ${spacing[8]};
	`;
});


export const WrapContainer = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		width: 100%;
		overflow-y: auto;
		margin-bottom: ${spacing[10]};

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

const Title = styled.h2`
	text-align: center;
	font-size: ${fontSize[18]};
`;

const LabelFileInput = styled.label(() => {
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
			border: 1px solid ${theme.button.default};
			color: ${theme.button.default};
		}
	`;
});

const FileInput = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -100;
`;

const Select = styled.select(({ themeMode }: any) => {
	const {
		state: { theme }
	} = useStore();
	const { mobileWidth: isMobile } = useMedia('s');

	return css`
		width: ${isMobile ? '100%' : '50%'};
		height: 100%;
		max-height: ${pxToRem(46)};
		color: ${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default};
		background: none;
		border-radius: ${DEFAULT_BORDER_RADIUS};

		option {
			color: ${theme.font.default};;
			background: ${theme.background.default};;
		}
	`;
});

const DisclaimerTextList = styled.ul`
	padding-left: 0;
	list-style: none;
`;

const DisclaimerTextListItemBox = styled.div`
	display: flex;
	align-items: center;
`;

const DisclaimerTestListItem = styled.li`
margin-bottom: ${spacing[20]};
`;

const DisclaimerText = styled.div(() => {

	return css`
		margin-bottom: ${pxToRem(40)};
		font-size: ${fontSize[16]};
		padding: 0 ${pxToRem(2)};
	`;
});

const SpecifyContainer = styled.div(() => {
	const { mobileWidth: isMobile } = useMedia('s');

	return css`
		width: ${isMobile ? '100%' : '70%'};
		margin-bottom: ${spacing[10]};

	`;
});

const NextBtn = styled.button((props: any) => {
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
// const Container = styled.div(() => {
// 	const {
// 		state: { theme }
// 	} = useStore();
//
// 	return css`
// 		display: flex;
// 		flex-wrap: wrap;
// 		flex-direction: column;
// 		align-items: flex-end;
// 		justify-content: center;
// 		width: 40%;
// 		margin: ${spacing[10]};
// 		padding: ${spacing[10]};
// 		border: 1px solid ${theme.border.default};
// 		-webkit-box-shadow: 7px -7px 15px 0px rgba(0, 0, 0, 0.75);
// 	}`;
// });

// const ContainerText = styled.p`
// 	margin: ${spacing[6]} 0;
// `;
//
// const DeleteUboBtn = styled.button(() => {
// 	const {
// 		state: { theme }
// 	} = useStore();
//
// 	return css`
// 		cursor: pointer;
// 		margin: ${spacing[6]} 0;
// 		background-color: ${theme.button.transparent};
// 		border: 1px solid ${theme.button.error};
// 		border-radius: 2px;
// 		color: white;
// 		padding: ${spacing[8]} ${spacing[18]};
// 		text-align: center;
// 		text-decoration: none;
// 		font-size: ${fontSize[14]};
// 		-webkit-transition-duration: 0.4s; /* Safari */
// 		transition-duration: 0.3s;
//
// 		&:hover {
// 			background-color: ${theme.button.error};
// 		}
// 	`;
// });

const DateInput = styled.input((props: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		padding: 0 6px;
		cursor: pointer;
		background: none;
		color: ${props.themeMode === 'light' ? '#000000' : theme.font.default};
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

const FileContainerBox = styled.div(() => {
	const { mobileWidth: isMobile } = useMedia('s');

	return css`
	display: flex;
	align-items: baseline;
	flex-wrap: wrap;
	justify-content: space-between;
	text-align: left;
	margin-top: ${spacing[20]};
	padding: ${isMobile ? `0 ${spacing[12]}` : `0 ${pxToRem(100)} 0 0`};
`;
});

type Props = {
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2Modal = ({ showKycL2 = false, updateShowKycL2 }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(showKycL2);
	const { mobileWidth: isMobile } = useMedia('s');
	useEffect(() => {
		setShowModal(showKycL2);
	}, [showKycL2]);
	const [input, setInput] = useState<{
		fullName: string;
		dateOfBirth: string;
		appliedSanctions: string;
		citizenship: string[];
		countryOfWork: string[];
		declare: string[];
		declareOther: string;
		email: string;
		file: any;
		gender: string;
		hasCriminalRecords: string;
		irregularSourceOfFunds: string[];
		irregularSourceOfFundsOther: string;
		mailAddress: any;
		permanentAndMailAddressSame: string;
		placeOfBirth: string;
		politicallPerson: string;
		residence: any;
		sourceOfFunds: string[];
		sourceOfFundsOther: string;
		sourceOfIncome: string;
		sourceOfIncomeNature: string[];
		sourceOfIncomeNatureOther: string;
		taxResidency: string;
		workArea: string[];
		yearlyIncome: number | null;
	}>({
		fullName: '',
		dateOfBirth: '',
		appliedSanctions: '',
		citizenship: [],
		countryOfWork: [],
		declare: [],
		declareOther: '',
		email: '',
		file: {
			poaDoc1: null,
			posofDoc1: null,
			identificationDoc1: null,
			identificationDoc2: null,
			identificationSelfie: null,

		},
		gender: 'Select gender',
		hasCriminalRecords: '',
		irregularSourceOfFunds: [],
		irregularSourceOfFundsOther: '',
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			country: ''
		},
		permanentAndMailAddressSame: 'Yes',
		placeOfBirth: '',
		politicallPerson: '',
		residence: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			country: ''
		},
		sourceOfFunds: [],
		sourceOfFundsOther: '',
		sourceOfIncome: '',
		sourceOfIncomeNature: [],
		sourceOfIncomeNatureOther: '',
		taxResidency: 'Select country',
		workArea: [],
		yearlyIncome: null,
	});
	const [page, setPage] = useState<number>(0);
	const [selectWorkCountry, setSelectWorkCountry] = useState<any[]>([]);
	const [selectCitizenShip, setSelectCitizenShip] = useState<any[]>([]);

	const fileInputAddress = useRef<HTMLInputElement>();
	const fileInputDocs = useRef<HTMLInputElement>();
	const fileIdentificationDoc1 = useRef<HTMLInputElement>();
	const fileIdentificationDoc2 = useRef<HTMLInputElement>();
	const fileIdentificationDocSelfie = useRef<HTMLInputElement>();

	const { addToast }: any | null = useToasts();
	const {
		dispatch
	} = useStore();

	const api = useAxios();


	const myRef = useRef<HTMLDivElement | null>(null);
	const handleNext = () => {
		myRef?.current?.scrollTo(0, 0);
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		event.preventDefault();
		const bodyFormData = new FormData();
		bodyFormData.append('place_of_birth', input.placeOfBirth);
		bodyFormData.append('full_name', input.fullName);
		bodyFormData.append('dob', input.dateOfBirth);
		bodyFormData.append('residence', JSON.stringify(input.residence));
		if (input.mailAddress) {
			bodyFormData.append('mail_address', JSON.stringify(input.mailAddress));
		}
		bodyFormData.append('gender', input.gender);
		bodyFormData.append('citizenship', input.citizenship.join(', '));
		bodyFormData.append('poa_doc_1', input.file.poaDoc1);
		bodyFormData.append('posof_doc_1', input.file.posofDoc1);
		bodyFormData.append('identification_doc_1', input.file.identificationDoc1);
		bodyFormData.append('identification_doc_2', input.file.identificationDoc2);
		bodyFormData.append('identification_selfie', input.file.identificationSelfie);
		bodyFormData.append('email', input.email);
		bodyFormData.append('tax_residency', input.taxResidency);
		bodyFormData.append('politicall_person', input.politicallPerson === 'Yes' ? 'true' : 'false');
		bodyFormData.append('applied_sanctions', input.appliedSanctions === 'Yes' ? 'true' : 'false');
		bodyFormData.append('country_of_work', input.countryOfWork.join(', '));
		bodyFormData.append('work_area', input.workArea.join(', '));
		const sourceOfIncomeNature = findAndReplace(input.sourceOfIncomeNature, 'Other', input.sourceOfIncomeNatureOther);
		bodyFormData.append('source_of_income_nature', sourceOfIncomeNature.join(', '));
		const yearlyIncome = input.yearlyIncome ? Number(input.yearlyIncome).toFixed(4) : '0';
		bodyFormData.append('yearly_income', yearlyIncome);
		bodyFormData.append('source_of_income', input.sourceOfIncome);
		const sourceOfFunds = findAndReplace(input.sourceOfFunds, 'Other', input.sourceOfFundsOther);
		bodyFormData.append('source_of_funds', sourceOfFunds.join(', '));
		const irregularSourceOfFunds = findAndReplace(input.irregularSourceOfFunds, 'Other', input.irregularSourceOfFundsOther);
		bodyFormData.append('irregular_source_of_funds', irregularSourceOfFunds.join(', '));
		bodyFormData.append(
			'has_criminal_records',
			input.hasCriminalRecords === 'Yes' ? 'true' : 'false'
		);
		bodyFormData.append('declare', `${input.declare}${input.declareOther}`);

		api.request({
			method: 'POST',
			url: `${BASE_URL}${routes.kycL2NaturalForm}`,
			data: bodyFormData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then(function (response) {
				// handle success
				// Status 201 CREATED
				console.log(response);
				if (response.status === 201) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.CHECK_KYC_L2 });
					addToast(
						'Your documents are under review, please wait for the results of the verification!',
						'info'
					);
				}
			})
			.catch(function (response) {
				// handle error
				console.log(response);
				addToast('Something went wrong, please fill the form and try again!', 'error');
			});
		updateShowKycL2(false);
	};
	const handleChangeInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
	};
	const handleChangeMailInput = (event: any) => {
		setInput({
			...input,
			mailAddress: { ...input.mailAddress, [event.target.name]: event.target.value }
		});
	};
	const handleChangeResidenceInput = (event: any) => {
		setInput({
			...input,
			residence: { ...input.residence, [event.target.name]: event.target.value }
		});
	};
	const handleChangeCheckBox = (event: any) => {
		const { value, checked } = event.target;
		const attributeValue: string = event.target.attributes['data-key'].value;

		if (checked && !input[attributeValue as keyof typeof input].includes(value)) {
			setInput({
				...input,
				[attributeValue]: [...input[attributeValue as keyof typeof input], value]
			});
		}
		if (!checked && input[attributeValue as keyof typeof input].includes(value)) {
			const filteredArray: string[] = input[attributeValue as keyof typeof input].filter(
				(item: any) => item !== value
			);
			setInput({ ...input, [attributeValue]: [...filteredArray] });
		}
	};

	const handleChangeDate = (event: any) => {
		setInput({ ...input, dateOfBirth: event.target.value });
	};

	const handleSelectDropdownCountryOfWork = (event: any) => {
		setSelectWorkCountry([...event]);
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setInput({ ...input, countryOfWork: countries });
	};
	const handleSelectDropdownNatural = (event: any) => {
		setSelectCitizenShip([...event]);
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setInput({ ...input, citizenship: countries });
	};
	const handleChangeFileInput = () => {
		const filePosoaDoc1: any =
			fileInputAddress?.current?.files && fileInputAddress.current.files[0];
		const filePosofDoc1: any =
			fileInputDocs?.current?.files && fileInputDocs.current.files[0];
		setInput({
			...input,
			file: {
				...input.file,
				poaDoc1: filePosoaDoc1,
				posofDoc1: filePosofDoc1,
			}
		});
	};

	const handleFileIdentification = () => {
		const fileIdentification1: any =
			fileIdentificationDoc1?.current?.files && fileIdentificationDoc1.current.files[0];
		const fileIdentification2: any =
			fileIdentificationDoc2?.current?.files && fileIdentificationDoc2.current.files[0];
		const fileIdentificationSelfie: any =
			fileIdentificationDocSelfie?.current?.files && fileIdentificationDocSelfie.current.files[0];
		setInput({
			...input,
			file: {
				...input.file,
				identificationDoc1: fileIdentification1,
				identificationDoc2: fileIdentification2,
				identificationSelfie: fileIdentificationSelfie
			}
		});
	};

	const handleDropDownInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
	};
	const handleDropDownInputResidence = (event: any) => {
		setInput({ ...input, residence: { ...input.residence, country: [event.target.value] } });
	};
	const handleDropDownInputMailAddress = (event: any) => {
		setInput({ ...input, mailAddress: { ...input.mailAddress, country: [event.target.value] } });
	};

	const handleOnClose = () => {
		setShowModal(false);
		updateShowKycL2(false);
	};

	const handleOnBack = () => {
		if (page > 0) {
			setPage((prev: number) => prev - 1);
		}
	};

	useEffect(() => {
		setInput({ ...input, declareOther: '' });
	}, [input.declare]);

	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		setIsValid(false);
		if (page === 0) {
			setIsValid(true);
		}
		if (page === 1 && input.email.includes('@')
			&& input.email.includes('.')
			&& input.email.trim().length > 2
			&& input.fullName.trim().length >= 2
			&& input.dateOfBirth.trim().length > 0
			&& input.gender !== 'Select gender'
			&& input.placeOfBirth.trim().length >= 2) {
			setIsValid(true);
		} else if (page === 2 && input.file.identificationDoc1 && input.file.identificationDoc2 && input.file.identificationSelfie) {
			setIsValid(true);
		} else if (page === 3 && input.sourceOfIncome.trim().length >= 2 && Number(input.yearlyIncome) > 0 && input.taxResidency !== 'Select country') {
			setIsValid(true);
		} else if (page === 4 && input.countryOfWork.length > 0) {
			setIsValid(true);
		} else if (page === 5 && input.workArea.length > 0) {
			setIsValid(true);
		} else if (page === 6 && input.sourceOfFunds.length > 0 && !input.sourceOfFunds.includes('Other') ||
			page == 6 && input.sourceOfFunds.includes('Other') && input.sourceOfFundsOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 7 && input.sourceOfIncomeNature.length > 0 && !input.sourceOfIncomeNature.includes('Other') ||
			page === 7 && input.sourceOfIncomeNature.includes('Other') && input.sourceOfIncomeNatureOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 8 && input.citizenship.length > 0) {
			setIsValid(true);
		} else if (page === 9 && !input.irregularSourceOfFunds.includes('Other') && input.irregularSourceOfFunds.length > 0 ||
			page === 9 && input.irregularSourceOfFunds.includes('Other') && input.irregularSourceOfFundsOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 10 && input.declare.includes('I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country') && !input.declareOther.trim().length || page === 10 && input.declareOther.trim().length > 0) {
			setIsValid(true);
		} else if (page === 11 && input.hasCriminalRecords.length > 0) {
			setIsValid(true);
		} else if (page === 12 && input.appliedSanctions.length > 0) {
			setIsValid(true);
		} else if (page === 13 && input.politicallPerson.length > 0) {
			setIsValid(true);
		} else if (page === 14 && !Object.values(input.residence).includes('') && !input.residence.country.includes('Select country')) {
			setIsValid(true);
		} else if (page === 15 && input.permanentAndMailAddressSame === 'Yes' || page === 15 && !Object.values(input.mailAddress).includes('') && !input.mailAddress.country.includes('Select country')) {
			setIsValid(true);
		} else if (page === 16 && input.file.poaDoc1 && input.file.posofDoc1) {
			setIsValid(true);
		}
	}, [page, input]);

	return (
		<Portal
			size="xxl"
			isOpen={showModal}
			handleClose={handleOnClose}
			hasBackButton={page !== 0}
			backgroundColor='light'
			handleBack={handleOnBack}
			closeOutside={false}
			themeMode='light'>
			<Wrapper ref={myRef} themeMode='dark'>
				<ContentContainer>
					{page === 0 && (
						<WrapContainer>
							<Title style={{ fontWeight: 'normal' }}>Disclaimer</Title>
							<DisclaimerContainer>
								<DisclaimerText>
									<p>This is the Know Your Customer (KYC) and Anti-Money Laundering (AML) form for individuals, as
										mandated
										by the European Union regulations.
										To complete this form, please ensure you have the following documents at hand:</p>
									<DisclaimerTextList>
										<DisclaimerTestListItem>
											<DisclaimerTextListItemBox >
												<div style={{ marginRight: '10px' }}>
													<Icon size={55} icon='passport' />
												</div>
												<p>	&#9679; A valid government-issued identification document, such as a Passport or National ID card.</p>
											</DisclaimerTextListItemBox>
										</DisclaimerTestListItem>
										<DisclaimerTestListItem>
											<DisclaimerTextListItemBox>
												<div style={{ marginRight: '10px' }}>
													<Icon size={55} icon='documents' />
												</div>
												<p>
													&#9679; Proof of address, such as a recent utility bill, bank statement, or rental agreement (dated
													within the last three months).
												</p>
											</DisclaimerTextListItemBox>
										</DisclaimerTestListItem>
										<DisclaimerTestListItem>
											<DisclaimerTextListItemBox>
												<div style={{ marginRight: '10px' }}>
													<Icon size={55} icon='finances' />
												</div>
												<p>
													&#9679; A document proving information on your source of funds (bank statement, payslip, tax return
													etc.)
												</p>
											</DisclaimerTextListItemBox>
										</DisclaimerTestListItem>
										<DisclaimerTestListItem>
											<DisclaimerTextListItemBox>
												<div style={{ marginRight: '10px' }}>
													<Icon size={55} icon='selfie' />
												</div>
												<p>
													&#9679; A photo of yourself (selfie) in which you're holding a piece of paper that clearly shows today's
													date and the number of the document you will upload (Passport / ID)
												</p>
											</DisclaimerTextListItemBox>
										</DisclaimerTestListItem>
									</DisclaimerTextList>
									<p>The estimated time required to complete this form is approximately 10 minutes.<br />
										You will receive an email notification regarding the status of your verification process once it's
										completed. <br /></p>
									<p style={{ marginBottom: 0 }}>Click on "I Agree" to start.</p>
								</DisclaimerText>
							</DisclaimerContainer>
						</WrapContainer>
					)}
					{page === 1 && (
						<WrapContainer>
							<Title>KYC and AML Questionnaire for Individuals</Title>
							<div style={{ marginRight: '15px' }}>
								<div style={{ display: 'flex', alignItems: 'baseline' }}>
									<div style={{ marginRight: '10px', width: '48%', }}>
										<Label htmlFor="label-full-name-natural">
											Name and Surname
										</Label>
										<TextField
											id="label-full-name-natural"
											value={input.fullName}
											placeholder="Name and Surname"
											type="text"
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="fullName"
											error={input.fullName.length < 2}
											maxLength={100}
											themeMode='light'
										/>
									</div>
									<div style={{ marginBottom: '10px', width: '48%', }}>
										<Label htmlFor="label-place-of-birth">Place of birth</Label>
										<TextField
											id="label-place-of-birth"
											value={input.placeOfBirth}
											placeholder="Place of birth"
											type="text"
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="placeOfBirth"
											error={input.placeOfBirth.length < 2}
											maxLength={100}
											themeMode='light'
										/>
									</div>
								</div>
								<div style={{ display: 'flex', alignItems: 'baseline' }}>
									<div style={{ width: '48%', marginRight: '10px', display: 'flex', flexDirection: 'column' }}>
										<Label htmlFor="label-natural-dateOfBirth">Date of birth</Label>
										<DateInput
											type="date"
											id="label-natural-dateOfBirth"
											value={input.dateOfBirth}
											min="1900-01-01"
											name="dateOfBirth"
											onChange={(e: any) => handleChangeDate(e)}
											// @ts-ignore
											themeMode='light'
										/>
									</div>
									<div style={{ marginBottom: '10px', width: '48%', }}>
										<Label htmlFor="label-email">Email</Label>
										<TextField
											id="label-email"
											value={input.email}
											placeholder="Email"
											type="email"
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="email"
											maxLength={100}
											themeMode='light'
										/>
									</div>
								</div>
								<div>
									<div style={{ marginBottom: '10px' }}>
										<Label htmlFor="label-select-gender" style={{ display: 'block' }}>
											Gender
										</Label>
										<Select
											name="gender"
											onChange={handleDropDownInput}
											value={input.gender}
											id="label-select-gender"
											// @ts-ignore
											themeMode='light'
											style={{
												minHeight: '46px',
												maxWidth: '48%'
											}}>
											<option value="Select gender">Select gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
										</Select>
									</div>
								</div>
							</div>
						</WrapContainer>
					)}
					{page === 2 && (
						<WrapContainer>
							<Title>KYC and AML Questionnaire for Individuals</Title>
							<FileContainerBox>
								<ContentTitle style={{ width: '100%', marginRight: '10px' }}>Provide photos of one of the following documents: Passport /ID</ContentTitle>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
									<ContentTitle>
										Front side / second page for Passport
									</ContentTitle>
									<LabelFileInput htmlFor="file-natural-identification-doc-1">
										<FileInput
											id="file-natural-identification-doc-1"
											type="file"
											ref={fileIdentificationDoc1 as any}
											onChange={handleFileIdentification}>
										</FileInput>
										{input.file.identificationDoc1 && input.file.identificationDoc1.name.length < 15 ? input.file.identificationDoc1.name : input.file.identificationDoc1 && input.file.identificationDoc1.name.length >= 15 ? input.file.identificationDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelFileInput>
								</div>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
									<ContentTitle style={{ maxWidth: '75%', marginRight: '10px' }}>
										Back side / third page for Passport
									</ContentTitle>
									<LabelFileInput htmlFor="file-natural-identification-doc-2">
										<FileInput
											id="file-natural-identification-doc-2"
											type="file"
											ref={fileIdentificationDoc2 as any}
											onChange={handleFileIdentification}>
										</FileInput>
										{input.file.identificationDoc2 && input.file.identificationDoc2.name.length < 15 ? input.file.identificationDoc2.name : input.file.identificationDoc2 && input.file.identificationDoc2.name.length >= 15 ? input.file.identificationDoc2.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelFileInput>
								</div>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
									<ContentTitle style={{ maxWidth: '75%', marginRight: '10px' }}>
										Submit a selfie in which you're holding a piece of paper that clearly shows today's date <br /> and the
										number of the document you have uploaded (Passport / ID).</ContentTitle>
									<LabelFileInput htmlFor="file-natural-selfie">
										<FileInput
											id="file-natural-selfie"
											type="file"
											ref={fileIdentificationDocSelfie as any}
											onChange={handleFileIdentification}>
										</FileInput>
										{input.file.identificationSelfie && input.file.identificationSelfie.name.length < 15 ? input.file.identificationSelfie.name : input.file.identificationSelfie && input.file.identificationSelfie.name.length >= 15 ? input.file.identificationSelfie.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelFileInput>
								</div>
							</FileContainerBox>
						</WrapContainer>
					)}
					{page === 3 && (
						<WrapContainer>
							<Title>KYC and AML Questionnaire for Individuals</Title>
							<div style={{ width: `${isMobile ? '100%' : '75%'}`, margin: `${spacing[20]} auto` }}>
								<Label htmlFor="label-sourceOfIncome">What is the prevailing source of your income?</Label>
								<TextField
									id="label-sourceOfIncome"
									value={input.sourceOfIncome}
									placeholder="Employment/business, real estate, trading, etc."
									type="text"
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="sourceOfIncome"
									maxLength={100}
									themeMode='light'
								/>
							</div>
							<div style={{ width: `${isMobile ? '100%' : '75%'}`, margin: `${spacing[20]} auto` }}>
								<Label htmlFor="label-net-yearly-income">What is your net yearly income in € Euro ?</Label>
								<TextField
									id="label-net-yearly-income"
									value={input.yearlyIncome !== null && input.yearlyIncome}
									placeholder="Net yearly income"
									type="number"
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="yearlyIncome"
									maxLength={100}
									themeMode='light'
								/>
							</div>
							<div style={{ width: `${isMobile ? '100%' : '75%'}`, margin: `${spacing[20]} auto` }}>
								<Label htmlFor="label-select-tax-residency">Declare your tax
									Residency</Label>
								<Select
									// @ts-ignore
									themeMode='light'
									style={{ minHeight: `${pxToRem(46)}`, width: '100%' }}
									name="taxResidency"
									onChange={handleDropDownInput}
									value={input.taxResidency}
									id="label-select-tax-residency">
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
						</WrapContainer>
					)}
					{page === 4 && (
						<div style={{ marginBottom: '10px', width: '75%' }}>
							<Title style={{ marginBottom: `${isMobile ? '0' : '20px'}}` }}>KYC and AML Questionnaire for Individuals</Title>
							<ContentTitle>
								State the country in which you are conducting your work / business activity
							</ContentTitle>
							<SelectDropdown
								themeMode='light'
								onChange={(e) => handleSelectDropdownCountryOfWork(e)}
								defaultValue={selectWorkCountry}
								placeholder='Select country...'
								options={countries}
							/>
						</div>
					)}
					{page === 5 && (
						<WrapContainer>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									flexDirection: 'column',
									alignItems: 'stretch',
									marginBottom: '15px'
								}}>
								<ContentTitle>
									Select the areas in which you conduct your work / business activity:
								</ContentTitle>
								{WORK_AREA_LIST.map((activity: string, index: number) => {
									return (
										<div
											key={index}
											style={{
												display: 'flex',
												justifyContent: 'flex-start',
												marginBottom: '8px'
											}}>
											<input
												type="checkbox"
												value={activity}
												name={activity}
												id={`workAreaList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												checked={input.workArea.includes(`${activity}`)}
												data-key="workArea"
											/>
											<Label
												style={{ margin: '0 0 0 4px' }}
												htmlFor={`workAreaList-checkbox-${index}`}>{activity}</Label>
										</div>
									);
								})}
							</div>
						</WrapContainer>
					)}
					{page === 6 && (
						<WrapContainer>
							<ContentTitle>
								State which is the source of funds intended for your transactions:
							</ContentTitle>
							{SOURCE_OF_FUNDS_LIST.map((activity: string, index: number) => {
								return (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'

										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`sourceOfFundsList-checkbox-${index}`}
											onChange={handleChangeCheckBox}
											checked={input.sourceOfFunds.includes(`${activity}`)}
											data-key="sourceOfFunds"

										/>
										<Label style={{ margin: '0 0 0 4px' }}
											htmlFor={`sourceOfFundsList-checkbox-${index}`}>{activity}</Label>
									</div>
								);
							})}
							{input.sourceOfFunds.includes('Other') ? (
								<SpecifyContainer>
									<TextField
										value={input.sourceOfFundsOther}
										type="text"
										placeholder="Specify..."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfFundsOther"
										maxLength={100}
										themeMode='light'
									/>
								</SpecifyContainer>
							) : null}
						</WrapContainer>
					)}
					{page === 7 && (
						<WrapContainer>
							<ContentTitle>
								State which is the nature of your prevailing source of income
							</ContentTitle>
							{SOURCE_OF_INCOME_NATURE_LIST.map((activity: string, index: number) => {
								return (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'flex-start',
											marginBottom: '8px'
										}}>
										<input
											type="checkbox"
											value={activity}
											name={activity}
											id={`sourceOfIncomeNatureList-checkbox-${index}`}
											onChange={handleChangeCheckBox}
											checked={input.sourceOfIncomeNature.includes(`${activity}`)}
											data-key="sourceOfIncomeNature"
										/>
										<Label
											style={{ margin: '0 0 0 4px' }}
											htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>{activity}</Label>
									</div>
								);
							})}
							{input.sourceOfIncomeNature.includes('Other') ? (
								<SpecifyContainer>
									<TextField
										value={input.sourceOfIncomeNatureOther}
										type="text"
										placeholder="Food industry, hospitality, transportation, consultancy, etc."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="sourceOfIncomeNatureOther"
										maxLength={100}
										themeMode='light'
									/>
								</SpecifyContainer>
							) : null}
						</WrapContainer>
					)}
					{page === 8 && (
						<SpecifyContainer>
							<ContentTitle style={{ textAlign: 'center' }}>Citizenship(s)</ContentTitle>
							<SelectDropdown
								themeMode='light'
								name='citizenship'
								placeholder='Select country...'
								defaultValue={selectCitizenShip}
								onChange={(e: any) => handleSelectDropdownNatural(e)}
								options={countries}
							/>
						</SpecifyContainer>
					)}
					{page === 9 && (
						<WrapContainer>
							<div style={{ marginBottom: '15px' }}>
								<ContentTitle>
									State which of the following incomes of funds intended for business comes from irregular activities
									(select none if you don't conduct irregular activities):
								</ContentTitle>
								{FUNDS_IRREGULAR_FOR_BUSINESS_LIST.map((activity: string, index: number) => {
									return (
										<div
											key={index}
											style={{
												display: 'flex',
												justifyContent: 'flex-start',
												marginBottom: '8px'
											}}>
											<input
												type="checkbox"
												value={activity}
												name={activity}
												id={`fundsIrregularForBusinessList-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												checked={input.irregularSourceOfFunds.includes(`${activity}`)}
												data-key="irregularSourceOfFunds"
											/>
											<Label
												style={{ margin: '0 0 0 4px' }}
												htmlFor={`fundsIrregularForBusinessList-checkbox-${index}`}>
												{activity}
											</Label>
										</div>
									);
								})}
								{input.irregularSourceOfFunds.includes('Other') ? (
									<SpecifyContainer>
										<TextField
											value={input.irregularSourceOfFundsOther}
											type="text"
											placeholder="Specify..."
											onChange={handleChangeInput}
											size="small"
											align="left"
											name="irregularSourceOfFundsOther"
											maxLength={100}
											themeMode='light'
										/>
									</SpecifyContainer>
								) : null}
							</div>
						</WrapContainer>
					)}
					{page === 10 && (
						<WrapContainer>
							<ContentTitle>
								I declare that
							</ContentTitle>
							<div style={{ marginBottom: '14px' }}>
								<Label htmlFor='declare-nationonal-sole-state'>
									<input
										id='declare-nationonal-sole-state'
										type="radio"
										value='I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country'
										checked={input.declare.includes('I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country')}
										onChange={handleChangeInput}
										name="declare"
									/>
									I am a national of the aforementioned sole state or country and simultaneously I am registered to a
									permanent or other type of residency in this state or country
								</Label>
							</div>
							<div style={{ marginBottom: '14px' }}>
								<Label htmlFor='declare-nationonal-other-country-or-state'>
									<input
										id='declare-nationonal-other-country-or-state'
										type="radio"
										value='I am a national of another state or country, specifically:'
										checked={input.declare.includes('I am a national of another state or country, specifically:')}
										onChange={handleChangeInput}
										name="declare"
									/>
									I am a national of another state or country, specifically:
								</Label>
							</div>
							{input.declare.includes(
								'I am a national of another state or country, specifically:'
							) ? (
								<div style={{ marginBottom: '10px' }}>
									<TextField
										value={input.declareOther}
										type="text"
										placeholder="Specify..."
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="declareOther"
										maxLength={100}
										themeMode='light'
									/>
								</div>
							) : null}
							<div style={{ marginBottom: '14px' }}>
								<Label htmlFor='declare-permanent-register'>
									<input
										id='declare-permanent-register'
										type="radio"
										value='I am registered to a permanent or other type of residency in another state or country, specifically:'
										checked={input.declare.includes('I am registered to a permanent or other type of residency in another state or country, specifically:')}
										onChange={handleChangeInput}
										name="declare"
									/>
									I am a national of another state or country, specifically:
								</Label>
							</div>
							{input.declare.includes(
								'I am registered to a permanent or other type of residency in another state or country, specifically:'
							) ? (
								<TextField
									value={input.declareOther}
									type="text"
									placeholder="Specify..."
									onChange={handleChangeInput}
									size="small"
									align="left"
									name="declareOther"
									maxLength={100}
									themeMode='light'
								/>
							) : null}
						</WrapContainer>
					)}
					{page === 11 && (
						<div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
							<p style={{ marginBottom: '25px', marginRight: '30px' }}>
								Have you ever been convicted or prosecuted for a criminal offense, in particular an
								offense against property or economic offense committed not only in relation with
								work or business activities (without regards to presumption of innocence)?
							</p>
							<Label htmlFor="hasCriminalRecordsTrue" style={{ margin: '0 10px 0 0' }}>
								<input
									id="hasCriminalRecordsTrue"
									type="radio"
									value="Yes"
									checked={input.hasCriminalRecords === 'Yes'}
									onChange={handleChangeInput}
									name="hasCriminalRecords"
								/>
								Yes
							</Label>
							<Label htmlFor="hasCriminalRecordsFalse">
								<input
									id="hasCriminalRecordsFalse"
									type="radio"
									value="No"
									checked={input.hasCriminalRecords === 'No'}
									onChange={handleChangeInput}
									name="hasCriminalRecords"
								/>
								No
							</Label>
						</div>
					)}
					{page === 12 && (
						<div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
							<p style={{ marginBottom: '25px', marginRight: '30px' }}>
								Are you a person against whom are applied Czech and/or international sanctions?
							</p>
							<Label htmlFor="appliedSanctionsTrue" style={{ margin: ' 0 10px 0 0' }}>
								<input
									id="appliedSanctionsTrue"
									type="radio"
									value="Yes"
									checked={input.appliedSanctions === 'Yes'}
									onChange={handleChangeInput}
									name="appliedSanctions"
								/>
								Yes
							</Label>
							<Label htmlFor="appliedSanctionsFalse">
								<input
									id="appliedSanctionsFalse"
									type="radio"
									value="No"
									checked={input.appliedSanctions === 'No'}
									onChange={handleChangeInput}
									name="appliedSanctions"
								/>
								No
							</Label>
						</div>
					)}
					{page === 13 && (
						<div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }}>
							<p style={{ marginBottom: '25px', marginRight: '30px' }}>Are you a politically exposed person?</p>
							<Label htmlFor="politicallPersonTrue" style={{ margin: '0 10px 0 0' }}>
								<input
									id="politicallPersonTrue"
									type="radio"
									value="Yes"
									checked={input.politicallPerson === 'Yes'}
									onChange={handleChangeInput}
									name="politicallPerson"
								/>
								Yes
							</Label>
							<Label htmlFor="politicallPersonFalse">
								<input
									id="politicallPersonFalse"
									type="radio"
									value="No"
									checked={input.politicallPerson === 'No'}
									onChange={handleChangeInput}
									name="politicallPerson"
								/>
								No
							</Label>
						</div>
					)}
					{page === 14 && (
						<div>
							<ContentTitle>Your Residence</ContentTitle>
							<div style={{ display: 'flex' }}>
								<div style={{ width: '50%', marginRight: '20px' }}>
									<Label htmlFor="input.residence.country" style={{ marginTop: '6px' }}>
										Country
									</Label>
									<Select
										// @ts-ignore
										themeMode='light'
										style={{ width: '100%' }}
										onChange={handleDropDownInputResidence}
										value={input.residence.country}
										id="input.residence.country">
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
									<Label
										htmlFor="label-address-permanent-street"
										style={{ marginTop: '6px' }}>
										Street
									</Label>
									<TextField
										id="label-address-permanent-street"
										value={input.residence.street}
										placeholder="Street"
										type="text"
										onChange={handleChangeResidenceInput}
										size="small"
										align="left"
										name="street"
										maxLength={100}
										themeMode='light'
									/>
									<Label
										htmlFor="label-address-permanent-street-number"
										style={{ marginTop: '6px' }}>
										Street number
									</Label>
									<TextField
										id="label-address-permanent-street-number"
										value={input.residence.streetNumber}
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
								<div style={{ width: '50%' }}>
									<Label
										htmlFor="label-address-permanent-municipality"
										style={{ marginTop: '6px' }}>
										City
									</Label>
									<TextField
										id="label-address-permanent-municipality"
										value={input.residence.municipality}
										placeholder="Municipality"
										type="text"
										onChange={handleChangeResidenceInput}
										size="small"
										align="left"
										name="municipality"
										maxLength={100}
										themeMode='light'
									/>
									<Label
										htmlFor="label-address-permanent-zipCode"
										style={{ marginTop: '6px' }}>
										ZIP Code
									</Label>
									<TextField
										id="label-address-permanent-zipCode"
										value={input.residence.zipCode}
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
						</div>
					)}
					{page === 15 && (
						<div>
							<div style={{ display: 'flex', alignItems: 'baseline' }}>
								<p style={{ marginBottom: '25px', marginRight: '20px' }}>
									Is your permanent (RESIDENCE) address the same as your mailing address?
								</p>
								<Label htmlFor="label-mailing-permanent-address-true" style={{ marginRight: '10px' }}>
									<input
										id="label-mailing-permanent-address-true"
										type="radio"
										value="Yes"
										checked={input.permanentAndMailAddressSame === 'Yes'}
										onChange={handleChangeInput}
										name="permanentAndMailAddressSame"
									/>
									Yes
								</Label>
								<Label htmlFor="label-mailing-permanent-address-false">
									<input
										id="label-mailing-permanent-address-false"
										type="radio"
										value="No"
										checked={input.permanentAndMailAddressSame === 'No'}
										onChange={handleChangeInput}
										name="permanentAndMailAddressSame"
									/>
									No
								</Label>
							</div>
							{input.permanentAndMailAddressSame === 'No' && (
								<>
									<div style={{ display: 'flex' }}>
										<div style={{ width: '50%', marginRight: '20px' }}>
											<Label
												htmlFor="label-input-mailAddress-country"
												style={{
													marginTop: '6px'
												}}>
												Country
											</Label>
											<Select
												// @ts-ignore
												themeMode='light'
												style={{ width: '100%' }}
												name="mailAddressStateOrCountry"
												onChange={handleDropDownInputMailAddress}
												value={input.mailAddress.country}
												id="label-input-mailAddress-country">
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
											<Label
												htmlFor="label-input-mailAddress-street"
												style={{
													marginTop: '6px'
												}}>
												Street
											</Label>
											<TextField
												id="label-input-mailAddress-street"
												value={input.mailAddress.street}
												placeholder="Street"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="street"
												maxLength={100}
												themeMode='light'
											/>
											<Label
												htmlFor="label-input-mailAddress-streetNumber"
												style={{
													marginTop: '6px'
												}}>
												Street number
											</Label>
											<TextField
												id="label-input-mailAddress-streetNumber"
												value={input.mailAddress.streetNumber}
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
										<div style={{ width: '50%' }}>
											<Label
												htmlFor="label-input-mailAddress-municipality"
												style={{
													marginTop: '6px'
												}}>
												City
											</Label>
											<TextField
												id="label-input-mailAddress-municipality"
												value={input.mailAddress.municipality}
												placeholder="Municipality"
												type="text"
												onChange={handleChangeMailInput}
												size="small"
												align="left"
												name="municipality"
												maxLength={100}
												themeMode='light'
											/>
											<Label
												htmlFor="label-input-mailAddress-zipCode"
												style={{
													marginTop: '6px'
												}}>
												ZIP Code
											</Label>
											<TextField
												id="label-input-mailAddress-zipCode"
												value={input.mailAddress.zipCode}
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
						</div>
					)}
					{page === 16 && (
						<WrapContainer>
							<Title>KYC and AML Questionnaire for Individuals</Title>
							<FileContainerBox>
								<ContentTitle style={{ maxWidth: `${isMobile ? '100%' : '75%'}` }}>
									Provide a proof of address (copies of statements of account kept by an institution in the EEA)
								</ContentTitle>
								<LabelFileInput htmlFor="file-input-address">
									<FileInput
										id="file-input-address"
										type="file"
										ref={fileInputAddress as any}
										onChange={handleChangeFileInput}>
									</FileInput>
									{input.file.poaDoc1 && input.file.poaDoc1.name.length < 15 ? input.file.poaDoc1.name : input.file.poaDoc1 && input.file.poaDoc1.name.length >= 15 ? input.file.poaDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
								</LabelFileInput>
								<ContentTitle style={{ maxWidth: `${isMobile ? '100%' : '75%'}` }}>
									Provide a document proving information on the source of your funds (bank statement, payslip, tax
									return, etc.)
								</ContentTitle>
								<LabelFileInput htmlFor="file-input-proof">
									<FileInput
										id="file-input-proof"
										type="file"
										ref={fileInputDocs as any}
										onChange={handleChangeFileInput}>
									</FileInput>
									{input.file.posofDoc1 && input.file.posofDoc1.name.length < 15 ? input.file.posofDoc1.name : input.file.posofDoc1 && input.file.posofDoc1.name.length >= 15 ? input.file.posofDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
								</LabelFileInput>
							</FileContainerBox>
						</WrapContainer>
					)}
					{page < 16 && (
						<NextBtn onClick={handleNext} disabled={!isValid}>
							{page === 0 ? 'I Agree' : 'Next'}
						</NextBtn>
					)}
					{page >= 16 && (
						<SubmitBtn
							disabled={!isValid}
							onClick={handleSubmit}>
							Submit
						</SubmitBtn>
					)}
				</ContentContainer>
			</Wrapper>
		</Portal>
	);
};
