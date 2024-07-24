import * as React from "react";

import tpose from "../../assets/images/hitboxes/tpose.png";
import head from "../../assets/images/hitboxes/hitbox-head.png";
import rightArm from "../../assets/images/hitboxes/hitbox-rightarm.png";
import leftArm from "../../assets/images/hitboxes/hitbox-leftarm.png";
import chest from "../../assets/images/hitboxes/hitbox-chest.png";
import stomach from "../../assets/images/hitboxes/hitbox-stomach.png";
import rightLeg from "../../assets/images/hitboxes/hitbox-rightleg.png";
import leftLeg from "../../assets/images/hitboxes/hitbox-leftleg.png";
import { calculatePercentage } from "../../common/utils/string-utils";
import { ExtendedStats, HitboxTags } from "../../models/extended-stats";

export function Hitbox({ hitboxTags }: { hitboxTags: ExtendedStats["hitboxTags"] }) {
	const [showInfo, setShowInfo] = React.useState<string | null>(null);
	const totalHitboxTags =
		Object.values(hitboxTags).reduce((cumulative, hitboxTag) => cumulative + hitboxTag, 0) - hitboxTags.Generic;
	const hitboxPercentages = {
		head: calculatePercentage(hitboxTags.Head + hitboxTags.Neck, totalHitboxTags),
		rightArm: calculatePercentage(hitboxTags.RightArm, totalHitboxTags),
		leftArm: calculatePercentage(hitboxTags.LeftArm, totalHitboxTags),
		chest: calculatePercentage(hitboxTags.Chest, totalHitboxTags),
		stomach: calculatePercentage(hitboxTags.Stomach, totalHitboxTags),
		rightLeg: calculatePercentage(hitboxTags.RightLeg, totalHitboxTags),
		leftLeg: calculatePercentage(hitboxTags.LeftLeg, totalHitboxTags),
	};

	const hitboxValuePercentages = {
		head: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.head*2),
		rightArm: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.rightArm*2),
		leftArm: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.leftArm*2),
		chest: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.chest),
		stomach: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.stomach*2),
		rightLeg: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.rightLeg*2),
		leftLeg: "", //getCssColorGradientBasedOnPercentage(+hitboxPercentages.leftLeg*2),
	};

	const getClassNamesOnPercentage = (percentage: number | string) => {
		let colorClass = "";
		if (+percentage >= 60) {
			colorClass = "hue-rotate-90 saturate-200"; // Gradient from green-500 to green-900 for percentages >= 90%
		} else if (+percentage >= 40) {
			colorClass = "hue-rotate-60 saturate-150"; // Gradient from yellow-300 to yellow-700 for percentages >= 40%
		} else if (+percentage >= 30) {
			colorClass = "hue-rotate-30"; // Gradient from yellow-200 to yellow-600 for percentages >= 30%
		} else if (+percentage >= 20) {
			colorClass = "-hue-rotate-[45]"; // Gradient from yellow-200 to yellow-600 for percentages >= 30%
		} else if (+percentage >= 10) {
			colorClass = "-hue-rotate-[55] saturate-150"; // Gradient from red-400 to red-800 for percentages >= 10%
		} else {
			colorClass = "-hue-rotate-[65] saturate-200"; // Gradient from red-300 to red-700 for percentages < 10%
		}
		return `${colorClass} brightness-150 mix-blend-overlay hover:mix-blend-lighten`;
	};

	return (
		<>
			<div className="relative text-sm font-bold h-80 m-1">
				{/* <svg>
                    <filter id="greenOverlay" type="matrix" color-interpolation-filters="sRGB">
                        <feColorMatrix type="matrix"
                        values="0 0 0 0 0.6588
                                0 1 0 0 0.4745
                                0 0 0 0 0.1686
                                0 0 0 1 0" />
                    </filter>
                    <filter id="redOverlay" type="matrix" color-interpolation-filters="sRGB">
                        <feColorMatrix type="matrix"
                        values="1 0 0 0 0.6588
                                0 0 0 0 0.4745
                                0 0 0 0 0.1686
                                0 0 0 1 0" />
                    </filter>
                </svg> */}
				<img
					className={`absolute object-cover left-[4px] top-[4px] min-h-[329px] min-w-[329px]`}
					src={tpose}
					alt="tpose"
				/>
				<div className={`absolute left-[120px] ${hitboxValuePercentages.head}`}>
					Head {hitboxPercentages.head}%
				</div>
				<div className={`absolute left-[10px] top-[48px] ${hitboxValuePercentages.rightArm}`}>
					Right Arm {hitboxPercentages.rightArm}%
				</div>
				<div className={`absolute left-[212px] top-[48px] ${hitboxValuePercentages.leftArm}`}>
					Left Arm {hitboxPercentages.leftArm}%
				</div>
				<div className={`absolute left-[148px] top-[80px] text-center ${hitboxValuePercentages.chest}`}>
					<div>Chest</div>
					{hitboxPercentages.chest}%
				</div>
				<div className={`absolute left-[120px] top-[148px] ${hitboxValuePercentages.stomach}`}>
					Stomach {hitboxPercentages.stomach}%
				</div>
				<div className={`absolute left-[40px] top-[220px] ${hitboxValuePercentages.rightLeg}`}>
					Right Leg {hitboxPercentages.rightLeg}%
				</div>
				<div className={`absolute left-[183px] top-[241px] ${hitboxValuePercentages.leftLeg}`}>
					Left Leg {hitboxPercentages.leftLeg}%
				</div>

				<img
					onMouseOver={() => setShowInfo("Head")}
					onMouseOut={() => setShowInfo(null)}
					style={{ filter: "url(#greenOverlay)" }}
					className={`absolute left-[90px] top-[13px] ${getClassNamesOnPercentage(hitboxPercentages.head)}`}
					src={head}
					alt="tpose"
				/>
				<img
					onMouseOver={() => setShowInfo("RightArm")}
					onMouseOut={() => setShowInfo(null)}
					style={{ filter: "url(#redOverlay)" }}
					className={`absolute left-[5px] top-[61px] ${getClassNamesOnPercentage(hitboxPercentages.rightArm)}`}
					src={rightArm}
					alt="tpose"
				/>
				<img
					onMouseOver={() => setShowInfo("LeftArm")}
					onMouseOut={() => setShowInfo(null)}
					className={`absolute left-[203px] top-[64px] ${getClassNamesOnPercentage(hitboxPercentages.leftArm)}`}
					src={leftArm}
					alt="tpose"
				/>
				<img
					onMouseOver={() => setShowInfo("Chest")}
					onMouseOut={() => setShowInfo(null)}
					className={`absolute left-[134px] top-[64px] ${getClassNamesOnPercentage(hitboxPercentages.chest)}`}
					src={chest}
					alt="tpose"
				/>
				<img
					onMouseOver={() => setShowInfo("Stomach")}
					onMouseOut={() => setShowInfo(null)}
					className={`absolute left-[127px] top-[138px] ${getClassNamesOnPercentage(hitboxPercentages.stomach)}`}
					src={stomach}
					alt="tpose"
				/>
				<img
					onMouseOver={() => setShowInfo("RightLeg")}
					onMouseOut={() => setShowInfo(null)}
					className={`absolute left-[127px] top-[184px] ${getClassNamesOnPercentage(hitboxPercentages.rightLeg)}`}
					src={rightLeg}
					alt="tpose"
				/>
				<img
					onMouseOver={() => setShowInfo("LeftLeg")}
					onMouseOut={() => setShowInfo(null)}
					className={`absolute left-[169px] top-[184px] ${getClassNamesOnPercentage(hitboxPercentages.leftLeg)}`}
					src={leftLeg}
					alt="tpose"
				/>
			</div>
			<div className="h-4">
				{showInfo && (
					<div className="text-sm font-bold">
						<div>Shots Landed: {hitboxTags[showInfo as keyof HitboxTags]}</div>
					</div>
				)}
			</div>
		</>
	);
}
