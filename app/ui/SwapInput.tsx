import { SwapInputProps } from "../defination";
import TokenSelector from "./TokenSelector";

const SwapInput: React.FC<SwapInputProps> = ({
  label,
  id,
  tokens,
  selectedToken,
  onSelectToken,
  amount,
  tokenBalance,
  readOnly,
  handleAmountChange,
}) => {
  return (
    <div className={`swap-input my-4 bg-gray-800 p-3 rounded-xl relative`}>
      <label htmlFor={id} className="block  text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type="number"
        id={id}
        style={{
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }}
        className="w-full bg-transparent  text-xl outline-none"
        value={amount}
        readOnly={readOnly}
        onChange={!readOnly ? handleAmountChange : undefined}
      />
      <TokenSelector
        options={tokens}
        value={selectedToken}
        onChange={onSelectToken}
      />
      <div className="absolute right-6 bottom-1">
        <span className="text-sm ">Balance: {tokenBalance}</span>
      </div>
    </div>
  );
};
export default SwapInput;
