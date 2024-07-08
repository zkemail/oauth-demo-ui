import React, { createContext, useContext, useState, ReactNode } from 'react';
import OauthClient from "@zk-email/ts-sdk/src/oauthClient";
import { Address, GetContractReturnType, PrivateKeyAccount, PublicClient, createPublicClient, WalletClient, getContract, encodePacked, http, } from 'viem'
import { baseSepolia } from "viem/chains";

type StateContextType = {
    // oauthClient: OauthClient | null,
};

const StateContext = createContext<StateContextType | undefined>(undefined);
export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const coreAddress = process.env.REACT_APP_CORE_ADDRESS || '';
    const oauthAddress = process.env.REACT_APP_OAUTH_ADDRESS || '';
    const relayerHost = process.env.REACT_APP_OAUTH_ADDRESS || '';
    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
    });
    const oauthClient = new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost);


    return (
        <StateContext.Provider value={{}}>
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