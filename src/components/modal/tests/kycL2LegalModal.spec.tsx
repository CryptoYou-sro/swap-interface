import { fireEvent, render, waitFor } from '@testing-library/react';
import { publicProvider } from '@wagmi/core/dist/providers/public';
import { w3mConnectors } from '@web3modal/ethereum';

import {
    WagmiConfig,
    configureChains,
    createClient
} from 'wagmi';
import { mainnet } from 'wagmi/dist/chains';
import { AuthProvider } from '../../../helpers';
import { bsc, moonbeam } from '../../../helpers/chains';
import { KycL2LegalModal } from '../kycL2LegalModal';


describe('KycL2LegalModal', () => {
    const chains = [mainnet, moonbeam, bsc];
    const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string;
    const { provider } = configureChains(
        chains,
        [publicProvider()],
        { pollingInterval: 10_000 },
    );
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: w3mConnectors({
            projectId,
            version: 1,
            chains
        }),
        provider
    });

    it('should render a kycL2 form for LEGAL persons', async () => {
        const {
            getByTestId,
            getByLabelText,
            getAllByLabelText,
            getByText,
            getAllByPlaceholderText,
            getAllByRole,
        } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <KycL2LegalModal showKycL2={true} updateShowKycL2={() => console.log('modal')} />
                </AuthProvider>
            </WagmiConfig>
        );

        // PAGE 0 ======================================================================
        const nextBtn = getByText('Next');
        expect(nextBtn).toBeInTheDocument();
        expect(nextBtn).toBeDisabled();

        const companyNameInput = getByLabelText('Company name');
        expect(companyNameInput).toBeInTheDocument();
        fireEvent.change(companyNameInput, { target: { value: 'CryptoYou' } });
        // @ts-ignore
        expect(companyNameInput.value).toBe('CryptoYou');

        const companyIdNumberInput = getByLabelText('Company identification number');
        expect(companyIdNumberInput).toBeInTheDocument();
        fireEvent.change(companyIdNumberInput, { target: { value: '010101' } });
        // @ts-ignore
        expect(companyIdNumberInput.value).toBe('010101');

        const registeredOfficeTitle = 'Registered office';
        expect(getByText(registeredOfficeTitle)).toBeInTheDocument();

        const countryInput = getByLabelText('Country');
        expect(countryInput).toBeInTheDocument();
        fireEvent.change(countryInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(countryInput.value).toBe('Albania');

        const streetInput = getByLabelText('Street');
        expect(streetInput).toBeInTheDocument();
        fireEvent.change(streetInput, { target: { value: 'Independence' } });
        // @ts-ignore
        expect(streetInput.value).toBe('Independence');

        const streetNumberInput = getByLabelText('Street number');
        expect(streetNumberInput).toBeInTheDocument();
        fireEvent.change(streetNumberInput, { target: { value: '01' } });
        // @ts-ignore
        expect(streetNumberInput.value).toBe('01');

        // FIXME: у модалці одночасно state і city 
        const stateInput = getByLabelText('State');
        expect(stateInput).toBeInTheDocument();
        fireEvent.change(stateInput, { target: { value: 'State custom' } });
        // @ts-ignore
        expect(stateInput.value).toBe('State custom');

        const cityInput = getByLabelText('City');
        expect(cityInput).toBeInTheDocument();
        fireEvent.change(cityInput, { target: { value: 'London' } });
        // @ts-ignore
        expect(cityInput.value).toBe('London');

        const zipcodeInput = getByLabelText('Zip Code');
        expect(zipcodeInput).toBeInTheDocument();
        fireEvent.change(zipcodeInput, { target: { value: 'zipcode custom' } });
        // @ts-ignore
        expect(zipcodeInput.value).toBe('zipcode custom');

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 1 ======================================================================
        const selectTaxResidencyInput = getByLabelText('Tax Residency');
        expect(selectTaxResidencyInput).toBeInTheDocument();
        const optionsTaxResidency = Array.from(selectTaxResidencyInput.querySelectorAll('option'));
        expect(optionsTaxResidency).toHaveLength(244);
        fireEvent.change(selectTaxResidencyInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(selectTaxResidencyInput.value).toBe('Albania');

        const permanentRadioBtnTrue = getByLabelText('Yes');
        expect(permanentRadioBtnTrue).toBeInTheDocument();
        // @ts-ignore
        expect(permanentRadioBtnTrue.checked).toBe(true);

        const permanentRadioBtnFalse = getByLabelText('No');
        expect(permanentRadioBtnFalse).toBeInTheDocument();
        fireEvent.click(permanentRadioBtnFalse);
        await waitFor(() => {
            // @ts-ignore
            expect(permanentRadioBtnFalse.checked).toBe(true);
            // @ts-ignore
            expect(permanentRadioBtnTrue.checked).toBe(false);
        });

        const mailCountryInput = getByLabelText('Country');
        expect(mailCountryInput).toBeInTheDocument();
        fireEvent.change(mailCountryInput, { target: { value: 'American Samoa' } });
        // @ts-ignore
        expect(mailCountryInput.value).toBe('American Samoa');

        const mailStreetInput = getByLabelText('Street');
        expect(mailStreetInput).toBeInTheDocument();
        fireEvent.change(mailStreetInput, { target: { value: 'mail street custom' } });
        // @ts-ignore
        expect(mailStreetInput.value).toBe('mail street custom');

        const mailZipCodeInput = getByLabelText('ZIP Code');
        expect(mailZipCodeInput).toBeInTheDocument();
        fireEvent.change(mailZipCodeInput, { target: { value: 'mail zip code custom' } });
        // @ts-ignore
        expect(mailZipCodeInput.value).toBe('mail zip code custom');

        const mailCityInput = getByLabelText('City');
        expect(mailCityInput).toBeInTheDocument();
        fireEvent.change(mailCityInput, { target: { value: 'mail city London custom' } });
        // @ts-ignore
        expect(mailCityInput.value).toBe('mail city London custom');

        const mailStreetNumberInput = getByLabelText('Street number');
        expect(mailStreetNumberInput).toBeInTheDocument();
        fireEvent.change(mailStreetNumberInput, { target: { value: '02' } });
        // @ts-ignore
        expect(mailStreetNumberInput.value).toBe('02');

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 2 ======================================================================
        expect(nextBtn).toBeDisabled();

        const page2Title = getByText('Who is representing the company?');
        expect(page2Title).toBeInTheDocument();

        const representingCompanyInput = getByLabelText('Statutory body');
        expect(representingCompanyInput).toBeInTheDocument();

        fireEvent.click(representingCompanyInput);
        // @ts-ignore
        expect(representingCompanyInput.checked).toBe(true);

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 3 ======================================================================
        const areasTitle = getByText('Select in which areas your company is conducting activities');
        expect(areasTitle).toBeInTheDocument();

        const armsTransactionInput = getByLabelText('Arms Transaction');
        expect(armsTransactionInput).toBeInTheDocument();
        // @ts-ignore
        expect(armsTransactionInput.checked).toBe(false);

        fireEvent.click(armsTransactionInput);
        // @ts-ignore
        expect(armsTransactionInput.checked).toBe(true);

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 4 ======================================================================
        const countryInputs = getAllByRole('combobox');
        // NOTE: REACT SELECT IS UNSUPPORTING TESTS (custom library);
        countryInputs.forEach((countryInput) => {
            expect(countryInput).toBeInTheDocument();

            fireEvent.change(countryInput, { target: { value: 'Albania' } });
            // @ts-ignore
            expect(countryInput.value).toBe('Albania');
        });
        // @ts-ignore
        expect(countryInputs[0].value).toBe('Albania');
        // @ts-ignore
        expect(countryInputs[1].value).toBe('Albania');

        fireEvent.click(nextBtn);

        // PAGE 5 ======================================================================
        const sourceOfIncomeTitle = getByText('Source of income');
        expect(sourceOfIncomeTitle).toBeInTheDocument();

        const page5CheckBoxes = getAllByLabelText('Other');
        page5CheckBoxes.forEach((checkbox) => {
            // @ts-ignore
            expect(checkbox.checked).toBe(false);
            fireEvent.click(checkbox);
            // @ts-ignore
            expect(checkbox.checked).toBe(true);
        });

        const sourceOfIncomeSpecifyInputs = getAllByPlaceholderText('Specify...');

        sourceOfIncomeSpecifyInputs.forEach((input) => {
            // @ts-ignore
            fireEvent.change(input, { target: { value: 'It and development' } });
            // @ts-ignore
            expect(input.value).toBe('It and development');
        });

        const yearlyIncomeRadio = getByLabelText('Up to EUR 40,000');
        expect(yearlyIncomeRadio).toBeInTheDocument();
        fireEvent.click(yearlyIncomeRadio);
        await waitFor(() => {
            // @ts-ignore
            expect(yearlyIncomeRadio.checked).toBe(true);
        });
        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 6 ======================================================================
        expect(nextBtn).toBeDisabled();

        const yearlyIncomeRadioTrue = getByLabelText('Yes');
        const yearlyIncomeRadioFalse = getByLabelText('No');

        expect(yearlyIncomeRadioTrue).toBeInTheDocument();
        expect(yearlyIncomeRadioFalse).toBeInTheDocument();

        fireEvent.click(yearlyIncomeRadioFalse);
        await waitFor(() => {
            // @ts-ignore
            expect(yearlyIncomeRadioFalse.checked).toBe(true);
        });

        const naturalPersonRadioBtn = getByLabelText('Natural Person');
        const legalEntityRadioBtn = getByLabelText('Legal entity');

        expect(naturalPersonRadioBtn).toBeInTheDocument();
        expect(legalEntityRadioBtn).toBeInTheDocument();

        fireEvent.click(naturalPersonRadioBtn);
        await waitFor(() => {
            // @ts-ignore
            expect(naturalPersonRadioBtn.checked).toBe(true);
        });

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 7 ======================================================================
        const addUboBtn = getByText('Add UBO');
        expect(addUboBtn).toBeInTheDocument();

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);
        // PAGE 8 ======================================================================
        const addShareHolderBtn = getByText('Add shareholder');
        expect(addShareHolderBtn).toBeInTheDocument();

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);

        // PAGE 9 ======================================================================
        const addMemberBtn = getByText('Add member');
        expect(addMemberBtn).toBeInTheDocument();

        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);


        // PAGE 10 ======================================================================

        const fileInputs = getAllByLabelText('Upload File', { selector: 'input[type="file"]' });

        fileInputs.forEach((input) => {
            fireEvent.change(input, { target: { files: [new File(['file content'], '123.txt', { type: 'text/plain' })] } });
        });

        const submitBtn = getByText('Submit');
        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).not.toBeDisabled();

        expect(getByTestId('kycL2LegalModalTest')).toMatchSnapshot();
    });
});