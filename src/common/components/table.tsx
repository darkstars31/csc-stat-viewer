import * as React from "react";

type Props = {
    rows: Record<string,string | number | null | undefined>[]
}

export function Table( { rows }: Props ){
    return (
        <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                    { Object.keys(rows[0]).map( row =>
                        <th key={row} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                            {row}
                        </th>
                    )}
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                { rows.map( (row,index) => 
                    <tr key={index}>
                    { Object.entries(row).map( ([key,value]) =>
                        <td key={key+value} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
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