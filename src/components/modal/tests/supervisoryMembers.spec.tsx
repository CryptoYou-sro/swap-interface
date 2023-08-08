import { fireEvent, render } from '@testing-library/react';
import { publicProvider } from '@wagmi/core/dist/providers/public';
import { w3mConnectors } from '@web3modal/ethereum';
import { format } from 'date-fns';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet } from 'wagmi/dist/chains';
import { AuthProvider } from '../../../helpers';
import { bsc, moonbeam } from '../../../helpers/chains';
import { SupervisoryMembers } from '../supervisoryMembers';

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
    it('should render a supervisory members form', () => {
        const { getByTestId, getByText, getByDisplayValue, getByLabelText, getAllByRole } = render(
            <WagmiConfig client={wagmiClient}>
                <AuthProvider>
                    <SupervisoryMembers addSupervisor={true} />
                </AuthProvider>
            </WagmiConfig>
        );

        expect(getByText('Information on members of the supervisory board')).toBeInTheDocument();

        const nameInput = getByLabelText('Full name');
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveAttribute('id', 'label-supervisory-full-name');
        expect(nameInput).toHaveAttribute('name', 'fullName');
        expect(nameInput).toHaveAttribute('value', '');
        expect(nameInput).toHaveAttribute('type', 'text');
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(getByDisplayValue('John Doe')).toBeInTheDocument();

        const dateInput = getByLabelText('Date of birth');
        expect(dateInput).toBeInTheDocument();
        expect(dateInput).toHaveAttribute('id', 'label-supervisory-date');
        const formattedDate = format(new Date(), 'yyyy-MM-dd');
        fireEvent.change(dateInput, { target: { value: formattedDate } });
        expect(getByDisplayValue(formattedDate)).toBeInTheDocument();

        const birthInput = getByLabelText('Place of Birth');
        expect(birthInput).toBeInTheDocument();
        expect(birthInput).toHaveAttribute('id', 'label-supervisory-place-of-birth');
        fireEvent.change(birthInput, { target: { value: 'Country' } });
        expect(getByDisplayValue('Country')).toBeInTheDocument();


        const genderInput = getByLabelText('Gender');
        expect(genderInput).toBeInTheDocument();
        expect(genderInput).toHaveAttribute('id', 'label-supervisory-select-gender');
        fireEvent.change(genderInput, { target: { value: 'Female' } });
        expect(getByDisplayValue('Female')).toBeInTheDocument();

        const countryResidenceInput = getByLabelText('Country');
        expect(countryResidenceInput).toBeInTheDocument();

        const selectElement = getByLabelText('Country');
        const options = Array.from(selectElement.querySelectorAll('option'));
        expect(options).toHaveLength(244);
        fireEvent.change(selectElement, { target: { value: 'Albania' } });
        expect(getByDisplayValue('Albania')).toBeInTheDocument();


        const streetInput = getByLabelText('Street');
        expect(streetInput).toBeInTheDocument();
        expect(streetInput).toHaveAttribute('id', 'label-supervisory-address-permanent-street');
        fireEvent.change(streetInput, { target: { value: 'Independence street' } });
        expect(getByDisplayValue('Independence street')).toBeInTheDocument();

        const streetNumberInput = getByLabelText('Street number');
        expect(streetNumberInput).toBeInTheDocument();
        expect(streetNumberInput).toHaveAttribute('id', 'label-supervisory-address-permanent-street-number');
        fireEvent.change(streetNumberInput, { target: { value: '01' } });
        expect(getByDisplayValue('01')).toBeInTheDocument();

        const cityInput = getByLabelText('City');
        expect(cityInput).toBeInTheDocument();
        expect(cityInput).toHaveAttribute('id', 'label-supervisory-address-permanent-municipality');
        fireEvent.change(cityInput, { target: { value: 'London' } });
        expect(getByDisplayValue('London')).toBeInTheDocument();

        const zipCodeInput = getByLabelText('ZIP Code');
        expect(zipCodeInput).toBeInTheDocument();
        expect(zipCodeInput).toHaveAttribute('id', 'label-supervisory-address-permanent-zipCode');
        fireEvent.change(zipCodeInput, { target: { value: '04215' } });
        expect(getByDisplayValue('04215')).toBeInTheDocument();


        const radioBtnInput = getAllByRole('radio');
        expect(radioBtnInput).toHaveLength(2);

        const radioBtnTrue = getByLabelText('Yes');
        expect(radioBtnTrue).toBeInTheDocument();

        const radioBtnFalse = getByLabelText('No');
        expect(radioBtnFalse).toBeInTheDocument();
        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(false);
        fireEvent.click(radioBtnFalse);
        // @ts-ignore
        expect(radioBtnFalse.checked).toBe(true);

        const submitBtn = getByText('Please fill up all fields');
        expect(submitBtn).toBeInTheDocument();

        expect(getByTestId('supervisoryMembersTest')).toMatchSnapshot();
    });

});