"use client";
import { useState } from "react";
import { useWallet } from "../WalletContext";
import SwapInput from "./SwapInput";
import Button from "./Button";
const tokens = ["OBOT", "WETH", "MYTOKENA", "MYTOKENB", "DZAP"];

// SwapContainer.jsx
const SwapContainer = () => {
  const { isConnected, address, handleConnect } = useWallet();
  const [payToken, setPayToken] = useState("OBOT");
  const [receiveToken, setReceiveToken] = useState("ETH");
  const [payAmount, setPayAmount] = useState<number | "">("");
  const [receiveAmount, setReceiveAmount] = useState<number | "">("");

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (e.target.id === "pay") {
      setPayAmount(parsed);
    } else {
      setReceiveAmount(parsed);
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
        handleAmountChange={handleAmountChange}
      />
      <SwapInput
        label="You receive"
        id="receive"
        tokens={tokens.filter((token) => token !== payToken)}
        selectedToken={receiveToken}
        onSelectToken={setReceiveToken}
        amount={receiveAmount}
        handleAmountChange={handleAmountChange}
      />
      <div className="swap-details text-sm my-4">
        <p>1 ETH = 68,715.70 OBOT ($3,029.43)</p>
        <p>Transaction fee: $5.23</p>
      </div>
      {isConnected ? (
        <Button label="Swap" onClick={() => {}} />
      ) : (
        <Button label="Connect Wallet" onClick={handleConnect} />
      )}
    </div>
  );
};

export default SwapContainer;
