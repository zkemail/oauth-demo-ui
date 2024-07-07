// src/LandingPage.tsx
import React, { useState, CSSProperties } from 'react';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNextClick = () => {
    // Handle the logic for the next step here
    alert(`Next button clicked with email: ${email}`);
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
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome</h1>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={handleEmailChange}
        style={styles.input}
      />
      <button onClick={handleNextClick} style={styles.button}>
        Next
      </button>
    </div>
  );
};

export default LandingPage;