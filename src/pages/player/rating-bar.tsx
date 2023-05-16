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
    type: 'default' | 'concy';
}

export function RatingBar({
                              label,
                              message,
                              stat1,
                              stat2,
                              range,
                              average,
                              color,
                              type,
                          }: RatingBarProps) {
    const width = (type === "default") ? ((stat1 / 2) * 100).toFixed(0).toString().concat("%") : stat1.toString().concat("%");

    if (type === "default") {
        return (
            <div className="relative">
                {label}
                {
                    !range ? (
                        <div className="float-right text-sm inline-block">{stat1}</div>
                    ) : <></>
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
                        style={{width}}
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
    } else if (type === "concy") {
        return (
            <div className="relative">
                Consistency
                <ToolTip
                    message="Are you consistent compared to your rating? This measures Standard Deviation by Percent of Rating Average as a scale from 0 - 100, the higher the better"
                    type="explain"
                />
                <div className="float-right text-sm">{stat1}</div>
                <div className="h-1 bg-midnight2 rounded-lg">
                    <div
                        className="h-1 bg-gradient-to-l from-blue-500 to-blue-900 via-blue-600 rounded-lg"
                        style={{width: width}}
                    />
                </div>
                <ToolTip
                    message={`Tier Average: ${average?.toFixed(0)}`}
                    pos={String(
                        average).concat("%")}
                    type="rating"
                />
            </div>
        );
    } else
        return (
            <></>
        )
}
