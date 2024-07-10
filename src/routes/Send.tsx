import React, { CSSProperties, useEffect, useState } from 'react';
import { OauthClientCache, PageState, useAppState } from '../StateContext';
import { Address, GetContractReturnType, PrivateKeyAccount, PublicClient, WalletClient, getContract, encodePacked, encodeFunctionData } from 'viem'
import { publicActionReverseMirage, amountToNumber } from 'reverse-mirage'
import {
    createNativeCurrency,
    createAmountFromString,
    createAmountFromRaw,
} from 'reverse-mirage'
import { erc20Abi } from 'viem'
import CircularProgress from '@mui/joy/CircularProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';



const SendPage: React.FC = () => {
    const { oauthClient, setOauthClient, pageState, setPageState, requestId, setRequestId, userEmailAddr, username } = useAppState();
    const [amountStr, setAmountStr] = useState<string>('');
    const [amount, setAmount] = useState<bigint>(0n);
    const [token, setToken] = useState<string>('TEST');
    const [to, setTo] = useState<string>('');
    const decimals = 18;
    const baseAmount = 10n ** BigInt(decimals);
    const [balanceOfTest, setBalanceOfTest] = useState<bigint>(100n * baseAmount);
    const [allowanceOfTest, setAllowanceOfTest] = useState<bigint>(10n * baseAmount);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    // const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [txInfos, setTxInfos] = useState<[string, string, string][]>([]);

    const testTokenAddr = process.env.REACT_APP_TEST_TOKEN as Address | null;
    if (!testTokenAddr) {
        throw new Error('REACT_APP_TEST_TOKEN is not set');
    }


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountStr(e.target.value);
        console.log('amountStr:', amountStr);
        setAmount(_amountStrToBigint(e.target.value, decimals));
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setToken(e.target.value);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTo(e.target.value);
    };

    const handleSendClick = () => {
        setIsClicked(true);
        // console.log('Sending', { amount, token, to });
        // const txHash = await oauthClient?.oauthExecuteTx()
    };

    // useEffect(() => {

    // }, []);

    useEffect(() => {
        const waiting = async () => {
            if (requestId !== null) {
                console.log(requestId);
                await oauthClient?.waitEpheAddrActivated(requestId);
                setOauthClient(oauthClient);
                setRequestId(null);
                setPageState(PageState.send);
                const newCache: OauthClientCache = {
                    userEmailAddr,
                    username,
                    userWalletAddr: oauthClient.getWalletAddress() as Address,
                    ephePrivateKey: oauthClient.getEphePrivateKey(),
                    epheAddrNonce: oauthClient.getEpheAddrNonce() as string,
                };
                localStorage.setItem('oauthClient', JSON.stringify(newCache));
            }
        }
        waiting();
    }, [requestId]);

    useEffect(() => {
        if (!isClicked) {
            return;
        }
        const send = async () => {
            console.log('Sending', { amount, token, to });
            const data = encodeFunctionData({
                abi: erc20Abi,
                functionName: 'transfer',
                args: [to as Address, amount],
            });
            const txHash = await oauthClient?.oauthExecuteTx(testTokenAddr, data, 0n, amount);
            console.log('txHash:', txHash);
            setTxInfos([...txInfos, [txHash, amountStr, to]]);
            const newBalance = balanceOfTest - amount;
            setBalanceOfTest(newBalance);
            const newAllowance = allowanceOfTest - amount;
            setAllowanceOfTest(newAllowance);
            setIsClicked(false);
        };
        // waiting();
        send();
    }, [isClicked]);

    const styles: { [key: string]: CSSProperties } = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0',
            padding: '20px',
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            width: '100%',
            maxWidth: '400px',
        },
        input: {
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: 'calc(50% - 5px)',
        },
        fullInput: {
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '10px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            marginBottom: '10px',
        },
        address: {
            marginTop: '20px',
            fontSize: '16px',
        },
        info: {
            marginBottom: '10px',
            fontSize: '16px',
        },
    };

    const Loading = () => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        }}>
            <CircularProgress size="lg" />
            <p>Loading until your sign-up/sign-in is completed.</p>
        </div>
    );

    const Sending = () => (
        <div style={styles.container}>
            <div style={styles.address}>
                Wallet address: {`0x${oauthClient?.userWallet?.address}` ?? 'Not available'}
            </div>
            <div style={styles.info}>Balance: {_bigIntToAmountStr(balanceOfTest, decimals)} TEST</div>
            <div style={styles.info}>Remaining Allowance: {_bigIntToAmountStr(allowanceOfTest, decimals)} TEST</div>
            <input
                type="text"
                placeholder="Enter recipient address"
                value={to}
                onChange={handleToChange}
                style={styles.fullInput}
            />
            <input
                type="number"
                placeholder="Enter amount"
                value={amountStr}
                onChange={handleAmountChange}
                style={styles.input}
            />
            <select value={token} onChange={handleTokenChange} style={styles.input}>
                <option value="TEST">TEST</option>
                {/* <option value="Token2">Token2</option>
                    <option value="Token3">Token3</option> */}
            </select>
            <button onClick={handleSendClick} style={styles.button}>
                Send
            </button>
            {isClicked && <p style={{ color: 'limegreen', fontStyle: 'italic' }}>A transaction is sent!</p>}
            <div>
                Executed Transactions.
                <List>
                    {txInfos.map(([txHash, amount, to], index) => (
                        <ListItem key={index}><a href={`https://base-sepolia.blockscout.com/tx/${txHash}`}>Sent {amount} "TEST" to {to}</a></ListItem>
                    ))}
                </List>
            </div>

        </div>
    );
    return (
        <div>
            {pageState === PageState.send ? <Sending /> : <Loading />}
        </div>
    );
};

function _amountStrToBigint(input: string, decimals: number): bigint {
    const [whole, fraction = ''] = input.split('.');
    const base = BigInt(whole) * (10n ** 18n);
    console.log(`whole: ${whole}, fraction: ${fraction}`);
    const exponent = BigInt(fraction) * (10n ** BigInt(18 - fraction.length));
    console.log('base:', base);
    console.log('exponent:', exponent);
    return base + exponent;
}

function _bigIntToAmountStr(input: bigint, decimals: number): string {
    const base = input.toString();
    const whole = base.slice(0, -decimals) || '0';
    const fraction = base.slice(-decimals).replace(/0+$/, '');
    if (fraction.length === 0) return whole;
    else return `${whole}.${fraction}`;
}

export default SendPage;
