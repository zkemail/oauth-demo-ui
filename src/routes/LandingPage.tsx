// src/LandingPage.tsx
import React, { useState, CSSProperties } from 'react';
import { Outlet, Link } from "react-router-dom";
import { useAppState } from '../StateContext';
import OauthClient from "@zk-email/ts-sdk/src/oauthClient";
import { Address, GetContractReturnType, PrivateKeyAccount, PublicClient, WalletClient, getContract, encodePacked } from 'viem'

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<'signup' | 'signin' | null>(`signup`);
  const { oauthClient } = useAppState();





  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleOptionClick = (option: 'signup' | 'signin') => {
    setSelectedOption(option);
  };

  const isFormValid = () => {
    if (selectedOption === 'signup') {
      return email !== '' && username !== '';
    } else {
      return email !== '';
    }
  };


  const styles: { [key: string]: CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    title: {
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      marginBottom: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      margin: '5px',

    },
    inactiveButton: {
      backgroundColor: '#cccccc',
    },
    disabledButton: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Email Oauth Demo</h1>
      <div>
        <button
          onClick={() => handleOptionClick('signup')}
          style={{
            ...styles.button,
            ...(selectedOption === 'signin' ? styles.inactiveButton : {}),
          }}
          disabled={selectedOption === 'signup'}
        >
          Sign-up
        </button>
        <button
          onClick={() => handleOptionClick('signin')}
          style={{
            ...styles.button,
            ...(selectedOption === 'signup' ? styles.inactiveButton : {}),
          }}
          disabled={selectedOption === 'signin'}
        >
          Sign-in
        </button>
      </div>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={handleEmailChange}
        style={styles.input}
      />
      {selectedOption === 'signup' && (
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          style={styles.input}
        />
      )}
      <button
        style={{
          ...styles.button,
          ...(isFormValid() ? {} : styles.disabledButton),
        }}
        disabled={!isFormValid()}
      >
        {isFormValid() ? (
          <Link to={`waiting`} style={styles.link}>Next</Link>
        ) : (
          <span style={styles.link}>Next</span>
        )}
      </button>
    </div >
  );
};

export default LandingPage;