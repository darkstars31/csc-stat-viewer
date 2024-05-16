import * as React from "react";

export function Card( { children }: { children?: React.ReactNode | React.ReactNode[] } ) {
	return (
        <div className="bg-midnight2 mb-2 flex flex-col rounded-lg border border-gray-100 p-3 dark:border-gray-800">
          {children}
        </div>
    );
}