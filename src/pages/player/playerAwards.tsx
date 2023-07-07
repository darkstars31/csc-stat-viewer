import * as React from "react";
import { AwardsDescriptions, AwardsMappings, awardProperties, propertiesCurrentPlayerIsInTop10For, propertiesCurrentPlayerIsNumberOneFor } from "../../common/utils/awards-utils";
import { Player } from "../../models";
import { tiertopincategory } from "../../svgs";

type Props = {
    player: Player;
    players: Player[];
};

export function PlayerAwards( { player, players }: Props ){

    const numberOneProperties = propertiesCurrentPlayerIsNumberOneFor(player, players, awardProperties);
    const top10Properties = propertiesCurrentPlayerIsInTop10For(player, players, awardProperties);

    return (
        <div className="p-[2.5%] space-y-4">
        <div className="space-y-4">
            <div className="flex flex-wrap gap-y-4 gap-x-4">
                {
                    numberOneProperties.map((property) => (
                        <div
                            key={property}
                            data-te-toggle={"tooltip"}
                            title={AwardsDescriptions[property]}
                            className="place-items-center flex h-fit w-fit whitespace-nowrap select-none rounded-[0.27rem] bg-yellow-400 px-[0.65em] pb-[0.25em] pt-[0.35em] text-left align-baseline text-[0.75em] font-bold leading-none text-neutral-700"
                        >
                            <button type="button" className="bg-midnight1 w-fit text-sm pointer-events-none transition duration-150 ease-in-out inline-block" disabled/>
                            {AwardsMappings[property]} <img className="h-fit w-fit max-w-[30px] pl-1 fill-neutral-700" src={`data:image/svg+xml;utf-8,${tiertopincategory}`} alt=""/>
                        </div>
                    ))
                }
                {
                top10Properties
                    .filter((property) => !numberOneProperties.includes(property))
                    .map((property) => (
                        <div
                            data-te-toggle={"tooltip"}
                            title={AwardsDescriptions[property]}
                            key={property}
                            className="place-items-center flex h-fit w-fit select-none whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-left align-baseline text-[0.75em] font-bold leading-none text-success-700"
                        >
                            <button type="button" className="bg-midnight1 w-fit text-sm pointer-events-none transition duration-150 ease-in-out inline-block" disabled/>
                            {AwardsMappings[property]} Top 10
                            {/* #{index+1} - {PlayerMappings[property]} */}
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
    );
}