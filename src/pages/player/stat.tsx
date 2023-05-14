import * as React from "react";

export function Stat( { title, value, children }: { title?:string, value?: string|number, children?: React.ReactNode | React.ReactNode[] } ) {
    if(!title && !value && !children ){
		return null;
	}
	return (
        <div className="bg-midnight2 mb-2 flex flex-col rounded-lg border border-gray-100 p-4 dark:border-gray-800">
          { title && <dt className="order-last text-s font-medium text-gray-500 dark:text-gray-400">
            {title}
          </dt> }
          { value && <dd className="text-l font-extrabold text-blue-600 md:text-2xl">
            {value}
          </dd> }
          <div> {children} </div>
        </div>
    );
}