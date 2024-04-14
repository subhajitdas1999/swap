"use client";
import { useState } from "react";
import { useWallet } from "../WalletContext";

const truncateAddress = (fullAddress: string) => {
  return `${fullAddress.slice(0, 5)}...${fullAddress.slice(-4)}`;
};

const Header = () => {
  const { isConnected, address, handleConnect, handleDisconnect } = useWallet();

  return (
    <div className="flex justify-between items-center p-4 bg-black ">
      <h1 className="text-xl ">Dzap</h1>
      {isConnected ? (
        <button
          onClick={handleDisconnect}
          className=" bg-gray-800  px-4 py-2 rounded-full cursor-pointer hover:bg-gray-500"
        >
          <span>{truncateAddress(address)}</span>
        </button>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-green-200 text-green-600 font-bold py-2 px-4 rounded-full shadow-lg transition-all hover:bg-green-300"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default Header;
