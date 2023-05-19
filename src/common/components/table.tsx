import * as React from "react";

type Props = {
    header?: boolean,
    rows: Record<string, React.ReactNode | string | number | null | undefined>[]
}

export function Table( { rows, header = true }: Props ){
    return (
        <div className="overflow-hidden overflow-x-auto rounded border border-gray-600">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                { header && 
                    <thead className="bg-gray-700">
                    <tr>
                        { Object.keys(rows[0]).map( row =>
                            <th key={row} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-300 bg-slate-800">
                                {row}
                            </th>
                        )}
                    </tr>
                    </thead> 
                }

                <tbody className="divide-y divide-gray-200">
                { rows.map( (row,rowIndex) => 
                    <tr key={rowIndex} className={`text-yellow-${rowIndex}00`}>
                    { Object.entries(row).map( ([key,value], colIndex) =>
                        <td key={key+colIndex} className={`whitespace-nowrap px-4 py-2 font-medium`}>
                            <div data-row-col={`${rowIndex},${colIndex}`} className={ colIndex === 0 ? `text-white-${rowIndex+5}00` : ''}>
                                {value ?? "n/a"}
                            </div>
                        </td>
                    )}
                    </tr>
                    )
                }
                </tbody>
            </table>
        </div>

    );
}