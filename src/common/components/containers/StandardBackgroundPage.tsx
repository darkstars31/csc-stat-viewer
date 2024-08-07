import React from "react";

export function StandardBackgroundPage({ children, classNames }: { children: React.ReactNode; classNames?: string }) {
	const className =
		"bg-midnight2 mb-2 flex flex-col rounded-lg border border-gray-100 p-4 dark:border-gray-800 ".concat(
			classNames ?? "",
		);
	return <section className={className}>{children}</section>;
}
