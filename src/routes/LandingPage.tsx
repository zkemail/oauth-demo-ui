// src/LandingPage.tsx
import React, { useState, CSSProperties, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAppState, PageState } from "../StateContext";
import { Button, Grid, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { styles } from "./styles";

const LandingPage: React.FC = () => {
  // const [email, setEmail] = useState<string>('');
  // const [username, setUsername] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<
    "signup" | "signin" | null
  >(`signup`);
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const {
    userEmailAddr,
    setUserEmailAddr,
    username,
    setUsername,
    pageState,
    setPageState,
    oauthClient,
    setOauthClient,
    requestId,
    setRequestId,
  } = useAppState();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmailAddr(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleOptionClick = (option: "signup" | "signin") => {
    setSelectedOption(option);
  };

  useEffect(() => {
    setSelectedOption("signup");
    setUserEmailAddr("");
    setUsername("");
  }, []);

  const handleNextClick = () => {
    setIsFilled(true);
    setPageState(PageState.waiting);
    // navigate('/send');
    // const requestId = await oauthClient?.setup(email, username, null, null);
    // if (requestId != null) {
    //   setRequestId(requestId);
    // }
  };

  useEffect(() => {
    const setup = async () => {
      if (!isFilled) {
        return;
      }
      console.log(userEmailAddr, username, null, [[10, "TEST"]]);
      const requestId = await oauthClient?.setup(
        userEmailAddr,
        username,
        null,
        [[10, "TEST"]]
      );
      setOauthClient(oauthClient);
      setRequestId(requestId);
      setIsFilled(false);
    };
    setup();
  }, [isFilled, userEmailAddr, username]);

  useEffect(() => {
    if (pageState === PageState.waiting || pageState === PageState.send) {
      navigate("/send");
    }
  }, [pageState]);

  const isFormValid = () => {
    if (selectedOption === "signup") {
      return userEmailAddr !== "" && username !== "";
    } else {
      return userEmailAddr !== "";
    }
  };

  // const styles: { [key: string]: CSSProperties } = {
  //   container: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     height: '100vh',
  //     backgroundColor: '#f0f0f0',
  //   },
  //   title: {
  //     marginBottom: '20px',
  //   },
  //   input: {
  //     padding: '10px',
  //     fontSize: '16px',
  //     marginBottom: '10px',
  //     borderRadius: '5px',
  //     border: '1px solid #ccc',
  //   },
  //   button: {
  //     padding: '10px 20px',
  //     fontSize: '16px',
  //     borderRadius: '5px',
  //     border: 'none',
  //     backgroundColor: '#007bff',
  //     color: '#fff',
  //     cursor: 'pointer',
  //     margin: '5px',

  //   },
  //   inactiveButton: {
  //     backgroundColor: '#cccccc',
  //   },
  //   disabledButton: {
  //     backgroundColor: '#cccccc',
  //     cursor: 'not-allowed',
  //   },
  //   link: {
  //     color: '#fff',
  //     textDecoration: 'none',
  //   },
  // };

  return (
    <Grid
      container
      style={{ background: "#F3F4F6", height: "100vh", width: "100vw" }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Grid
        container
        spacing={4}
        style={{
          width: "900px",
          maxWidth: "90vw",
          height: "500px",
          overflowY: "auto",
          maxHeight: "50vh",
          border: "1px solid #E4E4E7",
          borderRadius: 8,
          background: "white",
          padding: "1rem",
        }}
      >
        <Grid xs={12}>
          <Typography textAlign={"center"} level="h2">
            Email Oauth Demo
          </Typography>
        </Grid>
        <Grid container xs={12}>
          <Grid xs={12}>
            <Tabs
              defaultValue={"signup"}
              onChange={(event, value) =>
                setSelectedOption(value as "signup" | "signin" | null)
              }
            >
              <TabList tabFlex={1}>
                <Tab value="signup">Sign-up</Tab>
                <Tab value="signin">Sign-in</Tab>
              </TabList>
            </Tabs>
          </Grid>
          {/* <Grid xs={6}>
            <Button
              style={styles.button}
              fullWidth
              onClick={() => handleOptionClick("signup")}
              disabled={selectedOption === "signup"}
            >
              Sign-up
            </Button>
          </Grid>
          <Grid xs={6}>
            <Button
              style={styles.button}
              fullWidth
              onClick={() => handleOptionClick("signin")}
              disabled={selectedOption === "signin"}
            >
              Sign-in
            </Button>
          </Grid> */}
        </Grid>
        <Grid container spacing={0} xs={12}>
          <Grid xs={12}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={userEmailAddr}
              onChange={handleEmailChange}
              style={styles.input}
            />
          </Grid>
          <Grid xs={12}>
            {selectedOption === "signup" && (
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                style={styles.input}
              />
            )}
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Button
            onClick={handleNextClick}
            style={styles.button}
            fullWidth
            disabled={!isFormValid()}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
