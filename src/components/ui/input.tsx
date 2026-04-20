import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(function Input(
	{ className, type, ...props },
	ref,
) {
	return (
		<input
			type={type}
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-input/30 px-3 py-2 text-sm text-foreground shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});

export { Input };