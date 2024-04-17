import React from "react";
import { TransactionModalProps } from "../interfaces/defination";

const TransactionModal: React.FC<TransactionModalProps> = ({
  approveStatus,
  swapStatus,
}) => {
  const statusToColor = {
    inProgress: "bg-yellow-400",
    completed: "bg-green-400",
    pending: "bg-gray-400",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className=" bg-gray-600 text-black p-10 rounded-lg flex flex-col items-center space-y-4">
        <div
          className={`w-full p-2 text-center ${statusToColor[approveStatus]}`}
        >
          {approveStatus === "inProgress" ? "Approving..." : "Approved"}
        </div>
        <div className={`w-full p-2 text-center ${statusToColor[swapStatus]}`}>
          {swapStatus === "inProgress" ? "Swapping..." : "Swapped"}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
