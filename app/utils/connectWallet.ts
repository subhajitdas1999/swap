import { ethers } from "ethers";
import { ConnectionErrorCode } from "../defination";

const SEPOLIA_NETWORK_ID = "11155111";
export const connectWallet = async () => {
  try {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Request the user to enable MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Check the network
      const network = await provider.getNetwork();

      // If the user is not on the Sepolia network, prompt them to switch
      if (network.chainId !== parseInt(SEPOLIA_NETWORK_ID)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              { chainId: ethers.utils.hexlify(parseInt(SEPOLIA_NETWORK_ID)) },
            ],
          });
        } catch (switchError: any) {
          if (switchError.code === ConnectionErrorCode.USER_REJECTED_REQUEST) {
            // User rejected the request to switch networks. Exit the function.
            console.error("User rejected the request to switch networks.");
            return; // Stop further execution if the network switch is rejected
          }

          if (switchError.code === ConnectionErrorCode.CHAIN_NOT_ADDED) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: ethers.utils.hexlify(parseInt(SEPOLIA_NETWORK_ID)),
                    rpcUrl: "https://rpc.sepolia.org/", // Sepolia RPC URL
                  },
                ],
              });
            } catch (addError: any) {
              // If adding the network fails, log the error and exit
              console.error(
                `Error adding the Sepolia chain: ${addError.message}`
              );
              return; // Stop further execution if adding the network fails
            }
          } else {
            console.error(
              `Error switching to the Sepolia network: ${switchError.message}`
            );
            return; // Stop further execution if any other error occurs
          }
        }
      }

      // Request accounts after successfully switching the network
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      return address;
      // Handle the address or signer as needed
    } else {
      alert(
        "Please install MetaMask to use this feature and set it to the Sepolia network!"
      );
      return;
    }
  } catch (error: any) {
    console.error(`Error connecting to wallet: ${error.message}`);
    return;
  }
};

export const checkWalletConnection = async (): Promise<string | undefined> => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      // Check if we can get accounts without triggering a connection request
      const [account] = await provider.listAccounts();

      return account; // Return the first account if there's any
    } catch (error) {
      console.error("Failed to check wallet connection:", error);
    }
  }
  return;
};
