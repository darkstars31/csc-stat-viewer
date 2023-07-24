import { ToolTip } from "../../common/utils/tooltip-utils";
import * as React from "react";

interface RatingBarProps {
  label: string;
  message?: string;
  stat1: number;
  stat2: number;
  range?: number;
  average?: number;
  color: 'red' | 'violet' | 'yellow' | 'blue' | 'green';
  type: 'default' | 'concy';
  tooltipMessage?: string;
}

type GradientClasses = {
  [key in RatingBarProps['color']]: string;
};

export function RatingBar({
  label,
  message,
  stat1,
  stat2,
  range,
  average,
  color,
  type,
  tooltipMessage
}: RatingBarProps) {
  let width = type === "default" ? `${(stat1 / 2) * 100}%` : `${stat1}%`;
  width = parseFloat(width) > 100 ? "100%" : width;

  const gradientClasses: GradientClasses = {
    red: "h-1 bg-gradient-to-l from-red-500 to-red-900 via-red-600 rounded-lg",
    violet: "h-1 bg-gradient-to-l from-violet-500 to-violet-900 via-violet-600 rounded-lg",
    yellow: "h-1 bg-gradient-to-l from-yellow-500 to-yellow-900 via-yellow-600 rounded-lg",
    blue: "h-1 bg-gradient-to-l from-blue-500 to-blue-900 via-blue-600 rounded-lg",
    green: "h-1 bg-gradient-to-l from-green-500 to-green-900 via-green-600 rounded-lg",
  };

  const gradientClass = gradientClasses[color] || "";

  return (
    <div className="relative">
      {label}
      { tooltipMessage && <span className="pl-1"><ToolTip message={tooltipMessage} type="explain"/></span>}
      {!range && <div className="float-right text-sm inline-block">{stat1.toFixed(2)}</div>}
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
        <div className={`${gradientClass} rounded-lg`} style={{ width }} />
      </div>
      {average && type !== "concy" && (
        <ToolTip
          message={`Tier Average: ${average}`}
          pos={`${(average / 2) * 100}%`}
          type="rating"
        />
      )}
      {type === "concy" && (
        <ToolTip
          message={`Tier Average: ${average?.toFixed(0)}`}
          pos={String(average).concat("%")}
          type="rating"
        />
      )}
    </div>
  );
}
