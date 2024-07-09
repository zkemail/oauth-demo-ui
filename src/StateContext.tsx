import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import OauthClient from "@zk-email/ts-sdk/dist/oauthClient";
import { Address, GetContractReturnType, PrivateKeyAccount, PublicClient, createPublicClient, WalletClient, getContract, encodePacked, http, } from 'viem'
import { baseSepolia, mainnet, base } from "viem/chains";

type StateContextType = {
    userEmailAddr: string,
    setUserEmailAddr: (userEmailAddr: string) => void,
    username: string,
    setUsername: (username: string) => void,
    isFilled: boolean,
    setIsFilled: (isFilled: boolean) => void,
    oauthClient: OauthClient<typeof baseSepolia>,
    setOauthClient: (oauthClient: OauthClient<typeof baseSepolia>) => void,
    requestId: number | null,
    setRequestId: (requestId: number) => void,
    isActivated: boolean,
    setIsActivated: (isActivated: boolean) => void,
};

const StateContext = createContext<StateContextType | undefined>(undefined);
export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const coreAddress = process.env.REACT_APP_CORE_ADDRESS || '';
    const oauthAddress = process.env.REACT_APP_OAUTH_ADDRESS || '';
    const relayerHost = process.env.REACT_APP_RELAYER_HOST || '';
    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
    });
    const [userEmailAddr, setUserEmailAddr] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [isFilled, setIsFilled] = useState<boolean>(false);
    const [oauthClient, setOauthClient] = useState<OauthClient<typeof baseSepolia>>(new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost));
    const [requestId, setRequestId] = useState<number | null>(null);
    const [isActivated, setIsActivated] = useState<boolean>(false);


    useEffect(() => {
        const setup = async () => {
            if (!isFilled) {
                return;
            }
            const requestId = await oauthClient?.setup(userEmailAddr, username, null, [[10, "TEST"]]);
            setOauthClient(oauthClient);
            setRequestId(requestId);
            setIsFilled(false);
        };
        setup();
    }, [isFilled, userEmailAddr, username]);


    useEffect(() => {
        const waiting = async () => {
            if (requestId !== null) {
                console.log(requestId);
                await oauthClient?.waitEpheAddrActivated(requestId);
                setOauthClient(oauthClient);
                setIsActivated(true);
                setRequestId(null);
            }
        };
        waiting();
    }, [requestId]);

    return (
        <StateContext.Provider value={{ userEmailAddr, setUserEmailAddr, username, setUsername, isFilled, setIsFilled, oauthClient, setOauthClient, requestId, setRequestId, isActivated, setIsActivated }}>
            {children}
        </StateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useAppState must be used within a StateProvider');
    }
    return context;
};