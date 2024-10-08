import * as React from "react";
import { cs2icons } from "../../common/images/cs2icons";
import { ExtendedStats } from "../../models/extended-stats";
import { ToolTip } from "../../common/utils/tooltip-utils";

export function PlayerWeaponsExtended({ extendedStats }: { extendedStats: ExtendedStats }) {
	const subTypeImages = {
		melee: "Knife",
		pistol: "P2000",
		shotgun: "Nova",
		smg: "MP5-SD",
		rifle: "M4A4",
		sniper: "AWP",
		grenade: "HE Grenade",
	};

	const weaponKillSubTypes = Object.entries(extendedStats.weaponKillSubTypes);
	const weaponKills = Object.entries(extendedStats.weaponKills);

	return (
		<div>
			<div className="font-bold text-center uppercase border-b border-yellow-400">Kills by Weapon Type</div>
			<div className="flex flex-row flex-wrap justify-center">
				{weaponKillSubTypes.map(([key, value]: [string, number]) => (
					<div className="m-2 text-center" key={key}>
						<div className="m-1 p-1 w-16 h-12">
							<ToolTip type="generic" message={key}>
								<img src={cs2icons[subTypeImages[key as keyof typeof subTypeImages]]} alt={key} />
							</ToolTip>
						</div>
						<div>{value}</div>
					</div>
				))}
			</div>
			<div className="font-bold text-center uppercase border-b border-yellow-400">Kills by Weapon</div>
			<div className="flex flex-row flex-wrap justify-center mt-1">
				{weaponKills.map(([key, value]: [string, number]) => (
					<div className="m-2 text-center" key={key}>
						<div className="m-1 p-1 w-16 h-12 -rotate-45">
							<ToolTip type="generic" message={key}>
								<img src={cs2icons[key]} alt={key} />
							</ToolTip>
						</div>
						<div>{value}</div>
					</div>
				))}
			</div>
		</div>
	);
}
