import * as React from "react";
import {
	AwardsDescriptions,
	AwardsMappings,
	awardProperties,
	propertiesCurrentPlayerIsInTop10For,
	propertiesCurrentPlayerIsNumberOneFor,
	propertiesCurrentPlayerIsNumberTwoFor,
	propertiesCurrentPlayerIsNumberThreeFor,
} from "../../common/utils/awards-utils";
import { Player } from "../../models";
import { ToolTip } from "../../common/utils/tooltip-utils";

type Props = {
	player: Player;
	players: Player[];
};

export function PlayerAwards({ player, players }: Props) {
	if (player.stats === undefined) {
		return null;
	}

	const numberOneProperties = propertiesCurrentPlayerIsNumberOneFor(player, players, awardProperties);
	const numberTwoProperties = propertiesCurrentPlayerIsNumberTwoFor(player, players, awardProperties);
	const numberThreeProperties = propertiesCurrentPlayerIsNumberThreeFor(player, players, awardProperties);
	const top10Properties = propertiesCurrentPlayerIsInTop10For(player, players, awardProperties);

	return (
		<div className="px-[2.5%] space-y-4">
			<div className="flex flex-wrap place-items-center gap-3">
				{numberOneProperties.map(property => (
					<div key={property}>
						<ToolTip
							type="award"
							awardType="numberOne"
							message={`${AwardsDescriptions[property]}`}
							awardMapping={`${AwardsMappings[property]}`}
						/>
					</div>
				))}
				{numberTwoProperties.map(property => (
					<div key={property}>
						<ToolTip
							type="award"
							awardType="numberTwo"
							message={`${AwardsDescriptions[property]}`}
							awardMapping={`${AwardsMappings[property]}`}
						/>
					</div>
				))}
				{numberThreeProperties.map(property => (
					<div key={property}>
						<ToolTip
							type="award"
							awardType="numberThree"
							message={`${AwardsDescriptions[property]}`}
							awardMapping={`${AwardsMappings[property]}`}
						/>
					</div>
				))}
				{top10Properties
					.filter(
						property =>
							![...numberOneProperties, ...numberTwoProperties, ...numberThreeProperties].includes(
								property,
							),
					)
					.map(property => (
						<div key={property}>
							<ToolTip
								type="award"
								awardType="top10"
								message={`${AwardsDescriptions[property]}`}
								awardMapping={`${AwardsMappings[property]}`}
							/>
						</div>
					))}
			</div>
		</div>
	);
}
