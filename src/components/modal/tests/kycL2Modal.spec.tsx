import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';
import countries from '../../../data/countries.json';
import FUNDS_IRREGULAR_FOR_BUSINESS_LIST from '../../../data/fundsIrregularForBussinesList.json';
import COUNTRIES from '../../../data/listOfAllCountries.json';
import SOURCE_OF_FUNDS_LIST from '../../../data/sourceOfFundsList.json';
import SOURCE_OF_INCOME_NATURE_LIST from '../../../data/sourceOfIncomeNatureList.json';
import WORK_AREA_LIST from '../../../data/workAreaList.json';
import { AuthProvider } from '../../../helpers';
import { pxToRem, spacing } from '../../../styles';
import { SelectDropdown } from '../../selectDropdown/selectDropdown';
import { TextField } from '../../textField/textField';
import { ContentTitle } from '../kycL2LegalModal';
import { FileContainerBox, FileInput, Label, LabelFileInput, NextBtn, SelectInput, SpecifyContainer, SubmitBtn, Title, WrapContainer } from '../kycL2Modal';

describe('KycL2Modal', () => {
    it('should render 2 page of form', () => {
        const SecondPageForm = () => {
            const isMobile = false;
            const [input, setInput] = useState<{
                file: any;
            }>({
                file: {
                    poaDoc1: new File(['file contents'], 'filename.txt', { type: 'text/plain' }),
                    posofDoc1: new File(['file contents'], 'filename.txt', { type: 'text/plain' }),
                    identificationDoc1: new File(['file contents'], 'filename.txt', { type: 'text/plain' }),
                    identificationDoc2: new File(['file contents'], 'filename.txt', { type: 'text/plain' }),
                    identificationSelfie: new File(['file contents'], 'filename.txt', { type: 'text/plain' }),
                },
            });
            const [isValid, setIsValid] = useState(false);

            useEffect(() => {
                setIsValid(false);
                if (page === 2 && input.file.identificationDoc1 && input.file.identificationDoc2 && input.file.identificationSelfie) {
                    setIsValid(true);
                }
            }, [input]);
            const [page, setPage] = useState<number>(2);

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };
            const fileIdentificationDoc1 = useRef<HTMLInputElement>();
            const fileIdentificationDoc2 = useRef<HTMLInputElement>();
            const fileIdentificationDocSelfie = useRef<HTMLInputElement>();
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

            return (
                <AuthProvider>
                    <WrapContainer data-testid='secondPageForm'>
                        <Title style={{ marginBottom: `${!isMobile ? `${spacing[60]}` : null}` }}>KYC and AML Questionnaire for Individuals</Title>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };

        const {
            // getByRole,
            getByText,
            getByTestId,
            // getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <SecondPageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const passportFrontTitle = 'Front side / second page for Passport';
        expect(getByText(passportFrontTitle)).toBeInTheDocument();

        const passportBackTitle = 'Back side / third page for Passport';
        expect(getByText(passportBackTitle)).toBeInTheDocument();
        const selfieTitle = 'Submit a selfie in which you\'re holding a piece of paper that clearly shows today\'s date and the number of the document you have uploaded (Passport / ID).';
        expect(getByText(selfieTitle)).toBeInTheDocument();

        expect(nextButton).not.toBeDisabled();

        expect(getByTestId('secondPageForm')).toBeInTheDocument();
        expect(getByTestId('secondPageForm')).toMatchSnapshot();

    });

    it('should render 3 page of form', () => {
        const PageForm = () => {
            const isMobile = false;
            const [input, setInput] = useState<{
                sourceOfIncome: string;
                yearlyIncome: number | null;
                taxResidency: string;
            }>({
                sourceOfIncome: '',
                yearlyIncome: null,
                taxResidency: 'Select country',
            });

            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(3);

            useEffect(() => {
                setIsValid(false);
                if (page === 3 && input.sourceOfIncome.trim().length >= 2 && Number(input.yearlyIncome) > 0 && input.taxResidency !== 'Select country') {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };
            const handleDropDownInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                            <SelectInput
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
                            </SelectInput>
                        </div>
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            // getByRole,
            getByText,
            getByTestId,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'KYC and AML Questionnaire for Individuals';
        expect(getByText(title)).toBeInTheDocument();

        expect(nextButton).toBeDisabled();

        const prevailingSourceIncomeInput = getByLabelText('What is the prevailing source of your income?');
        expect(prevailingSourceIncomeInput).toBeInTheDocument();

        fireEvent.change(prevailingSourceIncomeInput, { target: { value: 'IT' } });
        // @ts-ignore
        expect(prevailingSourceIncomeInput.value).toBe('IT');

        const netIncomeInput = getByLabelText('What is your net yearly income in € Euro ?');
        expect(netIncomeInput).toBeInTheDocument();
        fireEvent.change(netIncomeInput, { target: { value: '100' } });
        // @ts-ignore
        expect(netIncomeInput.value).toBe('100');

        const taxResidency = getByLabelText('Declare your tax Residency');
        expect(taxResidency).toBeInTheDocument();
        fireEvent.change(taxResidency, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(taxResidency.value).toBe('Albania');

        expect(nextButton).not.toBeDisabled();

        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();

    });

    it('should render 4 page of form', () => {
        // FIXME: CHECK THIS PAGE STATE ETC.
        const PageForm = () => {
            const isMobile = false;
            const [input, setInput] = useState<{
                countryOfWork: string[];

            }>({
                countryOfWork: []
            });
            const [isValid, setIsValid] = useState(false);
            const [selectWorkCountry, setSelectWorkCountry] = useState<any[]>([]);
            const [page, setPage] = useState<number>(4);

            useEffect(() => {
                setIsValid(false);
                if (page === 4 && input.countryOfWork.length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleSelectDropdownCountryOfWork = (event: any) => {
                setSelectWorkCountry([...event]);
                const countries = event.map((country: { value: string; label: string }) => country.value);
                setInput({ ...input, countryOfWork: countries });
            };
            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <div style={{ marginBottom: '10px', width: '75%' }} data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </div>
                </AuthProvider>
            );
        };


        const {
            getByRole,
            getByText,
            getByTestId,
            // getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'KYC and AML Questionnaire for Individuals';
        expect(getByText(title)).toBeInTheDocument();

        const contentTitle = 'State the country in which you are conducting your work / business activity';
        expect(getByText(contentTitle)).toBeInTheDocument();

        const countryInput = getByRole('combobox');
        expect(countryInput).toBeInTheDocument();
        fireEvent.change(countryInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(countryInput.value).toBe('Albania');

        // expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();

    });

    it('should render 5 page of form', () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                workArea: string[];

            }>({
                workArea: []
            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(5);

            useEffect(() => {
                setIsValid(false);
                if (page === 5 && input.workArea.length > 0) {
                    setIsValid(true);
                }
            }, [input]);

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
            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'Select the areas in which you conduct your work / business activity:';
        expect(getByText(title)).toBeInTheDocument();

        const checkbox = getByLabelText('Antiques and art shop');
        expect(checkbox).toBeInTheDocument();
        // @ts-ignore
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        // @ts-ignore
        expect(checkbox.checked).toBe(true);

        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();

    });

    it('should render 6 page of form', () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                sourceOfFunds: string[];
                sourceOfFundsOther: string;

            }>({
                sourceOfFunds: [],
                sourceOfFundsOther: ''
            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(6);

            useEffect(() => {
                setIsValid(false);
                if (page === 6 && input.sourceOfFunds.length > 0 && !input.sourceOfFunds.includes('Other') ||
                    page == 6 && input.sourceOfFunds.includes('Other') && input.sourceOfFundsOther.trim().length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
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
                    // @ts-ignore
                    const filteredArray: string[] = input[attributeValue as keyof typeof input].filter(
                        (item: any) => item !== value
                    );
                    setInput({ ...input, [attributeValue]: [...filteredArray] });
                }
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'State which is the source of funds intended for your transactions:';
        expect(getByText(title)).toBeInTheDocument();

        const checkbox = getByLabelText('Sale of real estate');
        expect(checkbox).toBeInTheDocument();
        // @ts-ignore
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        // @ts-ignore
        expect(checkbox.checked).toBe(true);

        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 7 page of form', () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                sourceOfIncomeNature: string[];
                sourceOfIncomeNatureOther: string;

            }>({
                sourceOfIncomeNature: [],
                sourceOfIncomeNatureOther: ''
            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(7);

            useEffect(() => {
                setIsValid(false);
                if (page === 7 && input.sourceOfIncomeNature.length > 0 && !input.sourceOfIncomeNature.includes('Other') ||
                    page === 7 && input.sourceOfIncomeNature.includes('Other') && input.sourceOfIncomeNatureOther.trim().length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
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
                    // @ts-ignore
                    const filteredArray: string[] = input[attributeValue as keyof typeof input].filter(
                        (item: any) => item !== value
                    );
                    setInput({ ...input, [attributeValue]: [...filteredArray] });
                }
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'State which is the nature of your prevailing source of income';
        expect(getByText(title)).toBeInTheDocument();

        const checkbox = getByLabelText('Employee');
        expect(checkbox).toBeInTheDocument();
        // @ts-ignore
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        // @ts-ignore
        expect(checkbox.checked).toBe(true);

        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 8 page of form', () => {

        const PageForm = () => {
            const [input, setInput] = useState<{
                citizenship: string[];

            }>({
                citizenship: []
            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(8);
            const [selectCitizenShip, setSelectCitizenShip] = useState<any[]>([]);


            useEffect(() => {
                setIsValid(false);
                if (page === 8 && input.citizenship.length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleSelectDropdownNatural = (event: any) => {
                setSelectCitizenShip([...event]);
                const countries = event.map((country: { value: string; label: string }) => country.value);
                setInput({ ...input, citizenship: countries });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <SpecifyContainer data-testid='container'>
                        <ContentTitle style={{ textAlign: 'center' }}>Citizenship(s)</ContentTitle>
                        <SelectDropdown
                            themeMode='light'
                            name='citizenship'
                            placeholder='Select country...'
                            defaultValue={selectCitizenShip}
                            onChange={(e: any) => handleSelectDropdownNatural(e)}
                            options={countries}
                        />
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </SpecifyContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            // getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'Citizenship(s)';
        expect(getByText(title)).toBeInTheDocument();

        const container = getByTestId('container');
        expect(container).toBeInTheDocument();

        const inputDefault = container.querySelector('input');
        expect(inputDefault).toBeInTheDocument();
        // @ts-ignore
        fireEvent.change(inputDefault, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(inputDefault.value).toBe('Albania');

        const hiddenInput = container.querySelector('input[name="citizenship"][type="hidden"]');
        expect(hiddenInput).toBeInTheDocument();
        // @ts-ignore
        expect(hiddenInput.value).toBe('');
        // @ts-ignore
        fireEvent.change(hiddenInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(hiddenInput.value).toBe('Albania');


        // expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 9 page of form', () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                irregularSourceOfFunds: string[];
                irregularSourceOfFundsOther: string;
            }>({
                irregularSourceOfFunds: [],
                irregularSourceOfFundsOther: '',

            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(9);

            useEffect(() => {
                setIsValid(false);
                if (page === 9 && !input.irregularSourceOfFunds.includes('Other') && input.irregularSourceOfFunds.length > 0 ||
                    page === 9 && input.irregularSourceOfFunds.includes('Other') && input.irregularSourceOfFundsOther.trim().length > 0) {
                    setIsValid(true);
                }
            }, [input]);

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
                    // @ts-ignore
                    const filteredArray: string[] = input[attributeValue as keyof typeof input].filter(
                        (item: any) => item !== value
                    );
                    setInput({ ...input, [attributeValue]: [...filteredArray] });
                }
            };

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'State which of the following incomes of funds intended for business comes from irregular activities (select none if you don\'t conduct irregular activities):';
        expect(getByText(title)).toBeInTheDocument();

        const checkbox = getByLabelText('Heritage');
        expect(checkbox).toBeInTheDocument();
        // @ts-ignore
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        // @ts-ignore
        expect(checkbox.checked).toBe(true);


        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 10 page of form', async () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                declare: string[];
                declareOther: string;
            }>({
                declare: [],
                declareOther: '',

            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(10);


            useEffect(() => {
                setIsValid(false);
                if (page === 10 && input.declare.includes('I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country') && !input.declareOther.trim().length || page === 10 && input.declareOther.trim().length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        const title = 'I declare that';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnFirst = getByLabelText('I am a national of the aforementioned sole state or country and simultaneously I am registered to a permanent or other type of residency in this state or country');
        expect(radioBtnFirst).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnFirst.checked).toBe(false);
        fireEvent.click(radioBtnFirst);
        await waitFor(() => {
            // @ts-ignore
            expect(radioBtnFirst.checked).toBe(true);
        });

        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 11 page of form', async () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                hasCriminalRecords: string;
            }>({
                hasCriminalRecords: ''

            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(11);


            useEffect(() => {
                setIsValid(false);
                if (page === 11 && input.hasCriminalRecords.length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }} data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </div>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        const title = 'Have you ever been convicted or prosecuted for a criminal offense, in particular an offense against property or economic offense committed not only in relation with work or business activities (without regards to presumption of innocence)?';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(false);
        fireEvent.click(radioBtnFalse);
        await waitFor(() => {
            // @ts-ignore
            expect(radioBtnFalse.checked).toBe(true);
        });


        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 12 page of form', async () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                appliedSanctions: string;
            }>({
                appliedSanctions: ''

            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(12);


            useEffect(() => {
                setIsValid(false);
                if (page === 12 && input.appliedSanctions.length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }} data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </div>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        const title = 'Are you a person against whom are applied Czech and/or international sanctions?';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(false);
        fireEvent.click(radioBtnFalse);
        await waitFor(() => {
            // @ts-ignore
            expect(radioBtnFalse.checked).toBe(true);
        });


        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 13 page of form', async () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                politicallPerson: string;
            }>({
                politicallPerson: ''

            });
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(13);


            useEffect(() => {
                setIsValid(false);
                if (page === 13 && input.politicallPerson.length > 0) {
                    setIsValid(true);
                }
            }, [input]);

            const handleChangeInput = (event: any) => {
                setInput({ ...input, [event.target.name]: event.target.value });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%' }} data-testid='container'>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </div>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        const title = 'Are you a politically exposed person?';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(false);
        fireEvent.click(radioBtnFalse);
        await waitFor(() => {
            // @ts-ignore
            expect(radioBtnFalse.checked).toBe(true);
        });


        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 14 page of form', () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                residence: any;
            }>({
                residence: {
                    street: '',
                    streetNumber: '',
                    municipality: '',
                    zipCode: '',
                    country: ''
                },

            });
            const isMobile = false;
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(14);


            useEffect(() => {
                setIsValid(false);
                if (page === 14 && !Object.values(input.residence).includes('') && !input.residence.country.includes('Select country')) {
                    setIsValid(true);
                }
            }, [input]);

            const handleDropDownInputResidence = (event: any) => {
                setInput({ ...input, residence: { ...input.residence, country: [event.target.value] } });
            };
            const handleChangeResidenceInput = (event: any) => {
                setInput({
                    ...input,
                    residence: { ...input.residence, [event.target.name]: event.target.value }
                });
            };

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <div data-testid='container'>
                        <ContentTitle style={{ textAlign: 'center' }}>Your Residence</ContentTitle>
                        <div style={{ display: 'flex', margin: '0 auto', maxWidth: `${!isMobile ? `${pxToRem(900)}` : null}` }}>
                            <div style={{ width: '50%', marginRight: '20px' }}>
                                <Label htmlFor="input.residence.country" style={{ marginTop: '6px' }}>
                                    Country
                                </Label>
                                <SelectInput
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
                                </SelectInput>
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
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </div>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        const title = 'Your Residence';
        expect(getByText(title)).toBeInTheDocument();

        const countryInput = getByLabelText('Country');
        expect(countryInput).toBeInTheDocument();
        fireEvent.change(countryInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(countryInput.value).toBe('Albania');

        const streetInput = getByLabelText('Street');
        expect(streetInput).toBeInTheDocument();
        fireEvent.change(streetInput, { target: { value: 'Independence street' } });
        // @ts-ignore
        expect(streetInput.value).toBe('Independence street');

        const streetNumberInput = getByLabelText('Street number');
        expect(streetNumberInput).toBeInTheDocument();
        fireEvent.change(streetNumberInput, { target: { value: '0101' } });
        // @ts-ignore
        expect(streetNumberInput.value).toBe('0101');

        const cityInput = getByLabelText('City');
        expect(cityInput).toBeInTheDocument();
        fireEvent.change(cityInput, { target: { value: 'London' } });
        // @ts-ignore
        expect(cityInput.value).toBe('London');

        const zipcodeInput = getByLabelText('ZIP Code');
        expect(zipcodeInput).toBeInTheDocument();
        fireEvent.change(zipcodeInput, { target: { value: '01' } });
        // @ts-ignore
        expect(zipcodeInput.value).toBe('01');

        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 15 page of form', async () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                permanentAndMailAddressSame: string;
                mailAddress: any;
            }>({
                permanentAndMailAddressSame: 'Yes',
                mailAddress: {
                    street: '',
                    streetNumber: '',
                    municipality: '',
                    zipCode: '',
                    country: ''
                },

            });
            const isMobile = false;
            const [isValid, setIsValid] = useState(false);
            const [page, setPage] = useState<number>(15);


            useEffect(() => {
                setIsValid(false);
                if (page === 15 && input.permanentAndMailAddressSame === 'Yes' || page === 15 && !Object.values(input.mailAddress).includes('') && !input.mailAddress.country.includes('Select country')) {
                    setIsValid(true);
                }
            }, [input]);

            const handleDropDownInputMailAddress = (event: any) => {
                setInput({ ...input, mailAddress: { ...input.mailAddress, country: [event.target.value] } });
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

            const handleNext = () => {
                // myRef?.current?.scrollTo(0, 0);
                setPage((prev: number) => prev + 1);
            };

            return (
                <AuthProvider>
                    <div style={{ margin: '0 auto', maxWidth: `${!isMobile ? `${pxToRem(900)}` : null}` }} data-testid='container'>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: `${!isMobile ? `${pxToRem(50)}` : null}` }}>
                            <p style={{ marginRight: '20px' }}>
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
                        <div>
                            {input.permanentAndMailAddressSame === 'No' && (
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '50%', marginRight: '20px' }}>
                                        <Label
                                            htmlFor="label-input-mailAddress-country"
                                            style={{
                                                marginTop: '6px'
                                            }}>
                                            Country
                                        </Label>
                                        <SelectInput
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
                                        </SelectInput>
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
                            )}
                        </div>
                        <NextBtn onClick={handleNext} disabled={!isValid}>
                            {page === 0 ? 'I Agree' : 'Next'}
                        </NextBtn>
                    </div>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).not.toBeDisabled();

        const title = 'Is your permanent (RESIDENCE) address the same as your mailing address?';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnTrue.checked).toBe(true);
        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();

        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(false);
        fireEvent.click(radioBtnFalse);
        await waitFor(() => {
            // @ts-ignore
            expect(radioBtnFalse.checked).toBe(true);
        });

        expect(nextButton).toBeDisabled();

        const countryInput = getByLabelText('Country');
        expect(countryInput).toBeInTheDocument();
        fireEvent.change(countryInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(countryInput.value).toBe('Albania');

        const streetInput = getByLabelText('Street');
        expect(streetInput).toBeInTheDocument();
        fireEvent.change(streetInput, { target: { value: 'Independence street' } });
        // @ts-ignore
        expect(streetInput.value).toBe('Independence street');

        const streetNumberInput = getByLabelText('Street number');
        expect(streetNumberInput).toBeInTheDocument();
        fireEvent.change(streetNumberInput, { target: { value: '0101' } });
        // @ts-ignore
        expect(streetNumberInput.value).toBe('0101');

        const cityInput = getByLabelText('City');
        expect(cityInput).toBeInTheDocument();
        fireEvent.change(cityInput, { target: { value: 'London' } });
        // @ts-ignore
        expect(cityInput.value).toBe('London');

        const zipcodeInput = getByLabelText('ZIP Code');
        expect(zipcodeInput).toBeInTheDocument();
        fireEvent.change(zipcodeInput, { target: { value: '01' } });
        // @ts-ignore
        expect(zipcodeInput.value).toBe('01');

        expect(nextButton).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();
    });

    it('should render 16 page of form', () => {
        const PageForm = () => {
            const [input, setInput] = useState<{
                file: any;
            }>({
                file: {
                    poaDoc1: null,
                    posofDoc1: null,
                    identificationDoc1: null,
                    identificationDoc2: null,
                    identificationSelfie: null,

                },

            });
            const isMobile = false;
            const [isValid, setIsValid] = useState(false);
            const [page] = useState<number>(16);


            useEffect(() => {
                setIsValid(false);
                if (page === 16 && input.file.poaDoc1 && input.file.posofDoc1) {
                    setIsValid(true);
                }
            }, [input]);

            const fileInputAddress = useRef<HTMLInputElement>();
            const fileInputDocs = useRef<HTMLInputElement>();

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

            return (
                <AuthProvider>
                    <WrapContainer data-testid='container'>
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
                        <SubmitBtn
                            disabled={!isValid}
                            onClick={() => console.log('SUBMIT')}>
                            Submit
                        </SubmitBtn>
                    </WrapContainer>
                </AuthProvider>
            );
        };


        const {
            getByText,
            getByTestId,
            // getByRole,
            // getByLabelText,
            // getByPlaceholderText,
            // getByDisplayValue
        } = render(
            <PageForm />
        );

        const nextBtn = screen.queryByText('Next');
        expect(nextBtn).toBeNull();

        const submitBtn = getByText('Submit');
        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).toBeDisabled();

        const addressTitle = 'Provide a proof of address (copies of statements of account kept by an institution in the EEA)';
        expect(getByText(addressTitle)).toBeInTheDocument();

        const sourcefundsTitle = 'Provide a document proving information on the source of your funds (bank statement, payslip, tax return, etc.)';
        expect(getByText(sourcefundsTitle)).toBeInTheDocument();


        const fileInputs = screen.getAllByLabelText('Upload File', { selector: 'input[type="file"]' });

        fileInputs.forEach((input) => {
            fireEvent.change(input, { target: { files: [new File(['file content'], '123.txt', { type: 'text/plain' })] } });
        });

        expect(submitBtn).not.toBeDisabled();
        expect(getByTestId('container')).toBeInTheDocument();
        expect(getByTestId('container')).toMatchSnapshot();


    });
});