import * as React from "react";
import { Card } from "./card";

type Props = {
    title: string,
    header?: boolean,
    rows: Record<string, React.ReactNode | string | number | null | undefined>[]
}

export function LeaderBoard( { title, rows, header = true }: Props ){
    return (
        <Card>
            <div className="text-center text-xl uppercase font-extrabold">
                {title}
            </div>
            <div className="overflow-hidden overflow-x-auto rounded">
                <table className="table-auto min-w-full text-sm">
                    { header && 
                        <thead className="underline decoration-yellow-400">
                        <tr>
                            { Object.keys(rows[0]).map( row =>
                                <th key={row} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-300">
                                    {row}
                                </th>
                            )}
                        </tr>
                        </thead> 
                    }

                    <tbody>
                    { rows.map( (row,rowIndex) => 
                    //  <tr key={rowIndex} > className={`text-yellow-${rowIndex}00`}></tr>
                        <tr className={`${rowIndex % 2 === 0 ? "bg-midnight1" : "bg-midnight2"} rounded`}>
                        { Object.entries(row).map( ([key,value], colIndex) =>
                            <td key={key+colIndex} className={`whitespace-nowrap px-4 py-1 font-medium`}>
                                { rowIndex === 0 ?
                                    <div data-row-col={`${rowIndex},${colIndex}`} className={ colIndex === 0 ? `text-white-${rowIndex+1}00` : ''}>
                                    {value ?? "n/a"}
                                    </div>
                                :
                                    <div data-row-col={`${rowIndex},${colIndex}`} className={ colIndex === 0 ? `text-white-${rowIndex+1}00` : ''}>
                                        {value ?? "n/a"}
                                    </div>
                                }
                            </td>
                        )}
                        </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </Card>

    );
}