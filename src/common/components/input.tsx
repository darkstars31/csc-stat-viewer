import * as React from "react";

type Props = {
    label: string,
    className?: string,
    type: string,
    placeHolder: string,
    value: string | number | undefined,
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
}

export function Input( { label, className, type, placeHolder, onChange, value }: Props ){
    return (
        <label
            htmlFor="textInput"
            className={"relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 ".concat(className ?? "")}
        >
            <input
                type={type}
                id="textInput"
                placeholder={placeHolder}
                onChange={onChange}
                value={value}
                className={"peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm ".concat(className ?? "")}
            />

        <span
            className={"absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs ".concat(className ?? "")}
        >
    {label}
  </span>
</label>
    );
}