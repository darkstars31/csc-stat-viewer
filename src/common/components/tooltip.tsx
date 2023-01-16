import * as React from "react";

/**
 * data-tooltip-target="{id}"
 * data-tooltip-placement="top|right|bottom|left"
 */

type Props = {
    title?: string,
    content?: string | React.ReactNode,
    children?: React.ReactNode | React.ReactNode[]
}

export function Tooltip( {title, content, children }: Props ){
    return (
      <div data-popover id="popover-default" role="tooltip" className="absolute z-10 invisible inline-block w-64 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
          { title && <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div> }
          { content && <div className="px-3 py-2">
              <div>{content}</div>
          </div> }
          { children }
          <div data-popper-arrow></div>
      </div>
      //   <span className="group relative">
      //   <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-white opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100">
      //     {content}
      //   </span>
  
      //   {children}
      // </span>
    );
    // return (
    //     <div id={id} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
    //         {content}
    //         <div className="tooltip-arrow" data-popper-arrow></div>
    //     </div>
    // );
}