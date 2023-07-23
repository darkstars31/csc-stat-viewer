import React from "react";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  onClick: () => void;
};

export function UnselectedChartButton({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-midnight2 text-blue-500 border border-gray-700 px-4 py-1 mx-1 rounded-lg"
    >
      {children}
    </button>
  );
}
