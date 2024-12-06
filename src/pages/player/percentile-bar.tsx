import { ToolTip } from "../../common/utils/tooltip-utils";
import * as React from "react";

interface PercentileBarProps {
	label: string;
	message?: string;
	stat1: number;
	stat2: number;
	range?: number;
	average?: number;
	color: "red" | "yellow" | "green" | "default";
	type: "default" | "concy";
	tooltipMessage?: string;
}

type GradientClasses = {
	[key in PercentileBarProps["color"]]: string;
};

export function PercentileBar({
	label,
	message,
	stat1,
	stat2,
	range,
	average,
	color,
	type,
	tooltipMessage,
}: PercentileBarProps) {
	let width = type === "default" ? `${(stat1 / stat2) * 100}%` : `${stat1}%`;
	width = parseFloat(width) > 100 ? "100%" : width;

	let defaultColor = "h-1 bg-gradient-to-l from-green-500 to-green-900 via-green-600 rounded-lg";

	if (stat1 <= 40) {
		defaultColor = "h-1 bg-gradient-to-l from-red-500 to-red-900 via-red-600 rounded-lg";
	} else if (stat1 < 75) {
		defaultColor = "h-1 bg-gradient-to-l from-yellow-500 to-yellow-900 via-yellow-600 rounded-lg";
	}

	const gradientClasses: GradientClasses = {
		red: "h-1 bg-gradient-to-l from-red-500 to-red-900 via-red-600 rounded-lg",
		yellow: "h-1 bg-gradient-to-l from-yellow-500 to-yellow-900 via-yellow-600 rounded-lg",
		green: "h-1 bg-gradient-to-l from-green-500 to-green-900 via-green-600 rounded-lg",
		default: defaultColor
	};

	const gradientClass = gradientClasses[color] || "";

	return (
		<div className="relative">
			{label}
			{tooltipMessage && (
				<span className="pl-1">
					<ToolTip message={tooltipMessage} type="explain" />
				</span>
			)}
			{!range && <div className="float-right text-sm inline-block">{Math.floor(stat1)}/100</div>}
			{message && <ToolTip message={message} stat1={stat1} stat2={stat2} range={range} type="icon" />}
			<div className="h-1 bg-midnight2 rounded-lg">
				<div className={`${gradientClass} rounded-lg`} style={{ width }} />
			</div>
		</div>
	);
}
