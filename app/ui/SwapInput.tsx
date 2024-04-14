import { SwapInputProps } from "../defination";
import TokenSelector from "./TokenSelector";

const SwapInput: React.FC<SwapInputProps> = ({
  label,
  id,
  tokens,
  selectedToken,
  onSelectToken,
  amount,
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
        onChange={handleAmountChange}
      />
      <TokenSelector
        options={tokens}
        value={selectedToken}
        onChange={onSelectToken}
      />
    </div>
  );
};
export default SwapInput;
