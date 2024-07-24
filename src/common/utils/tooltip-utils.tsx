import { downarrow, uparrow, updownarrow, questionmark } from "../../svgs";
import * as React from "react";
import { tiertopincategory, secondInCategory, thirdInCategory } from "../../svgs";

interface ToolTipProps {
	message: string | React.ReactElement | null;
	children?: React.ReactNode;
	pos?: string;
	type: "rating" | "icon" | "explain" | "generic" | "award";
	stat1?: number;
	stat2?: number;
	range?: number;
	awardType?: "numberOne" | "numberTwo" | "numberThree" | "top10";
	awardMapping?: string;
	property?: string;
	classNames?: string[];
}
const iconClass = "h-3 w-3 transition inline-block ease-in-out select-none";
const useHover = () => {
	const [isHovered, setIsHovered] = React.useState(false);
	const onMouseEnter = () => setIsHovered(true);
	const onMouseLeave = () => setIsHovered(false);
	return { isHovered, onMouseEnter, onMouseLeave };
};
const baseTooltipClass =
	"absolute-top transition-opacity duration-300 ease-in-out absolute top-0 left-0 text-neutral-100 text-center py-1 px-2 text-sm rounded";
const noWrapClass = "whitespace-nowrap";
const wideTooltipClass = "min-w-[200px] max-w-full";
const awardTooltipClass = "bg-zinc-500 text-neutral-100 text-center font-normal";

const RatingTooltip: React.FC<ToolTipProps> = ({ message, pos }) => {
	const { isHovered, onMouseEnter, onMouseLeave } = useHover();

	return (
		<span
			className="top-5 h-3 absolute border-l-2 border-neutral-300 rounded-lg"
			style={{ left: pos }}
			onMouseEnter={onMouseEnter}
			onMouseOver={onMouseEnter}
			onMouseOut={onMouseLeave}
			onMouseLeave={onMouseLeave}
			onTouchStart={onMouseEnter}
			onTouchEnd={onMouseLeave}
		>
			<button
				type="button"
				className="bg-midnight1 text-sm pointer-events-none transition duration-150 ease-in-out inline-block"
				disabled
			/>
			<div
				className={`${baseTooltipClass} ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} ${noWrapClass} grow`}
				style={{ transform: "translateX(-50%) translateY(-120%)" }}
			>
				{message}
			</div>
		</span>
	);
};

const IconTooltip: React.FC<ToolTipProps> = ({ message, stat1, stat2, range }) => {
	const { isHovered, onMouseEnter, onMouseLeave } = useHover();

	function inRange(stat1: number, stat2: number, range: number) {
		return Math.abs(stat1 - stat2) <= range;
	}

	return (
		<div
			className="float-right text-sm relative"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onTouchStart={onMouseEnter}
			onTouchEnd={onMouseLeave}
		>
			<img
				className={iconClass}
				src={
					inRange(stat1!, stat2!, range!) ? `data:image/svg+xml;utf-8,${updownarrow}`
					: stat2! > stat1! ?
						`data:image/svg+xml;utf-8,${uparrow}`
					:	`data:image/svg+xml;utf-8,${downarrow}`
				}
				alt={"Icon showing if recent performance is above or below rating"}
			/>
			{stat1}
			<div
				className={`${baseTooltipClass} ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none "}
                bg-zinc-500 shadow-lg
                ${noWrapClass}
                `}
				style={{ transform: "translateX(-50%) translateY(-120%)" }}
			>
				{message}
			</div>
		</div>
	);
};

const ExplainTooltip: React.FC<ToolTipProps> = ({ message, stat1 }) => {
	const { isHovered, onMouseEnter, onMouseLeave } = useHover();

	return (
		<div
			className="relative inline-block"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onTouchStart={onMouseEnter}
			onTouchEnd={onMouseLeave}
		>
			<img className={iconClass} src={`data:image/svg+xml;utf-8,${questionmark}`} alt={"Explanation icon"} />
			<div className="float-right text-sm">{stat1}</div>
			<div
				className={`${baseTooltipClass} ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} ${wideTooltipClass} bg-zinc-500 shadow-lg'`}
				style={{ transform: "translateX(-50%) translateY(-110%)" }}
			>
				{message}
			</div>
		</div>
	);
};

const GenericTooltip: React.FC<ToolTipProps> = ({ message, children, classNames }) => {
	const { isHovered, onMouseEnter, onMouseLeave } = useHover();

	const childrenIsString = typeof message === "string";

	return (
		<div
			className={"relative inline-block"}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onTouchStart={onMouseEnter}
			onTouchEnd={onMouseLeave}
		>
			{children}
			{message && (
				<div
					className={`${baseTooltipClass} ${wideTooltipClass} -translate-x-1/4 translate-y-[-110%] ${classNames?.join(" ")} z-50 ${childrenIsString ? "bg-zinc-500 shadow-lg" : ""} ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
				>
					{message}
				</div>
			)}
		</div>
	);
};

const AwardTooltip: React.FC<ToolTipProps> = ({ message, awardType, awardMapping }) => {
	const awardConfig = {
		numberOne: {
			classes: ["bg-yellow-400", "text-neutral-700", "h-7"],
			text: (
				<img
					className="h-fit w-fit max-w-[30px] pl-1 pointer-events-none"
					src={`data:image/svg+xml;utf-8,${tiertopincategory}`}
					alt=""
				/>
			),
		},
		numberTwo: {
			classes: ["bg-stone-300", "text-neutral-700", "h-5"],
			text: (
				<img
					className="h-fit w-fit max-w-[30px] pl-1 pointer-events-none"
					src={`data:image/svg+xml;utf-8,${secondInCategory}`}
					alt=""
				/>
			),
		},
		numberThree: {
			classes: ["bg-orange-500", "text-neutral-700", "h-5"],
			text: (
				<img
					className="h-fit w-fit max-w-[30px] pl-1 pointer-events-none"
					src={`data:image/svg+xml;utf-8,${thirdInCategory}`}
					alt=""
				/>
			),
		},
		top10: {
			classes: ["bg-green-100", "text-green-700", "h-4"],
			text: "Top 10",
		},
	};

	const awardClass = awardConfig[awardType ?? "top10"];

	const { isHovered, onMouseEnter, onMouseLeave } = useHover();
	const whiteSpaceClass =
		typeof message === "string" && message.length > 25 ?
			"whitespace-normal min-w-[200px] max-w-full"
		:	"whitespace-nowrap";

	return (
		<div className="relative inline-block">
			<button
				type="button"
				className={`group flex relative place-items-center justify-center items-center select-none whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-left align-baseline text-[0.75em] font-bold leading-none
                ${awardClass.classes.join(" ")}`}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onTouchStart={onMouseEnter}
				onTouchEnd={onMouseLeave}
			>
				{awardMapping} {awardClass.text}
				<div
					className={`${baseTooltipClass} ${isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} bg-zinc-500 shadow-lg'`}
					style={{ transform: "translate(-50%, -120%)", top: "0", left: "50%" }}
				>
					<div className={`${awardTooltipClass} ${whiteSpaceClass}`}>{message}</div>
				</div>
				{/* shine box */}
				{/* <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" /> */}
			</button>
		</div>
	);
};
const TooltipComponents: {
	[key in ToolTipProps["type"]]: React.FC<ToolTipProps>;
} = {
	rating: RatingTooltip,
	icon: IconTooltip,
	explain: ExplainTooltip,
	generic: GenericTooltip,
	award: AwardTooltip,
};

export function ToolTip(props: ToolTipProps) {
	const TooltipComponent = TooltipComponents[props.type];
	if (!TooltipComponent) return null;
	return <TooltipComponent {...props} />;
}
