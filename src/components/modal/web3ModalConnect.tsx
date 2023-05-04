import { Web3Modal } from '@web3modal/react';
import { useStore } from '../../helpers';
import { DEFAULT_BORDER_RADIUS } from '../../styles';

type Props = {
    projectId: string;
    ethereumClient: any;
};

export const Web3ModalConnect = ({ projectId, ethereumClient }: Props) => {
    const { state: { theme } } = useStore();
    const modalThemeMode = theme.name === 'light' ? 'light' : 'dark';

    return (
        <Web3Modal
            projectId={projectId}
            ethereumClient={ethereumClient}
            themeMode={modalThemeMode}
            themeVariables={{
                '--w3m-accent-color': `${theme.button.default}`,
                '--w3m-accent-fill-color': 'white',
                '--w3m-background-color': '#1d75a2',
                '--w3m-background-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-container-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-wallet-icon-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-input-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-button-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-secondary-button-border-radius': '0px',
                '--w3m-notification-border-radius': '0px',
                '--w3m-icon-button-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-button-hover-highlight-border-radius': `${DEFAULT_BORDER_RADIUS}`,
                '--w3m-font-family': 'Open Sans',
                '--w3m-z-index': '100000000'
            }}
        />
    );
};