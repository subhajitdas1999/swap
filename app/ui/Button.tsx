import { ButtonProps } from "../defination";

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-green-700 hover:bg-green-800 py-3 px-4 rounded-xl my-4 transition-colors duration-200"
    >
      {label}
    </button>
  );
};
export default Button;
