import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import SelectDropDown from 'react-select';
import styled, { css } from 'styled-components';
import { Button, Icon } from '../components';
import { BINANCE_FEE, NETWORK_TO_ID, beautifyNumbers, useStore } from '../helpers';
import { DEFAULT_BORDER_RADIUS, fontSize, fontWeight, pxToRem, spacing } from '../styles';

const Wrapper = styled.div(() => {
    return css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: ${spacing[32]} ${spacing[18]};
        min-width: ${pxToRem(300)};
        height: 100%;
        background-color: #fff;
        font-family: 'Open Sans';
        font-weight: 600;
        overflow: hidden;
    `;
});

const InputContainer = styled.div(() => {
    return css`
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        /* max-width: ${pxToRem(420)}; */
    `;
});

const InputBox = styled.div(() => {
    return css`
    display: flex;
    background-color: #F5F4F4;
    width: 100%;
    /* max-width: ${pxToRem(420)}; */
    border-radius: ${DEFAULT_BORDER_RADIUS};
    /* margin-bottom: ${spacing[8]}; */
    position: relative;
    `;
});

const Price = styled.p(() => {
    return css`
    color: black;
    font-weight: 400;
    font-size: ${fontSize[14]};
    line-height: ${pxToRem(19)};
    padding-left: ${spacing[8]};
    margin: ${spacing[8]} 0;
    `;
});

const Input = styled.input(() => {
    return css`
        width: 100%;
        /* max-width: ${pxToRem(250)}; */
        /* height: ${spacing[26]}; */
        border: none;
        position: relative;
        padding: ${spacing[22]} 0 ${pxToRem(4)} ${spacing[10]};
        border-radius: ${DEFAULT_BORDER_RADIUS};
        background-color: #F5F4F4;
        font-weight: ${fontWeight.semibold};
        font-size: ${fontSize[20]};
        line-height: ${pxToRem(27)};

        &:disabled {
            color: black;
        }
        
        &:focus {
            outline: none;
        }

        &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
}`;
});

const Label = styled.label(() => {
    return css`
        position: absolute;
        top: 4px;
        left: 6px;
        pointer-events: none;
        z-index: 1;
        color: #000;
        font-size: ${fontSize[12]};
    `;
});

const TableContainer = styled.div(() => {
    return css`
        width: 100%;
        /* max-width: ${pxToRem(410)}; */
    `;
});

// const TableBox = styled.div(() => {
//     return css`
//         display: flex;
//         width: 100%;
//         /* max-width: ${pxToRem(410)}; */
//         flex-wrap: wrap;
//         margin-bottom: ${spacing[18]};
//     `;
// });

// const TableRow = styled.div(() => {
//     return css`
//     display: flex;
//     width: 100%;
//     border-bottom: 1px solid #CECECE;
//     padding-bottom: ${spacing[6]};
//     padding-top: ${pxToRem(4)};
//     color: black;
//     font-weight: 600;
//     font-size: 12px;
//     `;
// });

const ShortName = styled.div(() => {
    return css`
        font-size: ${fontSize[20]};
        font-weight: 600;
    `;
});

// const TableCol = styled.div`
//     flex: 2;

//     &:nth-child(3) {
//         flex-grow: 3;
//         text-align: start;
//     }
// `;

const Hr = styled.hr`
    color: #CECECE;
    border: 1px solid #CECECE;
`;

const SubmitContainer = styled.div`
width: 100%;
text-align: center;
margin-top: ${spacing[30]};
`;

interface DepthResponse {
    bids?: Array<[string, string]>;
    asks?: Array<[string, string]>;
}

export const Widget = () => {
    const {
        state: {
            theme,
            availableDestinationNetworks: DESTINATION_NETWORKS,
            availableSourceNetworks: SOURCE_NETWORKS
        }

    } = useStore();
    const [swapPair, setSwapPair] = useState({
        sourceToken: {
            network: 'ETH',
            token: 'USDT'
        },
        destinationToken: {
            network: 'BTC',
            token: 'BTC'
        },
    });
    const [selectedSourceOption, setSelectedSourceOption] = useState(
        {
            label: 'ETH',
            value: 'USDT',
        }
    );

    const [selectedDestOption, setSelectedDestOption] = useState(
        {
            label: 'BTC',
            value: 'BTC',
        }
    );
    const themeMode = 'light';
    const selectDropDownStyles: any = {
        multiValueRemove: (styles: any): any => ({
            ...styles,
            color: 'red',
            ':hover': {
                backgroundColor: 'red',
                color: 'white'
            }
        }),
        menu: (base: any): any => ({
            ...base,
            backgroundColor: `${themeMode === 'light' ? '#ffffff' : themeMode === 'dark' ? '#000000' : theme.background.secondary}`,
        }),
        option: (base: any): any => ({
            ...base,
            border: 'none',
            height: '100%',
            // color: `${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default}`,
            color: 'black',
            backgroundColor: `${themeMode === 'light' ? '#ffffff' : themeMode === 'dark' ? '#000000' : theme.background.secondary}`,
            cursor: 'pointer',
            ':hover': {
                color: '#00A8E8;'
            }

        }),
        control: (baseStyles: any): any => ({
            ...baseStyles,
            borderColor: 'transparent',
            background: 'none',
            color: `${theme.font.default}`,
            height: '100%',
            padding: 0,
            width: `${pxToRem(160)}`,
            ':hover': {
                border: 'none',
            }
        }),
        input: (provided: any): any => ({
            ...provided,
            color: `${themeMode === 'light' ? '#000000' : themeMode === 'dark' ? '#ffffff' : theme.font.default}`,
            maxWidth: `${pxToRem(160)}`,
        }),
        dropdownIndicator: (provided: any): any => ({
            ...provided,
            color: '#000',
        }),
        indicatorSeparator: (provided: any): any => ({
            ...provided,
            display: 'none',
        }),
        valueContainer: (provided: any): any => ({
            ...provided,
            padding: '2px 10px',

        })

    };

    const getSourceTokens = (network: string) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        SOURCE_NETWORKS
            ? // @ts-ignore
            SOURCE_NETWORKS[NETWORK_TO_ID[network]]?.['tokens']
            : [];

    const ethSourceTokens = useMemo((): any => getSourceTokens('ETH'), [SOURCE_NETWORKS]);
    const bscSourceTokens = useMemo((): any => getSourceTokens('BSC'), [SOURCE_NETWORKS]);
    const glmrSourceTokens = useMemo((): any => getSourceTokens('GLMR'), [SOURCE_NETWORKS]);

    const ethOptions = Object.entries(ethSourceTokens).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            return {
                ...value,
                label: 'ETH',
                value: key,
            };
        }
    });

    const bscOptions = Object.entries(bscSourceTokens).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            return {
                ...value,
                label: 'BSC',
                value: key,
            };
        }
    });

    const glmrOptions = Object.entries(glmrSourceTokens).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            return {
                ...value,
                label: 'GLMR',
                value: key,
            };
        }
    });

    const sourceTokensList = [...ethOptions, ...bscOptions, ...glmrOptions];
    // const [thorList, setThorList] = useState([]);
    const [sourceTokenOptions, setSourceTokenOptions] = useState<any>([]);
    const [destinationTokenOptions, setDestinationTokenOptions] = useState<any>([]);
    const [exchangeRate, setExchangeRate] = useState<{ price: number; totalAmount: number } | null>(null);
    const [sourceAmount, setSourceAmount] = useState<string>('');
    const [destinationAmount, setDestinationAmount] = useState<string>('');
    // const [thorAmount, setThorAmount] = useState('');
    // const [percentage, setPercentage] = useState<number>(0);
    const isTokensSelected = swapPair.destinationToken.token !== '' && swapPair.sourceToken.token !== '';
    // const [isThorSupports, setIsThorSupports] = useState(true);

    const CancelToken = axios.CancelToken;
    const source = useRef(CancelToken.source());

    async function getOrderBookPrice(currency1: any, currency2: any, startAmount: any, startCurrency: any) {
        let pair: string | '' = '';
        let res: DepthResponse | any = null;
        let totalPrice: string | number = 0;
        let totalCurrencyAmount: string | number = 0;
        try {
            await axios.get<DepthResponse>(`https://api.binance.com/api/v3/depth?symbol=${currency1}${currency2}&limit=4999`).then(r => res = r.data);
            if (res) {
                pair = `${currency1}${currency2}`;
            }
        } catch (error: any) {
            await axios.get<DepthResponse>(`https://api.binance.com/api/v3/depth?symbol=${currency2}${currency1}&limit=4999`).then(r => res = r.data);
            if (res) {
                pair = `${currency2}${currency1}`;
            }
        }
        if (startAmount > 0) {
            if ((pair === `${currency1}${currency2}` && startCurrency === currency1) || (pair === `${currency2}${currency1}` && startCurrency === currency2)) {
                if (res) {
                    // console.log('SELL');
                    const bids: string[] = res.bids;
                    let leftToSwap: any = startAmount;

                    for (let i = 0; i < res.bids.length; i++) {
                        let orderBookAmount = 0;
                        if (leftToSwap === 0) {
                            break;
                        }
                        const price = parseFloat(bids[i][0]);
                        const amount = parseFloat(bids[i][1]);

                        if (amount < leftToSwap) {
                            orderBookAmount = amount;
                        } else {
                            orderBookAmount = leftToSwap;
                        }

                        leftToSwap -= orderBookAmount;
                        totalCurrencyAmount += price * orderBookAmount;
                        totalPrice = totalCurrencyAmount / startAmount;
                    }
                }
            } else if
                ((pair === `${currency1}${currency2}` && startCurrency === currency2) || (pair === `${currency2}${currency1}` && startCurrency === currency1)) {
                if (res) {
                    // console.log('Buy');
                    const asks: string[] = res.asks;
                    let leftToSwap: any = startAmount;

                    for (let i = 0; i < res.asks.length; i++) {
                        let orderBookAmount = 0;
                        if (leftToSwap === 0) {
                            break;
                        }
                        const price = parseFloat(asks[i][0]);
                        const amount = parseFloat(asks[i][1]);

                        if (amount * price < leftToSwap) {
                            orderBookAmount = amount * price;
                        } else {
                            orderBookAmount = leftToSwap;
                        }

                        leftToSwap -= orderBookAmount;
                        totalCurrencyAmount = totalCurrencyAmount + 1 / price * orderBookAmount;
                        totalPrice = totalCurrencyAmount / startAmount;
                    }
                }
            }
        }

        return { price: totalPrice, totalAmount: totalCurrencyAmount };
    }

    useEffect(() => {
        if (SOURCE_NETWORKS && sourceTokensList.length > 0) {
            setSourceTokenOptions([...sourceTokensList]);
        }
    }, [SOURCE_NETWORKS]);

    useEffect(() => {
        if (SOURCE_NETWORKS && DESTINATION_NETWORKS && swapPair.sourceToken.network && swapPair.sourceToken.token) {
            const data = DESTINATION_NETWORKS[NETWORK_TO_ID[swapPair.sourceToken.network as keyof typeof NETWORK_TO_ID]]?.[swapPair.sourceToken.token];
            const result = Object.keys(data).map(network => {
                return Object.keys(data[network].tokens).map(token => {
                    return { label: network, value: token };
                });
            }).flat();

            const filteredOptions = result.filter(obj => !(obj.value === swapPair.sourceToken.token));
            setDestinationTokenOptions([...filteredOptions]);
        }
    }, [swapPair.sourceToken.token, SOURCE_NETWORKS, DESTINATION_NETWORKS]);

    useEffect(() => {
        if (isTokensSelected && parseFloat(sourceAmount) > 0) {
            const getDestinationAmount = async () => {
                const orderBookPrice = await getOrderBookPrice(
                    swapPair.sourceToken.token,
                    swapPair.destinationToken.token,
                    sourceAmount,
                    swapPair.sourceToken.token,
                );
                setExchangeRate(orderBookPrice);
            };
            void getDestinationAmount();
        }
    }, [sourceAmount, swapPair.sourceToken.token, swapPair.destinationToken.token]);

    useEffect(() => {
        if (exchangeRate?.price) {
            const calcDestinationAmount: any = parseFloat(sourceAmount) * exchangeRate.price * (1 - BINANCE_FEE) - withdrawFee.amount;
            if (calcDestinationAmount < 0) {
                setDestinationAmount('0');
            } else {
                setDestinationAmount(calcDestinationAmount);
            }
        }
    }, [exchangeRate]);

    const withdrawFee = useMemo((): any => {
        if (isTokensSelected && DESTINATION_NETWORKS) {
            const withdrawFee =
                // @ts-ignore
                DESTINATION_NETWORKS[[NETWORK_TO_ID[swapPair.sourceToken.network]]]?.[swapPair.sourceToken.token]?.[swapPair.destinationToken.network]?.[
                'tokens'
                ]?.[swapPair.destinationToken.token]?.['withdrawFee'];

            return { amount: parseFloat(withdrawFee), currency: swapPair.destinationToken.token, name: 'Withdrawal' };
        } else {
            return { amount: 0, currency: swapPair.destinationToken.token, name: 'Withdrawal' };
        }
    }, [swapPair.destinationToken.token, swapPair.sourceToken.token, DESTINATION_NETWORKS]);

    // const getThorSwapData = _.debounce(async () => {
    //     if (isTokensSelected && +sourceAmount > 0 && thorList.length > 0) {
    //         // @ts-ignore
    //         const sourceId = thorList.find(obj => (obj.chain === swapPair.sourceToken.network && obj.ticker === swapPair.sourceToken.token));
    //         // @ts-ignore
    //         const destId = thorList.find(obj => (obj.chain === swapPair.destinationToken.network && obj.ticker === swapPair.destinationToken.token));
    //         try {
    //             source.current.cancel(); // Cancel previous request
    //             source.current = CancelToken.source(); // Create new source
    //             await axios.get(
    //                 // @ts-ignore
    //                 `${routes.thorSwap}sellAsset=${sourceId.address ? `${swapPair.sourceToken.network}.${swapPair.sourceToken.token}-${sourceId.address.toUpperCase()}` : sourceId.identifier}&buyAsset=${destId.address ? `${swapPair.destinationToken.network}.${swapPair.destinationToken.token}-${destId.address.toUpperCase()}` : destId.identifier}&slippage=3&sellAmount=${sourceAmount}&senderAddress=&recipientAddress=&affiliateBasisPoints=30&affiliateAddress=t&isAffiliateFeeFlat=true`, {
    //                 cancelToken: source.current.token
    //             })
    //                 .then(res => {
    //                     const uniswapV3 = res.data.routes.find((obj: any) => obj.providers[0] === 'UNISWAPV3');
    //                     if (uniswapV3) {
    //                         setThorAmount(uniswapV3.expectedOutput);
    //                         setIsThorSupports(true);
    //                     } else {
    //                         const outPutVariants: number[] = Object.values(res.data.routes).map((item: any): any => parseFloat(item.expectedOutput));
    //                         const bestExpectedOutput: string = Math.max(...outPutVariants).toString();
    //                         setThorAmount(bestExpectedOutput);
    //                         setIsThorSupports(true);
    //                     }
    //                 });
    //         } catch (error) {
    //             if (axios.isCancel(error)) {
    //                 console.log('Request canceled');
    //             } else {
    //                 console.log('error catch', error);
    //                 setThorAmount('0');
    //                 // setPercentage(100);
    //                 setIsThorSupports(false);
    //             }
    //         }
    //     }
    // }, 500);

    // useEffect(() => {
    //     void getThorSwapData();
    // }, [sourceAmount, swapPair.sourceToken.token, swapPair.destinationToken.token]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            source.current.cancel();
        };
    }, []);

    // useEffect(() => {
    //     const fetchThorSwapLists = async () => {
    //         try {
    //             const urls = [
    //                 'https://static.thorswap.net/token-list/Thorchain-supported-ERC20.json',
    //                 'https://static.thorswap.net/token-list/Thorchain-supported-ARC20.json',
    //                 'https://static.thorswap.net/token-list/Woofi.json',
    //                 'https://static.thorswap.net/token-list/Traderjoe.json',
    //                 'https://static.thorswap.net/token-list/Pangolin.json',
    //                 'https://static.thorswap.net/token-list/1inch.json',
    //                 'https://static.thorswap.net/token-list/Coingecko.json',
    //                 'https://static.thorswap.net/token-list/Sushiswap.json',
    //                 'https://static.thorswap.net/token-list/Thorchain.json',
    //                 'https://static.thorswap.net/token-list/Pancakeswap-supported-erc20.json',
    //                 'https://static.thorswap.net/token-list/Pancakeswap-supported-bsc20.json',
    //             ];
    //             const requests = urls.map((url) => axios.get(url));
    //             const responses = await Promise.all(requests);
    //             const combinedTokens: any = responses.flatMap((response): any => response.data.tokens);

    //             setThorList(combinedTokens);

    //         } catch (error) {
    //             console.log('error', error);
    //         }
    //     };
    //     void fetchThorSwapLists();
    // }, []);

    const handleSelectSourceToken = (event: any) => {
        setSwapPair({ ...swapPair, sourceToken: { ...swapPair.sourceToken, token: event.value, network: event.label }, destinationToken: { ...swapPair.destinationToken, token: '', network: '' } });
        setSelectedSourceOption({ ...selectedSourceOption, value: event.value, label: event.label });
        setSelectedDestOption({ ...selectedDestOption, value: '', label: '' });
        setDestinationAmount('');
        setSourceAmount('');
    };

    const handleSelectDestinationToken = (event: any) => {
        setSwapPair({ ...swapPair, destinationToken: { ...swapPair.destinationToken, token: event.value, network: event.label } });
        setSelectedDestOption({ ...selectedDestOption, value: event.value, label: event.label });
    };

    const formatOptionLabel = ({ value, label }: any) => {
        return (
            <div style={{ display: 'flex', alignContent: 'baseline', width: '100%', paddingRight: '10px' }}>
                {value && <Icon icon={value.toLowerCase()} size={20} />}
                <div style={{ marginLeft: '10px' }}>
                    <div style={{ color: '#8E8E8E', fontSize: '14px' }}>
                        {label === 'ETH' ? 'Ethereum' : label}
                    </div>
                    <ShortName>
                        {value}
                    </ShortName>
                </div>
            </div>
        );
    };

    // useEffect(() => {
    //     const calcPercentage = (cryptoYouAmount: any, thorAmount: any) => {
    //         if (parseFloat(cryptoYouAmount) > 0 && parseFloat(thorAmount) > 0) {
    //             const percentage = (((parseFloat(cryptoYouAmount) / parseFloat(thorAmount)) * 100) - 100);

    //             setPercentage(+beautifyNumbers({ n: percentage, digits: 1 }));
    //         } else {
    //             return '0';
    //         }
    //     };
    //     void calcPercentage(destinationAmount, thorAmount);
    // }, [destinationAmount, thorAmount, swapPair.destinationToken.token]);

    const isDisabled = +sourceAmount <= 0 || !isTokensSelected;
    const message = !isDisabled ? 'Swap Now' : !isTokensSelected ? 'Select Token and Amount' : 'Amount must be greater than 0';

    return (
        <Wrapper>
            <InputContainer>
                <InputBox>
                    <Label>You swap</Label>
                    <Input type='number' onChange={(e) => setSourceAmount(e.target.value)} value={sourceAmount} />
                    <Hr />

                    <SelectDropDown
                        options={sourceTokenOptions}
                        isMulti={false}
                        styles={selectDropDownStyles}
                        formatOptionLabel={formatOptionLabel}
                        placeholder='Select token'
                        onChange={(e: any) => handleSelectSourceToken(e)}
                        value={selectedSourceOption}
                    />
                </InputBox>
                {isTokensSelected && exchangeRate && +sourceAmount > 0 ? (
                    <Price>1{swapPair.sourceToken.token} - {beautifyNumbers({ n: exchangeRate?.price })} {swapPair.destinationToken.token}</Price>
                ) : (
                    <Price>Please select tokens and amount</Price>
                )}
                <InputBox>
                    <Label>You get</Label>
                    <Input type='number' disabled value={beautifyNumbers({ n: destinationAmount })} />
                    <Hr />

                    <SelectDropDown
                        options={destinationTokenOptions}
                        isMulti={false}
                        inputId={swapPair.sourceToken.token && '0'}
                        styles={selectDropDownStyles}
                        formatOptionLabel={formatOptionLabel}
                        placeholder={swapPair.sourceToken.token && 'Select token'}
                        onChange={(e: any) => handleSelectDestinationToken(e)}
                        isDisabled={!swapPair.sourceToken.token}
                        value={selectedDestOption}
                    />
                </InputBox>
            </InputContainer>
            <TableContainer>
                {/* <TableBox>
                    <TableRow>
                        <TableCol>CryptoYou</TableCol>
                        <TableCol>
                            {isTokensSelected ? `${beautifyNumbers({ n: destinationAmount, digits: 5 })} ${swapPair.destinationToken.token}` : ''}
                        </TableCol>
                        <TableCol>{percentage && percentage > 0 ? `${Math.abs(percentage)}% better than competitors` : percentage && percentage < 0 ? `${Math.abs(percentage)}% worst than competitors` : ''} </TableCol>
                    </TableRow>
                    <TableRow style={{ color: '#8E8E8E' }}>
                        <TableCol>THORSwap</TableCol>
                        <TableCol>
                            {isTokensSelected && isThorSupports ? `${beautifyNumbers({ n: thorAmount, digits: 5 })} ${swapPair.destinationToken.token}` : ''}
                            {isTokensSelected && !isThorSupports && 'N/A'}
                        </TableCol>
                        <TableCol>
                            {isThorSupports && percentage && percentage < 0 ? `${Math.abs(percentage)}% better than CryptoYou` : isThorSupports && percentage && percentage > 0 ? `${Math.abs(percentage)}% worst than CryptoYou` : ''}
                            {!isThorSupports && ''}
                        </TableCol>
                    </TableRow>
                </TableBox> */}
                <SubmitContainer>
                    <Button onClick={() => window.open(`https://app.cryptoyou.io/?sellAssetNet=${swapPair.sourceToken.network}&sellAssetToken=${swapPair.sourceToken.token}&sellAssetAmount=${sourceAmount}&buyAssetNet=${swapPair.destinationToken.network}&buyAssetToken=${swapPair.destinationToken.token}`)} disabled={isDisabled} >
                        {message}
                    </Button>
                </SubmitContainer>
            </TableContainer>
        </Wrapper>
    );
};
