"use client";
import { useEffect, useState } from "react";
import { useWallet } from "../WalletContext";
import SwapInput from "./SwapInput";
import Button from "./Button";
import { BigNumber, ethers } from "ethers";
import TokenAbi from "../contracts/ERC20Token";
import { TokenAddressMapping } from "../defination";
import SwapAbi from "../contracts/Swap";
import { checkWalletConnection } from "../utils/connectWallet";
import {
  approveToken,
  fetchReceiveAmount,
  fetchTokenBalance,
  getFormattedTokenAmount,
  swapTokens,
} from "../utils/contractFunctions";

const tokens = ["MyTokenA", "MyTokenB", "MyTokenC"];
const tokenAddressMapping: TokenAddressMapping = {
  MyTokenA: "0xd9a88D569bC48bB2f2a4a236B36e68cefd7EeE85",
  MyTokenB: "0xF056449423335eEC60D5a6c536a20dd6f949DAce",
  MyTokenC: "0xcf1105FaF5C7758a19Ef60F89ac0BD8696C234e6",
};

// SwapContainer.jsx
const SwapContainer = () => {
  const { isConnected, address, handleConnect } = useWallet();
  const [payToken, setPayToken] = useState(tokens[0]);
  const [receiveToken, setReceiveToken] = useState(tokens[1]);
  const [payAmount, setPayAmount] = useState<number | "">("");
  const [receiveAmount, setReceiveAmount] = useState<number | "">("");
  const [payTokenBalance, setPayTokenBalance] = useState<string>("0");
  const [receiveTokenBalance, setReceiveTokenBalance] = useState<string>("0");
  const [equivalentAmount, setEquivalentAmount] = useState<string>("0");

  useEffect(() => {
    (async () => {
      if (isConnected) {
        const payTokenBalance = await fetchTokenBalance(
          tokenAddressMapping[payToken],
          address
        );
        const receiveTokenBalance = await fetchTokenBalance(
          tokenAddressMapping[receiveToken],
          address
        );
        setPayTokenBalance(payTokenBalance);
        setReceiveTokenBalance(receiveTokenBalance);
      }
    })();
  }, [isConnected, payToken, receiveToken, address]);

  useEffect(() => {
    (async () => {
      const OnePayTokenToReceiveTokenAmount = await fetchReceiveAmount(
        tokenAddressMapping[payToken],
        tokenAddressMapping[receiveToken],
        1
      );
      setEquivalentAmount(OnePayTokenToReceiveTokenAmount);
    })();
  }, [payToken, receiveToken]);

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = e.target.value ? parseFloat(e.target.value) : "";
    if (e.target.id === "pay") {
      setPayAmount(parsed);
    } else {
      setReceiveAmount(parsed);
    }
  };

  const handleSwapClick = async () => {
    if (payAmount == "" || payAmount == 0) {
      return;
    }
    const currentAddress = await checkWalletConnection();
    if (!currentAddress) {
      await handleConnect();
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const fromTokenAddress = tokenAddressMapping[payToken];
      const toTokenAddress = tokenAddressMapping[receiveToken];

      //formatting
      const formattedAmount = await getFormattedTokenAmount(
        fromTokenAddress,
        payAmount as number
      );

      // approve the token
      await approveToken(signer, fromTokenAddress, formattedAmount);
      console.log("Token approval successful.");

      await swapTokens(
        signer,
        fromTokenAddress,
        toTokenAddress,
        formattedAmount
      );
      console.log("Token swap successful.");

      // Further actions after approval can proceed here
    } catch (error) {
      console.error("Error during token approval:", error);
    }
  };

  return (
    <div className="swap-container max-w-2xl mx-auto mt-10 p-6 bg-black rounded-xl shadow-lg">
      <div className="tabs flex justify-between">
        <div className="bg-gray-500 py-2 px-4 rounded-full shadow-md hover:bg-gray-700 cursor-pointer">
          Swap
        </div>
      </div>
      <SwapInput
        label="You pay"
        id="pay"
        tokens={tokens.filter((token) => token !== receiveToken)}
        selectedToken={payToken}
        onSelectToken={setPayToken}
        amount={payAmount}
        tokenBalance={payTokenBalance}
        readOnly={false}
        handleAmountChange={handleAmountChange}
      />
      <SwapInput
        label="You receive"
        id="receive"
        tokens={tokens.filter((token) => token !== payToken)}
        selectedToken={receiveToken}
        onSelectToken={setReceiveToken}
        amount={receiveAmount}
        tokenBalance={receiveTokenBalance}
        readOnly={true}
        handleAmountChange={handleAmountChange}
      />
      <div className="swap-details text-sm my-4">
        <p>
          1 {payToken}= {equivalentAmount} {receiveToken}
        </p>
      </div>
      {isConnected ? (
        <Button label="Swap" onClick={handleSwapClick} />
      ) : (
        <Button label="Connect Wallet" onClick={handleConnect} />
      )}
    </div>
  );
};

export default SwapContainer;
