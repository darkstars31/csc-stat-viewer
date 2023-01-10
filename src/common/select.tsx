import * as React from "react";

type Props = {
    label: string,
    options: { id: number, value: string}[],
    onChange: ( e:React.FormEvent<HTMLSelectElement>) => void
}

export function Select( { label, options, onChange}: Props ){
    const [ selectedIndex, setSelectedIndex ] = React.useState( 0 );

    return (
            <div>
                <legend className="block text-sm font-medium text-gray-400">
                {label}
                </legend>

                <div className="mt-1 -space-y-px bg-inherit rounded-md shadow-sm">
                <div>
                    <label htmlFor={label.toLowerCase()} className="sr-only">{label}</label>

                    <select
                        id={label.toLowerCase()}
                        className="relative w-full bg-inherit border-gray-200 rounded-md focus:z-10 sm:text-sm"
                        onChange={( e ) => { setSelectedIndex(Number(e.currentTarget.value)); onChange(e)}}
                        value={selectedIndex}
                        >
                        {
                            options.map( (option) => <option key={option.id} value={option.id}>{option.value}</option>)
                        }
                    </select>
                </div>
            </div>
        </div>
    );
}