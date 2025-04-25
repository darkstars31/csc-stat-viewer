import * as React from "react";

export type Props = {
	children: React.ReactNode;
}

export function Container( { children }: Props ) {
	return (
		<section className="overflow-auto min-h-screen mt-2">
			<div className="max-w-7xl mx-auto px-4 mb-8 sm:px-6 lg:px-8">{children}</div>
		</section>
	);
}
