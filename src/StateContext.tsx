import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { OauthClient } from "@zk-email/oauth-sdk";
import { Address, GetContractReturnType, PrivateKeyAccount, PublicClient, createPublicClient, WalletClient, getContract, encodePacked, http, } from 'viem'
import { baseSepolia, mainnet, base } from "viem/chains";

type StateContextType = {
    userEmailAddr: string,
    setUserEmailAddr: (userEmailAddr: string) => void,
    username: string,
    setUsername: (username: string) => void,
    oauthClient: OauthClient<typeof baseSepolia>,
    setOauthClient: (oauthClient: OauthClient<typeof baseSepolia>) => void,
    requestId: number | null,
    setRequestId: (requestId: number | null) => void,
    pageState: PageState,
    setPageState: (pageState: PageState) => void,
};

export type OauthClientCache = {
    userEmailAddr: string,
    username: string,
    userWalletAddr: Address,
    ephePrivateKey: `0x${string}`,
    epheAddrNonce: string,
}

export enum PageState {
    landing = 0,
    waiting = 1,
    send = 2,

}

const StateContext = createContext<StateContextType | undefined>(undefined);
export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const coreAddress = process.env.REACT_APP_CORE_ADDRESS || '';
    const oauthAddress = process.env.REACT_APP_OAUTH_ADDRESS || '';
    const relayerHost = process.env.REACT_APP_RELAYER_HOST || '';
    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
    });
    const cachedOauthClientStr = localStorage.getItem('oauthClient');
    const cachedOauthClient: OauthClientCache | null = cachedOauthClientStr ? JSON.parse(cachedOauthClientStr) as OauthClientCache : null;
    console.log(cachedOauthClient);
    const [userEmailAddr, setUserEmailAddr] = useState<string>(cachedOauthClient !== null ? cachedOauthClient.userEmailAddr : '');
    const [username, setUsername] = useState<string>(cachedOauthClient !== null ? cachedOauthClient.username : '');
    // const [isFilled, setIsFilled] = useState<boolean>(false);
    const oauthClientInit = cachedOauthClient !== null ? new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost, cachedOauthClient.userEmailAddr, cachedOauthClient.userWalletAddr, cachedOauthClient.ephePrivateKey, cachedOauthClient.epheAddrNonce) : new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost);
    const [oauthClient, setOauthClient] = useState<OauthClient<typeof baseSepolia>>(oauthClientInit);
    const [requestId, setRequestId] = useState<number | null>(null);
    // const [isActivated, setIsActivated] = useState<boolean>(cachedOauthClient !== null);
    const [pageState, setPageState] = useState<PageState>(cachedOauthClient !== null ? PageState.send : PageState.landing);

    // useEffect(() => {
    //     const setup = async () => {
    //         if (!isFilled) {
    //             return;
    //         }
    //         const requestId = await oauthClient?.setup(userEmailAddr, username, null, [[10, "TEST"]]);
    //         setOauthClient(oauthClient);
    //         setRequestId(requestId);
    //         setIsFilled(false);
    //     };
    //     setup();
    // }, [isFilled, userEmailAddr, username]);


    // useEffect(() => {
    //     const waiting = async () => {
    //         if (requestId !== null) {
    //             console.log(requestId);
    //             await oauthClient?.waitEpheAddrActivated(requestId);
    //             setOauthClient(oauthClient);
    //             setRequestId(null);
    //             setPageState(PageState.send);
    //             const newCache: OauthClientCache = {
    //                 userEmailAddr,
    //                 username,
    //                 userWalletAddr: oauthClient.getWalletAddress() as Address,
    //                 ephePrivateKey: oauthClient.getEphePrivateKey(),
    //                 epheAddrNonce: oauthClient.getEpheAddrNonce() as string,
    //             };
    //             localStorage.setItem('oauthClient', JSON.stringify(newCache));
    //         }
    //     }
    //     waiting();
    // }, [requestId]);

    return (
        <StateContext.Provider value={{ userEmailAddr, setUserEmailAddr, username, setUsername, oauthClient, setOauthClient, requestId, setRequestId, pageState, setPageState }}>
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