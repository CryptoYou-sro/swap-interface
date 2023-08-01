import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';
import countries from '../../data/countries.json';
import COUNTRIES from '../../data/listOfAllCountries.json';
import NET_YEARLY_INCOME_LIST_COMPANY from '../../data/netYearlyCompanyIncome.json';
import PREVAILING_SOURCE_OF_INCOME_COMPANY from '../../data/prevailingSourceOfIncomeCompany.json';
import REPRESENT_PERSON from '../../data/representClient.json';
import SOURCE_OF_FUNDS_LIST_COMPANY from '../../data/sourceOfFundsListCompany.json';
import WORK_AREA_LIST from '../../data/workAreaList.json';
import {
	BASE_URL,
	KycL2BusinessEnum,
	KycL2BusinessReprEnum,
	KycL2BusinessStatusEnum,
	findAndReplace,
	useStore
} from '../../helpers';
import { useAxios, useMedia } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { SelectDropdown } from '../selectDropdown/selectDropdown';
import { TextField } from '../textField/textField';
import { Portal } from './portal';
import { ShareHoldersModal } from './shareholdersModal';
import { SupervisoryMembers } from './supervisoryMembers';
import { UboModal } from './uboModal';

type WrapperProps = {
	themeMode?: string;
};

const Wrapper = styled.div(({ themeMode }: WrapperProps) => {
	const { state: { theme } } = useStore();

	return css`
		display: flex;
		width: 100%;
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[20]};
		color: ${themeMode === 'dark' ? '#000000' : themeMode === 'light' ? '#ffffff' : theme.font.default};
	`;
});

const Title = styled.h2(() => {
	return css`
		text-align: left;
		margin-bottom: ${spacing[40]};
		line-height: 1.4;
	`;
});
export const ContentTitle = styled.p`
	margin-bottom: ${pxToRem(24)};
	font-size: ${fontSize[18]};
	text-align: left;
	line-height: 1.4;
`;

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
			color: ${theme.font.default};
			background: ${theme.background.default};
		}
	`;
});

const Container = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: 40%;
		margin: ${spacing[10]};
		padding: ${spacing[10]};
		border: 1px solid ${theme.border.default};
		-webkit-box-shadow: 7px -7px 15px 0px rgba(0, 0, 0, 0.75);
	`;
});

const ContainerText = styled.p`
	margin: ${spacing[6]} 0;
`;

const DeleteUboBtn = styled.button(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		cursor: pointer;
		margin: ${spacing[6]} 0;
		background-color: ${theme.button.transparent};
		border: 1px solid ${theme.button.error};
		border-radius: 2px;
		color: white;
		padding: ${spacing[8]} ${spacing[18]};
		text-align: center;
		text-decoration: none;
		font-size: ${fontSize[14]};
		-webkit-transition-duration: 0.4s; /* for Safari */
		transition-duration: 0.3s;

		&:hover {
			background-color: ${theme.button.error};
		}
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
	showKycL2: boolean;
	updateShowKycL2?: any;
};
export const KycL2LegalModal = ({ showKycL2 = true, updateShowKycL2 }: Props) => {
	const { mobileWidth: isMobile } = useMedia('s');
	const [showModal, setShowModal] = useState<boolean>(showKycL2);
	const [isValid, setIsValid] = useState(false);
	const [isFirstPartSent, setIsFirstPartSent] = useState(false);
	useEffect(() => {
		setShowModal(showKycL2);
	}, [showKycL2]);
	const api = useAxios();
	const {
		state: { kycL2Business, theme },
		dispatch
	} = useStore();

	const [input, setInput] = useState<{
		appliedSanctions: string;
		companyIdentificationNumber: string;
		companyName: string;
		countryOfOperates: any;
		countryOfWork: string[];
		file: any;
		mailAddress: any;
		permanentAndMailAddressSame: string;
		politicallPerson: string;
		registeredOffice: any;
		representPerson: string[];
		representativeTypeOfClient: string;
		sourceOfFunds: string[];
		sourceOfFundsOther: string;
		sourceOfIncomeNature: string[];
		sourceOfIncomeNatureOther: string;
		taxResidency: string;
		criminalOffenses: string;
		workArea: string[];
		yearlyIncome: number | null;
	}>({
		appliedSanctions: '',
		companyIdentificationNumber: '',
		companyName: '',
		countryOfOperates: [],
		countryOfWork: [],
		file: {
			// Copy of an account statement kept by an institution in the EEA
			poaDoc1: null,
			// Documents proving information on the source of funds (for instance: payslip, tax return etc.)
			posofDoc1: null,
			// Legal person: Copy of excerpt of public register of Czech Republic or Slovakia (or other comparable foreign evidence) or other valid documents proving the existence of legal entity (Articles of Associations, Deed of Foundation etc.).
			porDoc1: null,
			// Court decision on appointment of legal guardian (if relevant).
			pogDoc1: null
		},
		mailAddress: {
			street: '',
			streetNumber: '',
			municipality: '',
			zipCode: '',
			stateOrCountry: 'Select country'
		},
		permanentAndMailAddressSame: 'Yes',
		politicallPerson: '',
		registeredOffice: {
			street: '',
			streetNumber: '',
			municipality: '',
			state: '',
			country: 'Select country',
			pc: ''
		},
		representPerson: [],
		representativeTypeOfClient: '',
		sourceOfFunds: [],
		sourceOfFundsOther: '',
		sourceOfIncomeNature: [],
		sourceOfIncomeNatureOther: '',
		taxResidency: 'Select country',
		criminalOffenses: '',
		workArea: [],
		yearlyIncome: null
	});
	const [page, setPage] = useState<number>(0);
	const PAGE_AFTER_FIRST_PART = 7;
	const [ubos, setUbos] = useState<any>([]);
	const [shareHolders, setShareHolders] = useState<any>([]);
	const [supervisors, setSupervisors] = useState<any>([]);
	const [addUbo, setAddUbo] = useState(false);
	const [addShareHolder, setAddShareHolder] = useState(false);
	const [addSupervisor, setAddSupervisor] = useState(false);

	const myRef = useRef<HTMLDivElement | null>(null);
	const refPoaDoc1 = useRef<HTMLInputElement>();
	const refPosofDoc1 = useRef<HTMLInputElement>();
	const refPorDoc1 = useRef<HTMLInputElement>();
	const refPogDoc1 = useRef<HTMLInputElement>();
	const handleNext = () => {
		// myRef?.current?.scrollTo(0, 0);
		setPage((prev: number) => prev + 1);
	};
	const handleSubmit = (event: any) => {
		event.preventDefault();
		const bodyFormData = new FormData();
		bodyFormData.append('account_statement_doc', input.file.poaDoc1);
		bodyFormData.append('source_of_funds_doc', input.file.posofDoc1);
		if (input.file.porDoc1) {
			bodyFormData.append('legal_entity_proof_doc', input.file.porDoc1);
		}
		if (input.file.pogDoc1) {
			bodyFormData.append('legal_guardian_doc', input.file.pogDoc1);
		}

		api
			.request({
				method: 'PATCH',
				url: `${BASE_URL}kyc/l2-business/files`,
				data: bodyFormData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(function (response) {
				// handle success
				console.log(response);
				toast.info('Your information has been successfully submitted for verification.', { theme: theme.name });
				dispatch({
					type: KycL2BusinessEnum.STATUS,
					payload: KycL2BusinessStatusEnum.PENDING
				});
				updateShowKycL2(false);
			})
			.catch(function () {
				// handle error
				toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
			});
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
	const handleChangeRegisteredOfficeInput = (event: any) => {
		setInput({
			...input,
			registeredOffice: { ...input.registeredOffice, [event.target.name]: event.target.value }
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
	const [selectOperatesCountry, setSelectOperatesCountry] = useState<any[]>([]);
	const [selectWorkCountry, setSelectWorkCountry] = useState<any[]>([]);
	const handleSelectDropdownCountryOfOperates = (event: any) => {
		setSelectOperatesCountry([...event]);
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setInput({ ...input, countryOfOperates: countries });
	};
	const handleSelectDropdownCountryOfWork = (event: any) => {
		setSelectWorkCountry([...event]);
		const countries = event.map((country: { value: string; label: string }) => country.value);
		setInput({ ...input, countryOfWork: countries });
	};
	const handleChangeFileInput = () => {
		const filepoaDoc1: any = refPoaDoc1?.current?.files && refPoaDoc1.current.files[0];
		const fileposofDoc1: any = refPosofDoc1?.current?.files && refPosofDoc1.current.files[0];
		const fileporDoc1: any = refPorDoc1?.current?.files && refPorDoc1.current.files[0];
		const filePogDoc1: any = refPogDoc1?.current?.files && refPogDoc1.current.files[0];
		setInput({
			...input,
			file: {
				...input.file,
				poaDoc1: filepoaDoc1,
				posofDoc1: fileposofDoc1,
				porDoc1: fileporDoc1,
				pogDoc1: filePogDoc1
			}
		});
	};
	const handleDropDownInput = (event: any) => {
		setInput({ ...input, [event.target.name]: event.target.value });
	};
	const handleOnClose = () => {
		setShowModal(false);
		updateShowKycL2(false);
	};
	const handleOnBack = () => {
		if (page > 0) {
			if (!isFirstPartSent || (isFirstPartSent && page > PAGE_AFTER_FIRST_PART)) {
				setPage((prev: number) => prev - 1);
			}
		}
	};
	const handleAddUbo = () => {
		setAddUbo(true);
	};
	const handleAddShareHolder = () => {
		setAddShareHolder(true);
	};
	const handleAddSupervisor = () => {
		setAddSupervisor(true);
	};
	const updateUboModalShow = (showModal: boolean, uboData: any) => {
		if (uboData) {
			setUbos([...ubos, uboData]);
		}
		setAddUbo(showModal);
	};
	const updateShareHoldersModalShow = (showModal: boolean, shareHolderData: any) => {
		if (shareHolderData) {
			setShareHolders([...shareHolders, shareHolderData]);
		}
		setAddShareHolder(showModal);
	};
	const updateSupervisorModalShow = (showModal: boolean, supervisorData: any) => {
		if (supervisorData) {
			setSupervisors([...supervisors, supervisorData]);
		}
		setAddSupervisor(showModal);
	};
	const handleDeleteUbo = (id: any) => {
		api
			.request({
				method: 'DELETE',
				url: `${BASE_URL}kyc/l2-business/ubo/${id}/`
			})
			.then(function () {
				// handle success
				setUbos([...ubos.filter((item: any) => item.id !== id)]);
			})
			.catch(function () {
				// handle error
				toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
			});
	};
	const handleDeleteShareHolder = (id: any) => {
		api
			.request({
				method: 'DELETE',
				url: `${BASE_URL}kyc/l2-business/shareholder/${id}/`
			})
			.then(function () {
				// handle success
				setShareHolders([...shareHolders.filter((item: any) => item.id !== id)]);
			})
			.catch(function () {
				// handle error
				toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
			});
	};
	const handleDeleteSupervisorHolder = (id: any) => {
		api
			.request({
				method: 'DELETE',
				url: `${BASE_URL}kyc/l2-business/boardmember/${id}/`
			})
			.then(function () {
				// handle success
				setSupervisors([...supervisors.filter((item: any) => item.id !== id)]);
			})
			.catch(function () {
				// handle error
				toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
			});
	};

	const handleDeleteFile = (name: string) => {
		setInput({
			...input,
			file: {
				...input.file,
				[name]: null,
			}
		});

		if (refPoaDoc1?.current) {
			refPoaDoc1.current.value = '';
		}
		if (refPosofDoc1?.current) {
			refPosofDoc1.current.value = '';
		}
		if (refPorDoc1?.current) {
			refPorDoc1.current.value = '';
		}
		if (refPogDoc1?.current) {
			refPogDoc1.current.value = '';
		}

	};

	// useEffects
	useEffect(() => {
		if (kycL2Business === KycL2BusinessStatusEnum.BASIC) {
			// Skip first 7 pages
			setIsFirstPartSent(true);
			setPage(PAGE_AFTER_FIRST_PART);
			// Pull UBOs, shareholders and board members data
			api
				.request({
					method: 'GET',
					url: `${BASE_URL}kyc/l2-business/ubo/`
				})
				.then(function (response) {
					let newRecords: any = [];
					// handle success
					response.data.map((record: any) => {
						const mappedRecord = {
							id: record.id,
							fullName: record.full_name
						};
						newRecords = [...newRecords, mappedRecord];
					});
					setUbos(newRecords);
				})
				.catch(function () {
					// handle error
					toast.error('Something went wrong, please try to refresh the page', { theme: theme.name });
				});
			api
				.request({
					method: 'GET',
					url: `${BASE_URL}kyc/l2-business/shareholder/`
				})
				.then(function (response) {
					let newRecords: any = [];
					// handle success
					response.data.map((record: any) => {
						const mappedRecord = {
							id: record.id,
							fullName: record.full_name
						};
						newRecords = [...newRecords, mappedRecord];
					});
					setShareHolders(newRecords);
				})
				.catch(function () {
					// handle error
					toast.error('Something went wrong, please try to refresh the page', { theme: theme.name });
				});
			api
				.request({
					method: 'GET',
					url: `${BASE_URL}kyc/l2-business/boardmember/`
				})
				.then(function (response) {
					let newRecords: any = [];
					// handle success
					response.data.map((record: any) => {
						const mappedRecord = {
							id: record.id,
							fullName: record.full_name,
							dateOfBirth: record.dob,
							placeOfBirth: record.place_of_birth,
							citizenship: record.citizenship
						};
						newRecords = [...newRecords, mappedRecord];
					});
					setSupervisors(newRecords);
				})
				.catch(function () {
					// handle error
					toast.error('Something went wrong, please try to refresh the page', { theme: theme.name });
				});
		}
	}, [kycL2Business]);

	useEffect(() => {
		// if page == 13 and !isFirstPartSent (first part was never sent) so sent first part of form
		if (page === 7 && !isFirstPartSent) {
			const bodyFormData = new FormData();
			bodyFormData.append('company_name', input.companyName);
			bodyFormData.append('company_id', input.companyIdentificationNumber);
			bodyFormData.append('office_address', JSON.stringify(input.registeredOffice));
			if (input.permanentAndMailAddressSame === 'No') {
				bodyFormData.append('mail_address', JSON.stringify(input.mailAddress));
			}
			bodyFormData.append('tax_residency', input.taxResidency);
			bodyFormData.append('political_person', input.politicallPerson === 'Yes' ? 'true' : 'false');
			bodyFormData.append('applied_sanctions', input.appliedSanctions === 'Yes' ? 'true' : 'false');
			bodyFormData.append('represent_person', input.representPerson.join(', '));
			bodyFormData.append('work_area', input.workArea.join(', '));
			bodyFormData.append('country_of_operations', input.countryOfOperates.join(', '));
			bodyFormData.append('country_of_work', input.countryOfWork.join(', '));
			bodyFormData.append(
				'yearly_income',
				input.yearlyIncome ? Number(input.yearlyIncome).toString() : '0'
			);
			const sourceOfIncomeNature = findAndReplace(
				input.sourceOfIncomeNature,
				'Other',
				input.sourceOfIncomeNatureOther
			);
			bodyFormData.append('source_of_income_nature', sourceOfIncomeNature.join(', '));
			const sourceOfFunds = findAndReplace(input.sourceOfFunds, 'Other', input.sourceOfFundsOther);
			bodyFormData.append('source_of_funds', sourceOfFunds.join(', '));
			bodyFormData.append('is_criminal', input.criminalOffenses === 'Yes' ? 'true' : 'false');
			bodyFormData.append(
				'representative_type',
				input.representativeTypeOfClient === 'Natural Person' ? '0' : '1'
			);

			api
				.request({
					method: 'POST',
					url: `${BASE_URL}kyc/l2-business`,
					data: bodyFormData,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.then(function (response) {
					// handle success
					console.log(response);
					setIsFirstPartSent(true);
					dispatch({
						type: KycL2BusinessEnum.STATUS,
						payload: KycL2BusinessStatusEnum.BASIC
					});
					// maybe we need to change text of toast because it is nit the end of the form ?
					toast.info('Your documents are under review, please wait for the results of the verification!', { theme: theme.name });
				})
				.catch(function () {
					// handle error
					toast.error('Something went wrong, please fill the form and try again!', { theme: theme.name });
				});
		}
	}, [page]);

	useEffect(() => {
		setIsValid(false);
		if (
			page === 0 &&
			input.companyName.trim().length > 1 &&
			input.companyIdentificationNumber.trim().length > 1 &&
			!Object.values(input.registeredOffice).includes('') &&
			input.registeredOffice.country !== 'Select country'
		) {
			setIsValid(true);
		} else if (
			(page === 1 &&
				input.taxResidency !== 'Select country' &&
				input.permanentAndMailAddressSame === 'Yes') ||
			(page === 1 &&
				input.taxResidency !== 'Select country' &&
				!Object.values(input.mailAddress).includes('') &&
				input.mailAddress.country !== 'Select country')
		) {
			setIsValid(true);
		} else if (page === 2 && ((input.representPerson.length === 1 && input.representPerson[0] === 'Statutory body') ||
			(input.representPerson.includes('Based on a power of attorney') ||
				input.representPerson.includes('Legal representative') ||
				input.representPerson.includes('Legal guardian')
			) && input.politicallPerson && input.appliedSanctions)
		) {
			setIsValid(true);
		} else if (page === 3 && input.workArea.length > 0) {
			setIsValid(true);
		} else if (page === 4 && input.countryOfOperates.length && input.countryOfWork.length) {
			setIsValid(true);
		} else if (
			page === 5 &&
			input.yearlyIncome &&
			((input.sourceOfIncomeNature.length && !input.sourceOfIncomeNature.includes('Other')) ||
				(input.sourceOfIncomeNature.includes('Other') && input.sourceOfIncomeNatureOther)) &&
			((input.sourceOfFunds.length && !input.sourceOfFunds.includes('Other')) ||
				(input.sourceOfFunds.includes('Other') && input.sourceOfFundsOther))
		) {
			setIsValid(true);
		} else if (page === 6 && input.criminalOffenses && input.representativeTypeOfClient) {
			dispatch({
				type: KycL2BusinessEnum.REPR,
				payload:
					input.representativeTypeOfClient === 'Natural Person'
						? KycL2BusinessReprEnum.NATURAL
						: KycL2BusinessReprEnum.LEGAL
			});
			setIsValid(true);
		} else if (page === 7 || page === 8 || page === 9) {
			setIsValid(true);
		} else if (page === 10 && input.file.poaDoc1 && input.file.posofDoc1 && input.file.porDoc1) {
			setIsValid(true);
		}
	}, [page, input]);

	return (
		<Portal
			size="xxl"
			isOpen={showModal}
			handleClose={handleOnClose}
			hasBackButton={(page > 0 && !isFirstPartSent) || page > PAGE_AFTER_FIRST_PART}
			backgroundColor='light'
			handleBack={handleOnBack}
			closeOutside={false}
			themeMode='light'>
			<Wrapper ref={myRef} themeMode='dark' data-testid='kycL2LegalModalTest'>
				<div
					style={{
						display: 'flex',
						width: '100%',
						height: '100%',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}>
					{page === 0 && (
						<WrapContainer>
							<Title>Business verification</Title>
							<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'baseline' }}>
								<div style={{ marginBottom: '10px', width: '50%', marginRight: '20px' }}>
									<label
										htmlFor="label-companyName"
										style={{ marginBottom: '8px', display: 'inline-block' }}>
										Company name
									</label>
									<TextField
										id="label-companyName"
										value={input.companyName}
										placeholder="Company name"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="companyName"
										error={input.companyName.length < 2}
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{ marginBottom: '10px', width: '50%' }}>
									<label
										htmlFor="label-identification-number"
										style={{ marginBottom: '8px', display: 'inline-block' }}>
										Company identification number
									</label>
									<TextField
										id="label-identification-number"
										value={input.companyIdentificationNumber}
										placeholder="Company identification number"
										type="text"
										onChange={handleChangeInput}
										size="small"
										align="left"
										name="companyIdentificationNumber"
										error={input.companyIdentificationNumber.length < 2}
										maxLength={100}
										themeMode='light'
									/>
								</div>
							</div>
							<div style={{ margin: '20px 0 30px', width: '100%', textAlign: 'center' }}>
								<ContentTitle>Registered office</ContentTitle>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: '50%', marginRight: '20px' }}>
									<label
										htmlFor="label-registeredOffice-country"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block'
										}}>
										Country
									</label>
									<Select
										name="country"
										onChange={handleChangeRegisteredOfficeInput}
										value={input.registeredOffice.country}
										id="label-registeredOffice-country"
										// @ts-ignore
										themeMode='light'
										style={{ width: '100%' }}>
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
									<label
										htmlFor="label-registeredOffice-street"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block'
										}}>
										Street
									</label>
									<TextField
										id="label-registeredOffice-street"
										value={input.registeredOffice.street}
										placeholder="Street"
										type="text"
										onChange={handleChangeRegisteredOfficeInput}
										size="small"
										align="left"
										name="street"
										error={input.registeredOffice.street < 2}
										maxLength={100}
										themeMode='light'
									/>
									<label
										htmlFor="label-registeredOffice-streetNumber"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block'
										}}>
										Street number
									</label>
									<TextField
										id="label-registeredOffice-streetNumber"
										value={input.registeredOffice.streetNumber}
										placeholder="Street number"
										type="text"
										onChange={handleChangeRegisteredOfficeInput}
										size="small"
										align="left"
										name="streetNumber"
										maxLength={100}
										themeMode='light'
									/>
								</div>
								<div style={{ width: '50%' }}>
									<label
										htmlFor="label-registeredOffice-state"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block'
										}}>
										State
									</label>
									<TextField
										id="label-registeredOffice-state"
										value={input.registeredOffice.state}
										placeholder="State"
										type="text"
										onChange={handleChangeRegisteredOfficeInput}
										size="small"
										align="left"
										name="state"
										error={input.registeredOffice.state < 2}
										maxLength={100}
										themeMode='light'
									/>
									<label
										htmlFor="label-registeredOffice-municipality"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block'
										}}>
										City
									</label>
									<TextField
										id="label-registeredOffice-municipality"
										value={input.registeredOffice.municipality}
										placeholder="City"
										type="text"
										onChange={handleChangeRegisteredOfficeInput}
										size="small"
										align="left"
										name="municipality"
										error={input.registeredOffice.municipality < 2}
										maxLength={100}
										themeMode='light'
									/>
									<label
										htmlFor="label-registeredOffice-pc"
										style={{
											margin: '6px 0 8px 0',
											display: 'inline-block'
										}}>
										Zip Code
									</label>
									<TextField
										id="label-registeredOffice-pc"
										value={input.registeredOffice.pc}
										placeholder="Zip Code"
										type="text"
										onChange={handleChangeRegisteredOfficeInput}
										size="small"
										align="left"
										name="pc"
										error={input.registeredOffice.pc < 2}
										maxLength={100}
										themeMode='light'
									/>
								</div>
							</div>
						</WrapContainer>
					)}
					{page === 1 && (
						<WrapContainer style={{ padding: '0 10px' }}>
							<Title>Business verification</Title>
							<label
								htmlFor="taxResidency"
								style={{ marginBottom: '8px', display: 'inline-block' }}>
								Tax Residency
							</label>
							<div
								style={{
									textAlign: 'left',
									minHeight: '40px',
									width: '100%',
									marginBottom: '50px'
								}}>
								<Select
									id="taxResidency"
									style={{ height: '40px' }}
									name="taxResidency"
									onChange={handleDropDownInput}
									value={input.taxResidency}
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
								</Select>
							</div>
							<div
								style={{
									display: 'flex',
									width: '100%',
									justifyContent: 'left',
									marginBottom: '30px'
								}}>
								<label style={{ marginBottom: '8px', display: 'inline-block' }}>
									Is your mailing address the same as your registered office address?
								</label>
								<div style={{ margin: '0 36px' }}>
									<label htmlFor="label-mailing-permanent-address-true">
										<input
											id="label-mailing-permanent-address-true"
											type="radio"
											value="Yes"
											checked={input.permanentAndMailAddressSame === 'Yes'}
											onChange={handleChangeInput}
											name="permanentAndMailAddressSame"
										/>
										Yes
									</label>
								</div>
								<div>
									<label htmlFor="label-mailing-permanent-address-false">
										<input
											id="label-mailing-permanent-address-false"
											type="radio"
											value="No"
											checked={input.permanentAndMailAddressSame === 'No'}
											onChange={handleChangeInput}
											name="permanentAndMailAddressSame"
										/>
										No
									</label>
								</div>
							</div>
							{input.permanentAndMailAddressSame === 'No' && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-around',
										width: '100%',
										marginBottom: '10px'
									}}>
									<div style={{ width: '50%', marginRight: '20px' }}>
										<label
											htmlFor="label-mail-address-state-Or-Country"
											style={{
												margin: '6px 0 8px 0',
												display: 'inline-block'
											}}>
											Country
										</label>
										<Select
											name="stateOrCountry"
											onChange={handleChangeMailInput}
											value={input.mailAddress.stateOrCountry}
											id="label-mail-address-state-Or-Country"
											style={{
												width: '100%',
												minHeight: '46px',

											}}
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
										<label
											htmlFor="label-address-street"
											style={{
												margin: '6px 0 8px 0',
												display: 'inline-block'
											}}>
											Street
										</label>
										<TextField
											id="label-address-street"
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
										<label
											htmlFor="label-address-zipCode"
											style={{
												margin: '6px 0 8px 0',
												display: 'inline-block'
											}}>
											ZIP Code
										</label>
										<TextField
											id="label-address-zipCode"
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
									<div style={{ width: '50%' }}>
										<label
											htmlFor="label-address-municipality"
											style={{
												margin: '6px 0 8px 0',
												display: 'inline-block'
											}}>
											City
										</label>
										<TextField
											id="label-address-municipality"
											value={input.mailAddress.municipality}
											placeholder="City"
											type="text"
											onChange={handleChangeMailInput}
											size="small"
											align="left"
											name="municipality"
											maxLength={100}
											themeMode='light'
										/>
										<label
											htmlFor="label-address-street-number"
											style={{
												margin: '6px 0 8px 0',
												display: 'inline-block'
											}}>
											Street number
										</label>
										<TextField
											id="label-address-street-number"
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
								</div>
							)}
						</WrapContainer>
					)}
					{page === 2 && (
						<WrapContainer>
							<Title>Business verification</Title>
							<div style={{ width: '100%', marginBottom: '50px' }}>
								<ContentTitle>
									Who is representing the company?
								</ContentTitle>
								{REPRESENT_PERSON.map((activity: any, index: number) => {
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
												id={`representPerson-checkbox-${index}`}
												onChange={handleChangeCheckBox}
												checked={input.representPerson.includes(`${activity}`)}
												data-key="representPerson"
											/>
											<label htmlFor={`representPerson-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
							</div>
							{input.representPerson.includes('Based on a power of attorney') ||
								input.representPerson.includes('Legal representative') ||
								input.representPerson.includes('Legal guardian') ? (
								<>
									<div
										style={{
											display: 'flex',
											width: '100%',
											// justifyContent: 'center',
											marginBottom: '30px',
											alignItems: 'baseline'
										}}>
										<label>Are you a politically exposed person?</label>
										<div style={{ margin: '0 36px' }}>
											<label htmlFor="politicallPersonTrue">
												<input
													id="politicallPersonTrue"
													type="radio"
													value="Yes"
													checked={input.politicallPerson === 'Yes'}
													onChange={handleChangeInput}
													name="politicallPerson"
												/>
												Yes
											</label>
										</div>
										<div>
											<label htmlFor="politicallPersonFalse">
												<input
													id="politicallPersonFalse"
													type="radio"
													value="No"
													checked={input.politicallPerson === 'No'}
													onChange={handleChangeInput}
													name="politicallPerson"
												/>
												No
											</label>
										</div>
									</div>
									<div
										style={{
											display: 'flex',
											width: '100%',
											// justifyContent: 'center',
											marginBottom: '30px',
											alignItems: 'baseline'
										}}>
										<label>Are you a person against whom are applied Czech or international sanctions?</label>
										<div style={{ margin: '0 36px' }}>
											<label htmlFor="appliedSanctionsTrue">
												<input
													id="appliedSanctionsTrue"
													type="radio"
													value="Yes"
													checked={input.appliedSanctions === 'Yes'}
													onChange={handleChangeInput}
													name="appliedSanctions"
												/>
												Yes
											</label>
										</div>
										<div>
											<label htmlFor="appliedSanctionsFalse">
												<input
													id="appliedSanctionsFalse"
													type="radio"
													value="No"
													checked={input.appliedSanctions === 'No'}
													onChange={handleChangeInput}
													name="appliedSanctions"
												/>
												No
											</label>
										</div>
									</div>
								</>
							)
								: null}
						</WrapContainer>
					)}
					{page === 3 && (
						<WrapContainer>
							<Title>Business verification</Title>
							<ContentTitle>
								Select in which areas your company is conducting activities
							</ContentTitle>
							<div>
								{WORK_AREA_LIST.map((activity: string, index: number) => {
									return (
										<div
											key={index}
											style={{
												display: 'flex',
												justifyContent: 'flex-start',
												marginBottom: '6px'
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
											<label htmlFor={`workAreaList-checkbox-${index}`}>{activity}</label>
										</div>
									);
								})}
							</div>
						</WrapContainer>
					)}
					{page === 4 && (
						<div style={{ marginBottom: '10px', width: `${isMobile ? '100%' : '70%'}` }}>
							<Title>Business verification</Title>
							<ContentTitle>
								State or country, in which a branch, organized unit or establishment of your company
								operates
							</ContentTitle>
							<SelectDropdown
								themeMode='light'
								onChange={(e: any) => handleSelectDropdownCountryOfOperates(e)}
								defaultValue={selectOperatesCountry}
								options={countries}
							/>
							<ContentTitle style={{ marginTop: '50px' }}>
								State or country, in which your company conducts its business
							</ContentTitle>
							<SelectDropdown
								themeMode='light'
								onChange={(e: any) => handleSelectDropdownCountryOfWork(e)}
								defaultValue={selectWorkCountry}
								options={countries}
							/>
						</div>
					)}
					{page === 5 && (
						<WrapContainer>
							<Title>Business verification</Title>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									paddingRight: '10px'
								}}>
								<div>
									<ContentTitle style={{ textAlign: 'left', lineHeight: '1.6', marginTop: '0' }}>
										Source of income
									</ContentTitle>
									{PREVAILING_SOURCE_OF_INCOME_COMPANY.map((activity: string, index: number) => {
										return (
											<div
												key={index}
												style={{
													display: 'flex',
													justifyContent: 'flex-start',
													marginBottom: '8px',
													alignContent: 'baseline'
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
												<label htmlFor={`sourceOfIncomeNatureList-checkbox-${index}`}>
													{activity}
												</label>
											</div>
										);
									})}
									{input.sourceOfIncomeNature.includes('Other') ? (
										<div style={{ marginTop: '16px', width: `${isMobile ? '100%' : '70%'}` }}>
											<TextField
												value={input.sourceOfIncomeNatureOther}
												type="text"
												placeholder="Specify..."
												onChange={handleChangeInput}
												size="small"
												align="left"
												name="sourceOfIncomeNatureOther"
												maxLength={100}
												themeMode='light'
											/>
										</div>
									) : null}
								</div>
								<div style={{ width: '100%' }}>
									<ContentTitle>Net yearly income / yearly turnover</ContentTitle>
									{NET_YEARLY_INCOME_LIST_COMPANY.map((activity: any, index: number) => {
										return (
											<div
												key={index}
												style={{
													display: 'flex',
													justifyContent: 'flex-start',
													marginBottom: '8px'
												}}>
												<input
													type="radio"
													value={activity.value}
													id={`yearlyIncome-radio-${index}`}
													checked={input.yearlyIncome === activity.value.toString()}
													onChange={handleChangeInput}
													name="yearlyIncome"
												/>
												<label htmlFor={`yearlyIncome-radio-${index}`}>{activity.name}</label>
											</div>
										);
									})}
								</div>
								<div style={{ width: '100%', paddingBottom: '30px' }}>
									<ContentTitle>
										Source of funds intended for transaction:
									</ContentTitle>
									{SOURCE_OF_FUNDS_LIST_COMPANY.map((activity: string, index: number) => {
										return (
											<div
												key={index}
												style={{
													display: 'flex',
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
												<label htmlFor={`sourceOfFundsList-checkbox-${index}`}>{activity}</label>
											</div>
										);
									})}
									{input.sourceOfFunds.includes('Other') ? (
										<div style={{ marginTop: '16px', width: `${isMobile ? '100%' : '70%'}` }}>
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
										</div>
									) : null}
								</div>
							</div>
						</WrapContainer>
					)}
					{page === 6 && (
						<WrapContainer>
							<Title>Business verification</Title>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div
									style={{
										display: 'flex',
										// justifyContent: 'center',
										marginBottom: '50px'
									}}>
									<label>
										Have you as a legal entity (or the member of your statutory body or your supervisory body or your
										ultimate beneficial owner ) ever been convicted for a criminal offense, in particular an offense
										against
										property or economic offense committed not only in relation with work or business activities
										(without
										regards to presumption of innocence)?
									</label>
									<div style={{ margin: '0 36px' }}>
										<label htmlFor="criminalOffensesTrue">
											<input
												id="criminalOffensesTrue"
												type="radio"
												value="Yes"
												checked={input.criminalOffenses === 'Yes'}
												onChange={handleChangeInput}
												name="criminalOffenses"
											/>
											Yes
										</label>
									</div>
									<div>
										<label htmlFor="criminalOffensesFalse">
											<input
												id="criminalOffensesFalse"
												type="radio"
												value="No"
												checked={input.criminalOffenses === 'No'}
												onChange={handleChangeInput}
												name="criminalOffenses"
											/>
											No
										</label>
									</div>
								</div>
								<div style={{ width: '100%' }}>
									<div
										style={{
											display: 'flex',
											width: '100%',
											// justifyContent: 'center',
											marginBottom: '30px',
											alignItems: 'baseline'
										}}>
										<label>The representative of the client is a:</label>
										<div style={{ margin: '0 10px' }}>
											<label htmlFor="representativeTypeOfClientTrue">
												<input
													id="representativeTypeOfClientTrue"
													type="radio"
													value="Natural Person"
													checked={input.representativeTypeOfClient === 'Natural Person'}
													onChange={handleChangeInput}
													name="representativeTypeOfClient"
												/>
												Natural Person
											</label>
										</div>
										<div>
											<label htmlFor="representativeTypeOfClientFalse">
												<input
													id="representativeTypeOfClientFalse"
													type="radio"
													value="Legal entity"
													checked={input.representativeTypeOfClient === 'Legal entity'}
													onChange={handleChangeInput}
													name="representativeTypeOfClient"
												/>
												Legal entity
											</label>
										</div>
									</div>
								</div>
							</div>
						</WrapContainer>
					)}
					{page === 7 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%'
							}}>
							<Title>Business verification</Title>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '60%', marginRight: '10px' }}>
									Information on Ultimate Beneficial Owner(s)
								</ContentTitle>
								<div style={{ padding: '4px' }}>
									<Button variant="secondary" onClick={handleAddUbo}>
										Add UBO
									</Button>
								</div>
							</div>
							<WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
								<UboModal addUbo={addUbo} updateUboModalShow={updateUboModalShow} />
								{ubos.map((client: any) => {
									if (client) {
										return (
											<Container key={client.id}>
												<>
													<div
														style={{
															display: 'flex',
															width: '100%',
															flexDirection: 'column',
															alignItems: 'flex-start'
														}}>
														<ContainerText>
															<strong>{client.fullName || client.companyName}</strong>
														</ContainerText>
													</div>
													<DeleteUboBtn onClick={() => handleDeleteUbo(client.id)}>
														Delete
													</DeleteUboBtn>
												</>
											</Container>
										);
									}
								})}
							</WrapContainer>
						</WrapContainer>
					)}
					{page === 8 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%'
							}}>
							<Title>Business verification</Title>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '60%', marginRight: '10px' }}>
									Information on majority shareholders or person in control of client ({'>'}25%)
								</ContentTitle>
								<div style={{ padding: '4px' }}>
									<Button variant="secondary" onClick={handleAddShareHolder}>
										Add shareholder
									</Button>
								</div>
							</div>

							<WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
								<ShareHoldersModal
									addShareHolder={addShareHolder}
									updateShareHoldersModalShow={updateShareHoldersModalShow}
								/>
								{shareHolders.map((client: any) => {
									if (client) {
										return (
											<Container key={client.id}>
												<>
													<div
														style={{
															display: 'flex',
															width: '100%',
															flexDirection: 'column',
															alignItems: 'flex-start'
														}}>
														<ContainerText>
															<strong>{client.fullName || client.companyName}</strong>
														</ContainerText>
													</div>
													<DeleteUboBtn onClick={() => handleDeleteShareHolder(client.id)}>
														Delete
													</DeleteUboBtn>
												</>
											</Container>
										);
									}
								})}
							</WrapContainer>
						</WrapContainer>
					)}
					{page === 9 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%'
							}}>
							<Title>Business verification</Title>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '60%', marginRight: '10px' }}>
									Information on members of the supervisory board (If it a client with a supervisory
									board or other supervisory body)
								</ContentTitle>
								<div style={{ padding: '4px' }}>
									<Button variant="secondary" onClick={handleAddSupervisor}>
										Add member
									</Button>
								</div>
							</div>
							<WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
								<SupervisoryMembers
									addSupervisor={addSupervisor}
									updateSupervisorModalShow={updateSupervisorModalShow}
								/>
								{supervisors.map((client: any) => {
									if (client) {
										return (
											<Container key={client.id}>
												<>
													<div
														style={{
															display: 'flex',
															width: '100%',
															flexDirection: 'column',
															alignItems: 'flex-start',
															marginBottom: '8px'
														}}>
														<ContainerText>Name: {client.fullName}</ContainerText>
														<ContainerText>Date of birth: {client.dateOfBirth}</ContainerText>
														<ContainerText>Place of birth: {client.placeOfBirth}</ContainerText>
														<ContainerText>
															Citizenship(s):{' '}
															{client.citizenship instanceof Array
																? client.citizenship.join(', ')
																: client.citizenship}
														</ContainerText>
													</div>
													<DeleteUboBtn onClick={() => handleDeleteSupervisorHolder(client.id)}>
														Delete
													</DeleteUboBtn>
												</>
											</Container>
										);
									}
								})}
							</WrapContainer>
						</WrapContainer>
					)}
					{page === 10 && (
						<WrapContainer
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%'
							}}>
							<Title>Business verification</Title>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '75%', marginRight: '10px' }}>
									Copy of an account statement kept by an institution in the European Economic Area
								</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', alignItems: 'stretch' }}>
									<LabelInput htmlFor="file-input-refPoaDoc1">
										<FileInput
											id="file-input-refPoaDoc1"
											type="file"
											ref={refPoaDoc1 as any}
											onChange={handleChangeFileInput} />
										{input.file.poaDoc1 && input.file.poaDoc1.name.length < 15 ? input.file.poaDoc1.name : input.file.poaDoc1 && input.file.poaDoc1.name.length >= 15 ? input.file.poaDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
									<IconContainer>
										{/* @ts-ignore */}
										<Icon icon='trashBin' size='small' onClick={() => handleDeleteFile('poaDoc1')} style={{ outline: 'none' }} />
									</IconContainer>
								</div>
							</div>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '75%', marginRight: '10px' }}>
									Documents proving information on the source of funds (i.e.: payslip, tax
									return etc.)
								</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', alignItems: 'stretch' }}>
									<LabelInput htmlFor="file-input-refPosofDoc1">
										<FileInput
											id="file-input-refPosofDoc1"
											type="file"
											ref={refPosofDoc1 as any}
											onChange={handleChangeFileInput} />
										{input.file.posofDoc1 && input.file.posofDoc1.name.length < 15 ? input.file.posofDoc1.name : input.file.posofDoc1 && input.file.posofDoc1.name.length >= 15 ? input.file.posofDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
									<IconContainer>
										{/* @ts-ignore */}
										<Icon icon='trashBin' size='small' onClick={() => handleDeleteFile('posofDoc1')} style={{ outline: 'none' }} />
									</IconContainer>
								</div>
							</div>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '75%', marginRight: '10px' }}>
									Copy of excerpt of public register or other valid documents proving the existence of
									legal entity (Articles of Associations, Deed of Foundation etc.).
								</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', alignItems: 'stretch' }}>
									<LabelInput htmlFor="file-input-refPorDoc1">
										<FileInput
											id="file-input-refPorDoc1"
											type="file"
											ref={refPorDoc1 as any}
											onChange={handleChangeFileInput} />
										{input.file.porDoc1 && input.file.porDoc1.name.length < 15 ? input.file.porDoc1.name : input.file.porDoc1 && input.file.porDoc1.name.length >= 15 ? input.file.porDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
									<IconContainer>
										{/* @ts-ignore */}
										<Icon icon='trashBin' size='small' onClick={() => handleDeleteFile('porDoc1')} style={{ outline: 'none' }} />
									</IconContainer>
								</div>
							</div>
							<div
								style={{
									margin: '0 0 10px',
									textAlign: 'left',
									display: 'flex',
									alignItems: 'baseline',
									flexWrap: 'wrap'
								}}>
								<ContentTitle style={{ maxWidth: '75%', marginRight: '10px' }}>
									Court decision on appointment of legal guardian (if relevant).
								</ContentTitle>
								<div style={{ textAlign: 'left', marginBottom: '40px', display: 'flex', alignItems: 'stretch' }}>
									<LabelInput htmlFor="file-input-refPogDoc1">
										<FileInput
											id="file-input-refPogDoc1"
											type="file"
											ref={refPogDoc1 as any}
											onChange={handleChangeFileInput} />
										{input.file.pogDoc1 && input.file.pogDoc1.name.length < 15 ? input.file.pogDoc1.name : input.file.pogDoc1 && input.file.pogDoc1.name.length > 15 ? input.file.pogDoc1.name.slice(0, 15).concat('...') : 'Upload File'}
									</LabelInput>
									<IconContainer>
										{/* @ts-ignore */}
										<Icon icon='trashBin' size='small' onClick={() => handleDeleteFile('pogDoc1')} style={{ outline: 'none' }} />
									</IconContainer>
								</div>
							</div>
						</WrapContainer>
					)}
					{page < 10 && (
						<div
							style={{
								margin: '0 auto',
								width: '100%',
								textAlign: 'center'
							}}>
							<NextBtn onClick={handleNext} disabled={!isValid}>
								Next
							</NextBtn>
						</div>
					)}
					{page >= 10 && (
						<div
							style={{
								margin: '0 auto',
								width: '100%',
								textAlign: 'center'
							}}>
							<SubmitBtn
								disabled={!isValid}
								onClick={handleSubmit}>
								Submit
							</SubmitBtn>
						</div>
					)}
				</div>
			</Wrapper>
		</Portal>
	);
};
