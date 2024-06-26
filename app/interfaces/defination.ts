export enum ConnectionErrorCode {
  USER_REJECTED_REQUEST = 4001,
  CHAIN_NOT_ADDED = 4902,
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
}

export interface WalletContextState {
  isConnected: boolean;
  address: string;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => void;
}

export interface SwapInputProps {
  label: string;
  id: string;
  tokens: string[];
  selectedToken: string;
  onSelectToken: (token: string) => void;
  amount: number | "";
  tokenBalance: string;
  readOnly: boolean;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}
export interface TokenSelectorProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export interface TokenAddressMapping {
  [key: string]: string;
}

export interface ConnectWalletResponse {
  success: boolean;
  message: string;
  address: string | null;
}

export type TransactionStatus = "inProgress" | "completed" | "pending";

export interface TransactionModalProps {
  approveStatus: TransactionStatus;
  swapStatus: TransactionStatus;
}
