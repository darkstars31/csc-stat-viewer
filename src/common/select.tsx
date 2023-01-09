import * as React from "react";

type Props = {
    label: string,
    options: { id: number, value: string}[],
    onChange: ( e:React.FormEvent<HTMLSelectElement>) => void
}

export function Select( { label, options, onChange}: Props ){
    const [ selectedIndex, setSelectedIndex ] = React.useState( 0 );

    return (
        <>
            <legend className="block text-sm font-medium text-gray-700">
              {label}
            </legend>

            <div className="mt-1 -space-y-px bg-white rounded-md shadow-sm">
              <div>
                <label htmlFor={label.toLowerCase()} className="sr-only">Country</label>

                <select
                  id={label.toLowerCase()}
                  className="relative w-full border-gray-200 rounded-t-md focus:z-10 sm:text-sm"
                  onChange={( e ) => { console.info(e.currentTarget.value); setSelectedIndex(1); onChange(e)}}
                  value={options.find( option => option.id === selectedIndex)?.id}
                >
                    {
                        options.map( (option) => <option key={option.id} value={option.id}>{option.value}</option>)
                    }
                </select>
              </div>
            </div>
        </>
    );
}