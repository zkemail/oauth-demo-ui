import React, { useEffect, useState } from "react";
import { OauthClientCache, PageState, useAppState } from "../StateContext";
import { Address, encodeFunctionData, getAddress } from "viem";
import { erc20Abi } from "viem";
import CircularProgress from "@mui/joy/CircularProgress";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import { Button, Grid, Typography } from "@mui/joy";
import { styles } from "./styles";

const SendPage: React.FC = () => {
  const {
    oauthClient,
    setOauthClient,
    pageState,
    setPageState,
    requestId,
    setRequestId,
    userEmailAddr,
    username,
  } = useAppState();
  const [amountStr, setAmountStr] = useState<string>("");
  const [amount, setAmount] = useState<bigint>(0n);
  const [token, setToken] = useState<string>("TEST");
  const [to, setTo] = useState<string>("");
  const decimals = 18;
  const baseAmount = 10n ** BigInt(decimals);
  const [balanceOfTest, setBalanceOfTest] = useState<bigint>(0n);
  const [allowanceOfTest, setAllowanceOfTest] = useState<bigint>(
    10n * baseAmount
  );
  const [loading, setLoading] = useState<boolean>(false);
  // const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [txInfos, setTxInfos] = useState<[string, string, string][]>([]);

  const testTokenAddr = process.env.REACT_APP_TEST_TOKEN as Address | null;
  if (!testTokenAddr) {
    throw new Error("REACT_APP_TEST_TOKEN is not set");
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountStr(e.target.value);
    console.log("amountStr:", amountStr);
    setAmount(_amountStrToBigint(e.target.value, decimals));
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToken(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value);
  };

  const handleSendClick = async () => {
    setLoading(true);
    console.log("Sending", { amount, token, to });
    let toAddress;
    try {
      toAddress = getAddress(to);
    } catch (e) {
      console.log("Incorrect to address. Please check the value and retry");
      return;
    }
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress as Address, amount],
    });
    const txHash = await oauthClient?.oauthExecuteTx(
      testTokenAddr,
      data,
      0n,
      amount
    );
    console.log("txHash:", txHash);
    setTxInfos([...txInfos, [txHash, amountStr, toAddress]]);
    const newBalance = balanceOfTest - amount;
    setBalanceOfTest(newBalance);
    const newAllowance = allowanceOfTest - amount;
    setAllowanceOfTest(newAllowance);
    setLoading(false);
  };

  useEffect(() => {
    const setupBalances = async () => {
      const balance = await oauthClient?.publicClient.readContract({
        address: testTokenAddr,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [oauthClient?.userWallet?.address],
      });
      setBalanceOfTest(balance);
    };
    setupBalances();
  }, []);

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
        localStorage.setItem("oauthClient", JSON.stringify(newCache));
      }
    };
    waiting();
  }, [requestId]);

  if (pageState !== PageState.send) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        }}
      >
        <CircularProgress size="lg" style={{ stroke: "#FACC15" }} />
        <p>Loading until your sign-up/sign-in is completed.</p>
      </div>
    );
  }

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
        <Grid container spacing={0}>
          <Grid xs={12}>
            <Typography level="h4"> Wallet Information</Typography>
          </Grid>
          <Grid xs={12}>
            <Typography style={{ color: "#6B7280" }} level="body-md">
              Wallet address:{" "}
              {`${oauthClient?.userWallet?.address}` ?? "Not available"}
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography style={{ color: "#6B7280" }} level="body-md">
              Balance: {_bigIntToAmountStr(balanceOfTest, decimals)} TEST
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography style={{ color: "#6B7280" }} level="body-md">
              Remaining Allowance:{" "}
              {_bigIntToAmountStr(allowanceOfTest, decimals)} TEST
            </Typography>
          </Grid>
        </Grid>
        <Grid xs={12} container spacing={2}>
          <Grid xs={12}>
            <input
              type="text"
              placeholder="Enter recipient address"
              value={to}
              style={styles.input}
              onChange={handleToChange}
            />
          </Grid>
          <Grid xs={6}>
            <input
              style={styles.input}
              type="number"
              placeholder="Enter amount"
              value={amountStr}
              onChange={handleAmountChange}
            />
          </Grid>
          <Grid xs={6}>
            <select
              style={styles.input}
              value={token}
              onChange={handleTokenChange}
            >
              <option value="TEST">TEST</option>
            </select>
          </Grid>
          <Grid xs={12}>
            <Button
              loading={loading}
              fullWidth
              onClick={handleSendClick}
              style={styles.button}
            >
              Send
            </Button>
          </Grid>
        </Grid>
        {txInfos.length ? (
          <Grid container xs={12} spacing={0}>
            <Grid xs={12}>
              <Typography level="h4">Executed Transactions:</Typography>
            </Grid>

            <Grid xs={12} container spacing={0}>
              <List>
                {txInfos.map(([txHash, amount, to], index) => (
                  <Grid key={txHash} xs={12}>
                    <a
                      style={{ textDecoration: "none" }}
                      target="_blank"
                      href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
                    >
                      <ListItem key={index}>
                        <Grid
                          container
                          style={styles.transaction}
                          justifyContent={"space-between"}
                          xs={12}
                        >
                          Sent {amount} "TEST" to {to}
                          <img src="./launchIcon.svg" />
                        </Grid>
                      </ListItem>
                    </a>
                  </Grid>
                ))}
              </List>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

function _amountStrToBigint(input: string, decimals: number): bigint {
  const [whole, fraction = ""] = input.split(".");
  const base = BigInt(whole) * 10n ** 18n;
  console.log(`whole: ${whole}, fraction: ${fraction}`);
  const exponent = BigInt(fraction) * 10n ** BigInt(18 - fraction.length);
  console.log("base:", base);
  console.log("exponent:", exponent);
  return base + exponent;
}

function _bigIntToAmountStr(input: bigint, decimals: number): string {
  const base = input.toString();
  const whole = base.slice(0, -decimals) || "0";
  const fraction = base.slice(-decimals).replace(/0+$/, "");
  if (fraction.length === 0) return whole;
  else return `${whole}.${fraction}`;
}

export default SendPage;
