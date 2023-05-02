import * as React from "react";

type Props = {
    rows: Record<string,string | number | null | undefined>[]
}

export function Table( { rows }: Props ){
    return (
        <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                <tr>
                    { Object.keys(rows[0]).map( row =>
                        <th key={row} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700 bg-slate-400">
                            {row}
                        </th>
                    )}
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                { rows.map( (row,index) => 
                    <tr key={index}>
                    { Object.entries(row).map( ([key,value]) =>
                        <td key={key+value} className="whitespace-nowrap px-4 py-2 font-medium text-gray-200">
                            {value ?? "n/a"}
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