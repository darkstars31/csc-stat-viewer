import React from "react";

type Props = {
	children: React.ReactNode | React.ReactNode[];
	onClick: () => void;
};

export function SelectedChartButton({ children, onClick }: Props) {
	return (
		<button onClick={onClick} className="bg-midnight1 text-white border border-blue-500 px-4 py-2 mx-1 rounded-lg">
			{children}
		</button>
	);
}
