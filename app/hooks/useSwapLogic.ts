import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import {
  approveToken,
  fetchReceiveAmount,
  fetchTokenBalance,
  getFormattedTokenAmount,
  swapTokens,
} from "../services/contractFunctions";
import {
  TokenAddressMapping,
  TransactionStatus,
} from "../interfaces/defination";
import { checkWalletConnection } from "../utils/connectWallet";
import { useWallet } from "../provider/WalletProvider";

const useSwapLogic = (
  tokens: string[],
  tokenAddressMapping: TokenAddressMapping
) => {
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
  }, [isConnected, payToken, receiveToken, address, tokenAddressMapping]);

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
  }, [isConnected, payToken, receiveToken, tokenAddressMapping]);

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

  return {
    payToken,
    receiveToken,
    payAmount,
    receiveAmount,
    payTokenBalance,
    receiveTokenBalance,
    equivalentAmount,
    isModalOpen,
    approveStatus,
    swapStatus,
    handleAmountChange,
    handleSwapClick,
    setPayToken,
    setReceiveToken,
    setIsModalOpen,
    setPayAmount,
    setReceiveAmount,
  };
};

export default useSwapLogic;
