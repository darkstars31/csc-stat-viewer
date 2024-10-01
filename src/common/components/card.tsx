import * as React from "react";

export function Card({ children, className, style }: { children?: React.ReactNode | React.ReactNode[]; className?: string, style?: React.CSSProperties }) {
	return (
		<div
			style={style}
			className={`bg-midnight2 mb-2 flex flex-col rounded-lg border border-gray-100 p-3 dark:border-gray-800 ${className}`}
		>
			{children}
		</div>
	);
}
