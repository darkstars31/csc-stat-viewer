import * as React from "react";

/**
 * data-tooltip-target="{id}"
 * data-tooltip-placement="top|right|bottom|left"
 */

type Props = {
    content: string | React.ReactNode,
    children: React.ReactNode | React.ReactNode[]
}

export function Tooltip( {content, children }: Props ){
    return (
        <span className="group relative">
        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-white opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100">
          {content}
        </span>
  
        {children}
      </span>
    );
    // return (
    //     <div id={id} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
    //         {content}
    //         <div className="tooltip-arrow" data-popper-arrow></div>
    //     </div>
    // );
}