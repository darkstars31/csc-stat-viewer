import * as React from "react";
import { AwardsDescriptions, AwardsMappings, awardProperties, propertiesCurrentPlayerIsInTop10For, propertiesCurrentPlayerIsNumberOneFor } from "../../common/utils/awards-utils";
import { Player } from "../../models";
import { ToolTip } from "../../common/utils/tooltip-utils";
import * as Containers from "../../common/components/containers";

type Props = {
    player: Player;
    players: Player[];
};

export function PlayerAwards( { player, players }: Props ){

    if( player.stats === undefined ){
        return null;
    }

    const numberOneProperties = propertiesCurrentPlayerIsNumberOneFor(player, players, awardProperties);
    const top10Properties = propertiesCurrentPlayerIsInTop10For(player, players, awardProperties);

    if (numberOneProperties.length === 0 && top10Properties.length === 0) {
        return null;
    }

    return (
        <Containers.StandardContentThinBox title="Tier Awards">
            <div className="flex flex-wrap gap-3">
                {
                    numberOneProperties.map((property) => (
                        <div
                            key={property}
                        >
                            <ToolTip
                                type="award"
                                awardType="numberOne"
                                message={`${AwardsDescriptions[property]}`}
                                awardMapping={`${AwardsMappings[property]}`}
                            />
                        </div>
                    ))
                }
                {
                    top10Properties
                        .filter((property) => !numberOneProperties.includes(property))
                        .map((property) => (
                            <div
                                key={property}
                            >
                                <ToolTip
                                    type="award"
                                    awardType="top10"
                                    message={`${AwardsDescriptions[property]}`}
                                    awardMapping={`${AwardsMappings[property]}`}
                                    />
                            </div>
                        ))
                }
            </div>
        </Containers.StandardContentThinBox>
    );
}
