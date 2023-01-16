import * as React from "react";

type Props = {
    label: string | number,
    color?: string,
    onClick?: () => void
}

export function Pill( { label, color, onClick }: Props) {
    const pillBgColor = color ? color : "bg-purple-100";
    return (
        <span
            className={`mx-1 inline-flex items-center justify-center rounded-full ${pillBgColor} px-2.5 py-0.5 text-purple-700`}
        >
        <p className="text-sm whitespace-nowrap">{label}</p>

            { onClick && <button
                onClick={onClick}
                className="-mr-1 ml-1.5 inline-block rounded-full bg-purple-200 p-0.5 text-purple-700 transition hover:text-purple-600"
            >
                <span className="sr-only">Remove badge</span>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-3 h-3"
                    >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
                </svg>
            </button> }
        </span>
    );
}