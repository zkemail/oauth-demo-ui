import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAppState } from '../StateContext';
import { Outlet, Link, useNavigate } from "react-router-dom";

const WaitingPage: React.FC = () => {
    const { userEmailAddr, setUserEmailAddr, username, setUsername, isFilled, setIsFilled, oauthClient, setOauthClient, requestId, setRequestId, isActivated, setIsActivated } = useAppState();
    console.log('oauthClient:', oauthClient);
    console.log('requestId:', requestId);
    const navigate = useNavigate();

    useEffect(() => {
        if (isActivated) {
            navigate('/send');
        }
    }, [isActivated]);
    // await oauthClient?.waitEpheAddrActivated();
    return (
        <div>
            <h1>Waiting Page</h1>
            <p>Please wait...</p>
        </div>
    );
};

export default WaitingPage;