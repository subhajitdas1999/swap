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
  MyTokenA: "0xbf71abAF248b635048289528c7F901BA6080D982",
  MyTokenB: "0xaCF19e2B7BD57cFfaDdC3F6d61B8021862e156f6",
  MyTokenC: "0x41F4Ebb8C57895e2BeEB539f0d7bb75945132C0c",
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

  // approve
  const handleApprove = async (
    signer: ethers.Signer,
    fromTokenAddress: string,
    formattedAmount: ethers.BigNumber
  ) => {
    try {
      setApproveStatus("inProgress");
      const approveHash = await approveToken(
        signer,
        fromTokenAddress,
        formattedAmount
      );
      setApproveStatus("completed");
      showToast(`Token approval successful \n ${approveHash}`, "success");
    } catch (error: any) {
      handleTransactionError(error);
    }
  };

  // token swap
  const handleSwap = async (
    signer: ethers.Signer,
    fromTokenAddress: string,
    toTokenAddress: string,
    formattedAmount: ethers.BigNumber
  ) => {
    try {
      setSwapStatus("inProgress");
      const swapHash = await swapTokens(
        signer,
        fromTokenAddress,
        toTokenAddress,
        formattedAmount
      );
      setSwapStatus("completed");
      showToast(`Token swap successful \n ${swapHash}`, "success");
    } catch (error: any) {
      handleTransactionError(error);
    }
  };

  // toast notifications
  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message, { position: "top-right" });
    } else {
      toast.error(message, { position: "top-right" });
    }
  };

  // transaction errors
  const handleTransactionError = (error: any) => {
    if (error.code === "ACTION_REJECTED") {
      showToast(`${error.reason}`, "error");
    } else {
      showToast(`Transaction unsuccessful`, "error");
    }
  };

  const resetTransactionStates = () => {
    setPayAmount("");
    setReceiveAmount("");
    setIsModalOpen(false);
    setApproveStatus("pending");
    setSwapStatus("pending");
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

      //formatting
      const formattedAmount = await getFormattedTokenAmount(
        tokenAddressMapping[payToken],
        payAmount as number
      );
      await handleApprove(
        signer,
        tokenAddressMapping[payToken],
        formattedAmount
      );
      await handleSwap(
        signer,
        tokenAddressMapping[payToken],
        tokenAddressMapping[receiveToken],
        formattedAmount
      );
    } catch (error: any) {
      console.log(error);
    }
    resetTransactionStates();
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
