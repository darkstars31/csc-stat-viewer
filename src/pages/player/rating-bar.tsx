import { ToolTip } from "../../common/utils/tooltip-utils";
import * as React from "react";

interface RatingBarProps {
    label: string;
    message?: string;
    stat1: number;
    stat2: number;
    range?: number;
    average?: number;
    color: string;
}

export function RatingBar({
                              label,
                              message,
                              stat1,
                              stat2,
                              range,
                              average,
                              color,
                          }: RatingBarProps) {
    const width = ((stat1 / 2) * 100).toFixed(0).toString().concat("%");

    return (
        <div className="relative">
            {label}
            {
                !range? (
                    <div className="float-right text-sm inline-block">{stat1}</div>
                ):<></>
            }
            {message && (
                <ToolTip
                    message={message}
                    stat1={stat1}
                    stat2={stat2}
                    range={range}
                    type="icon"
                />
            )}
            <div className="h-1 bg-midnight2 rounded-lg">
                <div
                    className={`h-1 bg-gradient-to-l from-${color}-500 to-${color}-900 via-${color}-600 rounded-lg`}
                    style={{ width }}
                />
            </div>
            {average && (
                <ToolTip
                    message={`Tier Average: ${average}`}
                    pos={`${(average / 2) * 100}%`}
                    type="rating"
                />
            )}
        </div>
    );
}
