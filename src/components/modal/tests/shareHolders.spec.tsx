import { fireEvent, render, waitFor } from '@testing-library/react';
import { publicProvider } from '@wagmi/core/dist/providers/public';
import { w3mConnectors } from '@web3modal/ethereum';
import { format } from 'date-fns';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet } from 'wagmi/dist/chains';
import { AuthProvider } from '../../../helpers';
import { bsc, moonbeam } from '../../../helpers/chains';
import { ShareHoldersModal } from '../shareholdersModal';

describe('ShareHolders', () => {
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

    it('should render a shareholders form', () => {
        const { getByTestId, getByLabelText, getByText } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <ShareHoldersModal addShareHolder={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        const title = 'Information on majority shareholders or person in control of client (more than 25%)';
        expect(getByText(title)).toBeInTheDocument();

        const controLlingPersonTitle = 'Is the controlling person is a legal entity ?';
        expect(getByText(controLlingPersonTitle)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();

        const submitBtn = getByText('Please fill up all fields');
        expect(submitBtn).toBeInTheDocument();

        expect(getByTestId('shareHoldersTest')).toMatchSnapshot();
    });

    it('should render a shareholders form for NATURAL person', async () => {
        const { getByTestId, getByLabelText, getByText } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <ShareHoldersModal addShareHolder={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        const title = 'Information on majority shareholders or person in control of client (more than 25%)';
        expect(getByText(title)).toBeInTheDocument();

        const controLlingPersonTitle = 'Is the controlling person is a legal entity ?';
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

        const birthNumberInput = getByLabelText('Birth identification number');
        expect(birthNumberInput).toBeInTheDocument();

        const birthInput = getByLabelText('Place of Birth');
        expect(birthInput).toBeInTheDocument();

        const selectGenderElement = getByLabelText('Gender');
        const optionsGender = Array.from(selectGenderElement.querySelectorAll('option'));
        expect(optionsGender).toHaveLength(4);

        const selectTaxResidencyInput = getByLabelText('Tax Residency');
        expect(selectTaxResidencyInput).toBeInTheDocument();
        const optionsTaxResidency = Array.from(selectTaxResidencyInput.querySelectorAll('option'));
        expect(optionsTaxResidency).toHaveLength(244);

        const citizenshipInput = getByText('Select country...');
        expect(citizenshipInput).toBeInTheDocument();

        const fileInput = getByLabelText('Upload File');
        expect(fileInput).toBeInTheDocument();

        const svgElement = getByTestId('icon');
        const svgIcon = svgElement.querySelector('svg');

        expect(svgIcon).toBeInTheDocument();
        expect(svgIcon).toHaveTextContent('trash.svg');

        const residenceTitle = 'Permanent or other residence';
        expect(getByText(residenceTitle)).toBeInTheDocument();

        const selectCountryElement = getByLabelText('Country');
        const optionsCountry = Array.from(selectCountryElement.querySelectorAll('option'));
        expect(optionsCountry).toHaveLength(244);

        const streetInput = getByLabelText('Street');
        expect(streetInput).toBeInTheDocument();

        const streetNumberInput = getByLabelText('Street number');
        expect(streetNumberInput).toBeInTheDocument();

        const cityInput = getByLabelText('City');
        expect(cityInput).toBeInTheDocument();

        const zipCodeInput = getByLabelText('ZIP Code');
        expect(zipCodeInput).toBeInTheDocument();

        const permanentResidenceTitle = 'Is your permanent (RESIDENCE) address the same as your mailing address?';
        expect(getByText(permanentResidenceTitle)).toBeInTheDocument();

        const submitBtn = getByText('Please fill up all fields');
        expect(submitBtn).toBeInTheDocument();

        expect(getByTestId('shareHoldersTest')).toMatchSnapshot();
    });

    it('should render a shareholders form for LEGAL person', async () => {
        const { getByTestId, getByLabelText, getByText, getByRole } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <ShareHoldersModal addShareHolder={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        const title = 'Information on majority shareholders or person in control of client (more than 25%)';
        expect(getByText(title)).toBeInTheDocument();

        const controLlingPersonTitle = 'Is the controlling person is a legal entity ?';
        expect(getByText(controLlingPersonTitle)).toBeInTheDocument();

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();

        // @ts-ignore
        expect(radioBtnTrue.checked).toBe(false);
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


        const fileTitle = 'Copy of excerpt of public register or other valid documents proving the existence of legal entity (Articles of Associations, Deed of Foundation etc.).';
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
        expect(dateIncorporationInput).toHaveAttribute('id', 'label-shareHolderInfo-dateOfBirth');
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

        expect(getByTestId('shareHoldersTest')).toMatchSnapshot();
    });
});