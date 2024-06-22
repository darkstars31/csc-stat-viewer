import * as React from "react";



export function Toggle( { checked, onChange }: { checked: boolean, onChange: (checked: boolean ) => void } ) {
    return (
        <label className="h-6 relative inline-block">
            <input
            id="toggle"
            className="w-11 h-0 cursor-pointer inline-block focus:outline-0 dark:focus:outline-0 border-0 dark:border-0 focus:ring-offset-transparent dark:focus:ring-offset-transparent focus:ring-transparent dark:focus:ring-transparent focus-within:ring-0 dark:focus-within:ring-0 focus:shadow-none dark:focus:shadow-none after:absolute before:absolute after:top-0 before:top-0 after:block before:inline-block before:rounded-full after:rounded-full after:content-[''] after:w-5 after:h-5 after:mt-0.5 after:ml-0.5 after:shadow-md after:duration-100 before:content-[''] before:w-10 before:h-full before:shadow-[inset_0_0_#000] after:bg-white dark:after:bg-gray-50 before:bg-gray-300 dark:before:bg-gray-600 before:checked:bg-lime-500 dark:before:checked:bg-lime-500 checked:after:duration-300 checked:after:translate-x-4 disabled:after:bg-opacity-75 disabled:cursor-not-allowed disabled:checked:before:bg-opacity-40"
            type="checkbox" 
            checked={checked} 
            onChange={e => onChange(e.target.checked)} />
        </label>
    )
}