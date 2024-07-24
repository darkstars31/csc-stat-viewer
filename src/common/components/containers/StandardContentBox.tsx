import React from "react";

export function StandardContentBox({ children }: { children: React.ReactNode }) {
	return (
		<section className="place-content-center flex lg:flex-row flex-col flex-wrap p-1 min-w-full min-h-[225px] h-fill bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
			{children}
		</section>
	);
}
