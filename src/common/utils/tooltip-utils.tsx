import { downarrow, uparrow, updownarrow, questionmark } from "../../svgs";
import * as React from "react";

interface ToolTipProps {
    message: string;
    pos?: string;
    type: "rating" | "icon" | "explain";
    stat1?: number;
    stat2?: number;
    range?: number;
}

function inRange(stat1: number, stat2: number, range: number) {
    return Math.abs(stat1 - stat2) <= range;
}

export function ToolTip({ message, pos, type, stat1, stat2, range }: ToolTipProps) {
    if (type === "rating") {
        return (
            <span
                className="top-5 h-3 absolute border-l-2 border-neutral-300 rounded-lg"
        data-te-toggle="tooltip"
        title={message}
        style={{ left: pos }}
    >
        <button
            type="button"
        className="bg-midnight1 text-sm pointer-events-none transition duration-150 ease-in-out inline-block"
        disabled
        />
        </span>
    );
    } else if (type === "icon") {
        return (
            <div className="float-right text-sm">
            <img
                className="h-3 w-3 transition inline-block ease-in-out select-none"
        src={
            inRange(stat1!, stat2!, range!)
            ? `data:image/svg+xml;utf-8,${updownarrow}`
            : stat1! > stat2!
                ? `data:image/svg+xml;utf-8,${uparrow}`
                : `data:image/svg+xml;utf-8,${downarrow}`
    }
        data-te-toggle="tooltip"
        title={message}
        alt={""}
        />
        {stat2}
        </div>
    );
    } else if (type === "explain") {
        return (
            <div className="relative inline-block">
                <img
                    className="h-3 w-3 transition inline-block ease-in-out select-none"
                    src={`data:image/svg+xml;utf-8,${questionmark}`}
                    data-te-toggle="tooltip"
                    title={message}
                    alt={""}
                />
                <div className="float-right text-sm">
                    {stat1}
                </div>
            </div>
        );
    }
    return null;
}