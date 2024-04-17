"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { WalletContextState } from "../interfaces/defination";
import { checkWalletConnection, connectWallet } from "../utils/connectWallet";

// Create the context with a default value
const WalletContext = createContext<WalletContextState>({
  isConnected: false,
  address: "",
  handleConnect: async () => {},
  handleDisconnect: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const initializeConnection = async () => {
      const currentAddress = await checkWalletConnection();
      if (currentAddress) {
        setIsConnected(true);
        setAddress(currentAddress);
      } else {
        setIsConnected(false);
        setAddress("");
      }
    };

    initializeConnection();
  }, []);
  const handleConnect = async () => {
    const result = await connectWallet();
    if (result.success) {
      setIsConnected(true);
      setAddress(result.address as string);
      toast.success(`${result.message} `, {
        position: "top-right",
      });
    } else {
      setIsConnected(false);
      setAddress("");
      toast.error(`${result.message} `, {
        position: "top-right",
      });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
  };

  return (
    <WalletContext.Provider
      value={{ isConnected, address, handleConnect, handleDisconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextState => useContext(WalletContext);
