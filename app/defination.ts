export enum ConnectionErrorCode {
  USER_REJECTED_REQUEST = 4001,
  //   UNAUTHORIZED = 4100,
  //   UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,

  CHAIN_NOT_ADDED = 4902,
  MM_ALREADY_PENDING = -32002,
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
  [key: string]: string; // This indicates that it can be indexed with any string
}
