import { fireEvent, render, waitFor } from '@testing-library/react';
import { publicProvider } from '@wagmi/core/dist/providers/public';
import { w3mConnectors } from '@web3modal/ethereum';
import { format } from 'date-fns';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet } from 'wagmi/dist/chains';
import { AuthProvider } from '../../../helpers';
import { bsc, moonbeam } from '../../../helpers/chains';
import { UboModal } from '../uboModal';

describe('SupervisoryMembers', () => {
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

    it('should render a ubo modal form', () => {
        const {
            getByTestId,
            getByText,
            // getByDisplayValue,
            getByLabelText,
            // getAllByRole
        } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <UboModal addUbo={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        const title = 'Is the Ultimate Beneficial Owner (UBO) a legal entity?';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();

        const submitBtn = getByText('Please fill up all fields');
        expect(submitBtn).toBeInTheDocument();

        expect(getByTestId('uboModalTest')).toMatchSnapshot();
    });

    it('should render a ubo modal form for NATURAL person', async () => {
        const { getByTestId, getByLabelText, getByText } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <UboModal addUbo={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        const title = 'Information on Ultimate Beneficial Owner(s) (optional)';
        expect(getByText(title)).toBeInTheDocument();

        const controLlingPersonTitle = 'Is the Ultimate Beneficial Owner (UBO) a legal entity?';
        expect(getByText(controLlingPersonTitle)).toBeInTheDocument();

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

        const nameInput = getByLabelText('Name and surname');
        expect(nameInput).toBeInTheDocument();
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        // @ts-ignore
        expect(nameInput.value).toBe('John Doe');

        const birthNumberInput = getByLabelText('Birth identification number');
        expect(birthNumberInput).toBeInTheDocument();
        fireEvent.change(birthNumberInput, { target: { value: '0101' } });
        // @ts-ignore
        expect(birthNumberInput.value).toBe('0101');

        const birthInput = getByLabelText('Place of Birth');
        expect(birthInput).toBeInTheDocument();
        fireEvent.change(birthInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(birthInput.value).toBe('Albania');

        const selectGenderElement = getByLabelText('Gender');
        const optionsGender = Array.from(selectGenderElement.querySelectorAll('option'));
        expect(optionsGender).toHaveLength(4);
        fireEvent.change(selectGenderElement, { target: { value: 'Female' } });
        // @ts-ignore
        expect(selectGenderElement.value).toBe('Female');

        const selectTaxResidencyInput = getByLabelText('Tax Residency');
        expect(selectTaxResidencyInput).toBeInTheDocument();
        const optionsTaxResidency = Array.from(selectTaxResidencyInput.querySelectorAll('option'));
        expect(optionsTaxResidency).toHaveLength(244);
        fireEvent.change(selectTaxResidencyInput, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(selectTaxResidencyInput.value).toBe('Albania');

        const citizenshipInput = getByText('Select country...');
        expect(citizenshipInput).toBeInTheDocument();

        const fileInput = getByLabelText('Upload File');
        expect(fileInput).toBeInTheDocument();
        const file = new File(['file contents'], 'filename.txt', { type: 'text/plain' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const svgElement = getByTestId('icon');
        const svgIcon = svgElement.querySelector('svg');

        expect(svgIcon).toBeInTheDocument();
        expect(svgIcon).toHaveTextContent('trash.svg');

        const residenceTitle = 'Permanent or other residence';
        expect(getByText(residenceTitle)).toBeInTheDocument();

        const selectCountryElement = getByLabelText('Country');
        const optionsCountry = Array.from(selectCountryElement.querySelectorAll('option'));
        expect(optionsCountry).toHaveLength(244);
        fireEvent.change(selectCountryElement, { target: { value: 'Albania' } });
        // @ts-ignore
        expect(selectCountryElement.value).toBe('Albania');

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

        const cityInput = getByLabelText('City');
        expect(cityInput).toBeInTheDocument();
        fireEvent.change(cityInput, { target: { value: 'Kiev' } });
        // @ts-ignore
        expect(cityInput.value).toBe('Kiev');

        const zipCodeInput = getByLabelText('ZIP Code');
        expect(zipCodeInput).toBeInTheDocument();
        fireEvent.change(zipCodeInput, { target: { value: '05' } });
        // @ts-ignore
        expect(zipCodeInput.value).toBe('05');

        const permanentResidenceTitle = 'Is your permanent (RESIDENCE) address the same as your mailing address?';
        expect(getByText(permanentResidenceTitle)).toBeInTheDocument();

        const submitBtn = getByText('Please fill up all fields');
        expect(submitBtn).toBeInTheDocument();

        expect(getByTestId('uboModalTest')).toMatchSnapshot();
    });

    it('should render a ubo modal for LEGAL person', async () => {
        const {
            getByTestId,
            getByLabelText,
            getByText,
            getByRole
        } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <UboModal addUbo={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        const title = 'Is the Ultimate Beneficial Owner (UBO) a legal entity?';
        expect(getByText(title)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(false);
        fireEvent.click(radioBtnTrue);
        await waitFor(() => {
            // @ts-ignore
            expect(radioBtnTrue.checked).toBe(true);
        });

        const companyName = getByLabelText('Company name');
        expect(companyName).toBeInTheDocument();
        fireEvent.change(companyName, { target: { value: 'CryptoYou' } });
        // @ts-ignore
        expect(companyName.value).toBe('CryptoYou');

        const fileTitle = 'Copy of excerpt of public register or other valid documents proving the existence of legal entity (Articles of Associations, Deed of Foundation etc.)';
        expect(getByText(fileTitle)).toBeInTheDocument();

        const fileInput = getByLabelText('Upload File');
        expect(fileInput).toBeInTheDocument();
        const file = new File(['file contents'], 'filename.txt', { type: 'text/plain' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const statutoryNameInput = getByLabelText('Name and Surname');
        expect(statutoryNameInput).toBeInTheDocument();
        fireEvent.change(statutoryNameInput, { target: { value: 'CryptoYou Statutory' } });
        // @ts-ignore
        expect(statutoryNameInput.value).toBe('CryptoYou Statutory');

        const dateIncorporationInput = getByLabelText('Date of incorporation');
        expect(dateIncorporationInput).toBeInTheDocument();
        expect(dateIncorporationInput).toHaveAttribute('id', 'label-uboInfo-dateOfBirth');
        const formattedDate = format(new Date(), 'yyyy-MM-dd');
        fireEvent.change(dateIncorporationInput, { target: { value: formattedDate } });
        // @ts-ignore
        expect(dateIncorporationInput.value).toBe(formattedDate);

        const countryInput = getByRole('combobox');
        expect(countryInput).toBeInTheDocument();
        fireEvent.change(countryInput, { target: { value: 'Algeria' } });
        // @ts-ignore
        expect(countryInput.value).toBe('Algeria');

        const subsequentlyBusinessCompanyInput = getByLabelText('Subsequently business company');
        expect(subsequentlyBusinessCompanyInput).toBeInTheDocument();
        fireEvent.change(subsequentlyBusinessCompanyInput, { target: { value: 'England' } });
        // @ts-ignore
        expect(subsequentlyBusinessCompanyInput.value).toBe('England');

        const registeredOfficeAddressInput = getByLabelText('Registered office address');
        expect(registeredOfficeAddressInput).toBeInTheDocument();
        fireEvent.change(registeredOfficeAddressInput, { target: { value: 'Registered address' } });
        // @ts-ignore
        expect(registeredOfficeAddressInput.value).toBe('Registered address');

        const permanentResidenceInput = getByLabelText('Permanent Residence');
        expect(permanentResidenceInput).toBeInTheDocument();
        fireEvent.change(permanentResidenceInput, { target: { value: 'Permanent address' } });
        // @ts-ignore
        expect(permanentResidenceInput.value).toBe('Permanent address');


        const identificationNumberInput = getByLabelText('Identification number');
        expect(identificationNumberInput).toBeInTheDocument();
        fireEvent.change(identificationNumberInput, { target: { value: '0101' } });
        // @ts-ignore
        expect(identificationNumberInput.value).toBe('0101');

        const submitBtn = getByText('Please fill up all fields');
        expect(submitBtn).toBeInTheDocument();

        expect(getByTestId('uboModalTest')).toMatchSnapshot();
    });
});