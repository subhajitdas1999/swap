import { TokenSelectorProps } from "../defination";

const TokenSelector: React.FC<TokenSelectorProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="absolute right-3 top-3">
      <select
        className="bg-green-800 p-2 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
export default TokenSelector;
