import * as React from "react";
import { Franchise } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { PlayerTypes } from "../../common/utils/player-utils";
import { GiPirateHat } from "react-icons/gi";

const tierNumber = {
    Recruit: 1,
    Prospect: 2,
    Contender: 3,
    Challenger: 4,
    Elite: 5,
    Premier: 6,
};

export function FranchiseTeams({ franchise, selectedTier }: { franchise: Franchise, selectedTier: string | null }) {
    const { players, tiers } = useDataContext();

    const filteredTeams = selectedTier
        ? franchise.teams.filter(team => team.tier.name.toLowerCase() === selectedTier.toLowerCase())
        : franchise.teams;

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 p-1 text-sm text-gray-300">
            {filteredTeams
                .sort(
                    (a, b) =>
                        tierNumber[b.tier.name as keyof typeof tierNumber] -
                        tierNumber[a.tier.name as keyof typeof tierNumber],
                )
                .map(team => (
                    <div key={`${team.tier.name}` }>
                        <div className="basis-1/4 mx-4 border-b-[1px] border-slate-700 text-center">
                            <strong>{team.name}</strong>{" "}
                            <span
                                className={`text-gray-400 italic text-${tiers?.find(item => item.tier.name === team.tier.name)?.tier.color ?? ""}-400`}
                            >
                                {team.tier.name}{" "}
                            </span>
                        </div>
                        <div className="mx-4 px-2">
                            { team.players.length > 0 ? team.players.map(player => {
                                const playerWithStats = players.find(
                                    p => p.steam64Id === player.steam64Id,
                                );
                                const isInactiveReserve =
                                    playerWithStats?.type === PlayerTypes.INACTIVE_RESERVE;

                                return (
                                    <div
                                        key={`${team.tier.name}-${player.name}`}
                                        className={`${isInactiveReserve ? "text-slate-500" : ""} m-1 grid grid-cols-3 gap-2`}
                                    >
                                        <div>
                                            {player.name}{" "}
                                            {isInactiveReserve ?
                                                <span>(IR)</span>
                                            :	""}{" "}
                                            {team?.captain?.steam64Id === player.steam64Id ?
                                                <GiPirateHat
                                                    size="1.5em"
                                                    className="inline"
                                                />
                                            :	""}
                                        </div>
                                        <div className="text-center">
                                            {playerWithStats?.stats?.rating.toFixed(2)}
                                        </div>
                                        <div>{playerWithStats?.role}</div>
                                        {/* <div className="text-xs text-gray-500"> <span className="hidden md:contents"><Mmr player={player} />({((player.mmr/team.tier.mmrCap)*100).toFixed(1)}%)</span></div> */}
                                    </div>
                                );
                            })
                        :   <div className="my-1 text-center italic text-gray-500">
                                No rostered players
                            </div>}
                        </div>
                    </div>
                ))}
        </div>
    );
}