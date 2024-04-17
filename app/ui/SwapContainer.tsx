"use client";

import SwapInput from "./SwapInput";
import Button from "./Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { TokenAddressMapping } from "../interfaces/defination";

import TransactionModal from "./TransactionModal";
import { useWallet } from "../provider/WalletProvider";
import useSwapLogic from "../hooks/useSwapLogic";

const tokens = ["MyTokenA", "MyTokenB", "MyTokenC"];
const tokenAddressMapping: TokenAddressMapping = {
  MyTokenA: "0xbf71abAF248b635048289528c7F901BA6080D982",
  MyTokenB: "0xaCF19e2B7BD57cFfaDdC3F6d61B8021862e156f6",
  MyTokenC: "0x41F4Ebb8C57895e2BeEB539f0d7bb75945132C0c",
};

const SwapContainer = () => {
  const { isConnected, handleConnect } = useWallet();
  const {
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
  } = useSwapLogic(tokens, tokenAddressMapping);

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
