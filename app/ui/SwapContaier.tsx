"use client";
import { useEffect, useState } from "react";
import { useWallet } from "../WalletContext";
import SwapInput from "./SwapInput";
import Button from "./Button";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { TokenAddressMapping, TransactionStatus } from "../defination";

import { checkWalletConnection } from "../utils/connectWallet";
import {
  approveToken,
  fetchReceiveAmount,
  fetchTokenBalance,
  getFormattedTokenAmount,
  swapTokens,
} from "../utils/contractFunctions";
import TransactionModal from "./TransactionModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approveStatus, setApproveStatus] =
    useState<TransactionStatus>("pending");
  const [swapStatus, setSwapStatus] = useState<TransactionStatus>("pending");

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
      if (isConnected) {
        const OnePayTokenToReceiveTokenAmount = await fetchReceiveAmount(
          tokenAddressMapping[payToken],
          tokenAddressMapping[receiveToken],
          1
        );
        setEquivalentAmount(OnePayTokenToReceiveTokenAmount);
      }
    })();
  }, [isConnected, payToken, receiveToken]);

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = e.target.value ? parseFloat(e.target.value) : "";
    if (e.target.id === "pay") {
      setPayAmount(parsed);
      setReceiveAmount(
        parsed === "" ? "" : parsed * parseFloat(equivalentAmount)
      );
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
      setIsModalOpen(true);
      const fromTokenAddress = tokenAddressMapping[payToken];
      const toTokenAddress = tokenAddressMapping[receiveToken];

      //formatting
      const formattedAmount = await getFormattedTokenAmount(
        fromTokenAddress,
        payAmount as number
      );
      setApproveStatus("inProgress");

      // approve the token
      const approveHash = await approveToken(
        signer,
        fromTokenAddress,
        formattedAmount
      );
      toast.success(`Token approval successful \n ${approveHash}`, {
        position: "top-right",
      });
      setApproveStatus("completed");

      setSwapStatus("inProgress");

      //perform swap
      const swapHash = await swapTokens(
        signer,
        fromTokenAddress,
        toTokenAddress,
        formattedAmount
      );
      toast.success(`Token swap successful \n ${swapHash}`, {
        position: "top-right",
      });
      setSwapStatus("completed");
    } catch (error: any) {
      if (error.code === "ACTION_REJECTED") {
        toast.error(`${error.reason} `, {
          position: "top-right",
        });
      } else {
        toast.error(`transaction unsuccessful`, {
          position: "top-right",
        });
      }
    }

    setIsModalOpen(false);
    setApproveStatus("pending");
    setSwapStatus("pending");
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
      {isModalOpen && (
        <TransactionModal
          approveStatus={approveStatus}
          swapStatus={swapStatus}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default SwapContainer;
