import { ethers } from "ethers";
import TokenAbi from "../contracts/ERC20Token";
import SwapAbi from "../contracts/Swap";

const swapContractAddress = "0x96E82c9F7D3A77572Ac3D134bBDd618865251397";

export const approveToken = async (
  signer: ethers.Signer,
  tokenAddress: string,
  amount: ethers.BigNumber
): Promise<string> => {
  // Create an instance of the token contract
  const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, signer);
  const txResponse = await tokenContract.approve(swapContractAddress, amount);
  await txResponse.wait();
  return txResponse.hash;
};

export const swapTokens = async (
  signer: ethers.Signer,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: ethers.BigNumber
): Promise<string> => {
  // Create an instance of the swap contract
  const swapContract = new ethers.Contract(
    swapContractAddress,
    SwapAbi,
    signer
  );

  const swapTxResponse = await swapContract.swapTokens(
    fromTokenAddress,
    toTokenAddress,
    amount
  );

  await swapTxResponse.wait();
  return swapTxResponse.hash;
};

export const getFormattedTokenAmount = async (
  tokenAddress: string,
  amount: number
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, provider);
  const decimals = await tokenContract.decimals();
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

export const fetchReceiveAmount = async (
  payTokenAddress: string,
  receiveTokenAddress: string,
  tokenAmountForSwap: number
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const swapContract = new ethers.Contract(
    swapContractAddress,
    SwapAbi,
    provider
  );

  const formattedAmountForSwap = ethers.utils.parseUnits(
    tokenAmountForSwap.toString(),
    9
  );

  const amountOut = await swapContract.getAmountsOut(
    payTokenAddress,
    receiveTokenAddress,
    formattedAmountForSwap
  );

  const formattedAmountOut = ethers.utils.formatUnits(amountOut, 9);

  return Number(formattedAmountOut).toPrecision(6);
};

// Fetch balance function
export const fetchTokenBalance = async (
  tokenAddress: string,
  walletAddress: string
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, provider);
  const balance = await tokenContract.balanceOf(walletAddress);
  const decimals = await tokenContract.decimals();
  const formattedBalance = ethers.utils.formatUnits(balance, decimals);
  return Number(formattedBalance).toFixed(2);
};
