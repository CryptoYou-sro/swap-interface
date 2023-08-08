import { Chain } from '@wagmi/core';
 
export const moonbeam = {
    id: 1284,
    name: 'Moonbeam',
    network: 'moonbeam',
    nativeCurrency: {
        decimals: 18,
        name: 'GLMR',
        symbol: 'GLMR',
    },
    rpcUrls: {
        public: {
            http: ['https://rpc.api.moonbeam.network'],
            webSocket: ['wss://wss.api.moonbeam.network'],
        },
        default: {
            http: ['https://rpc.api.moonbeam.network'],
            webSocket: ['wss://wss.api.moonbeam.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Moonscan',
            url: 'https://moonscan.io',
        },
        etherscan: {
            name: 'Moonscan',
            url: 'https://moonscan.io',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 609002,
        },
    },
    testnet: false
} as const satisfies Chain;

export const bsc = {
    id: 56,
    name: 'Binance Smart Chain',
    network: 'bsc',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        public: {
            http: ['https://bsc.publicnode.com'],
        },
        default: {
            http: ['https://bsc.publicnode.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BscScan',
            url: 'https://bscscan.com',
        },
        etherscan: {
            name: 'BscScan',
            url: 'https://bscscan.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 15921452,
        },
    },
    testnet: false
} as const satisfies Chain;
