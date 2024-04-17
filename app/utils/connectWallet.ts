import { ethers } from "ethers";
import {
  ConnectionErrorCode,
  ConnectWalletResponse,
} from "../interfaces/defination";

const SEPOLIA_NETWORK_ID = 11155111;
export const connectWallet = async (): Promise<ConnectWalletResponse> => {
  try {
    // Check if MetaMask is installed
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Check the network
      const network = await provider.getNetwork();

      // If the user is not on the Sepolia network, prompt them to switch
      if (network.chainId !== SEPOLIA_NETWORK_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexlify(SEPOLIA_NETWORK_ID) }],
          });
        } catch (switchError: any) {
          if (switchError.code === ConnectionErrorCode.USER_REJECTED_REQUEST) {
            // User rejected the request to switch networks. Exit the function.
            return {
              success: false,
              message: "User rejected the request to switch networks",
              address: null,
            };
          }

          if (switchError.code === ConnectionErrorCode.CHAIN_NOT_ADDED) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: ethers.utils.hexlify(SEPOLIA_NETWORK_ID),
                    rpcUrl: "https://rpc.sepolia.org/",
                  },
                ],
              });
            } catch (addError: any) {
              // If adding the network fails

              return {
                success: false,
                message: "Error adding the Sepolia chain",
                address: null,
              };
            }
          } else {
            return {
              success: false,
              message: "Error switching to the Sepolia network",
              address: null,
            };
          }
        }
      }

      // get accounts after successfully switching the network
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      return {
        success: true,
        message: "Wallet connected successfully.",
        address: address,
      };
    } else {
      return {
        success: false,
        message:
          '"Please install MetaMask to use this feature and set it to the Sepolia network!',
        address: null,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Error connecting to wallet",
      address: null,
    };
  }
};

export const checkWalletConnection = async (): Promise<string | undefined> => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const networkDetails = await provider.getNetwork();
    //check network
    if (networkDetails.chainId != SEPOLIA_NETWORK_ID) {
      return;
    }

    try {
      // Check if we can get accounts without triggering a connection request
      const [account] = await provider.listAccounts();

      return account;
    } catch (error) {
      console.log("here");

      console.error("Failed to check wallet connection:", error);
    }
  }
  return;
};
