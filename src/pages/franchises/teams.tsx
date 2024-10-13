import * as React from "react";
import { Franchise } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { PlayerTypes } from "../../common/utils/player-utils";
import { GiPirateHat } from "react-icons/gi";
import { BiStats } from "react-icons/bi";
import { Link } from "wouter";

const tierNumber = {
    Recruit: 1,
    Prospect: 2,
    Contender: 3,
    Challenger: 4,
    Elite: 5,
    Premier: 6,
};

const tierCssColors = {
    Recruit: "text-red-400",
    Prospect: "text-orange-400",
    Contender: "text-yellow-400",
    Challenger: "text-green-400",
    Elite: "text-blue-400",
    Premier: "text-purple-400",
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
                .map(team => {
                    // Initialize cumulativeRating for each team
                    let cumulativeRating = 0;
                    let membersWithRating = 0;

                    // First, iterate through players to calculate cumulativeRating and membersWithRating
                    team.players.forEach(player => {
                        const playerWithStats = players.find(
                            p => p.steam64Id === player.steam64Id,
                        );
                        const isInactiveReserve =
                            playerWithStats?.type === PlayerTypes.INACTIVE_RESERVE;

                        if (!isInactiveReserve) {
                            if (playerWithStats?.stats?.rating) {
                                cumulativeRating += playerWithStats.stats.rating;
                                membersWithRating++;
                            }
                        }
                    });

                    // Calculate average rating
                    const averageRating = membersWithRating > 0 ? (cumulativeRating / membersWithRating).toFixed(2) : "N/A";

                    return (
                        <Link to={`/franchises/${franchise.name}/${team.name}`} className="transition hover:bg-slate-600/25 hover:scale-[105%] rounded" key={`${team.tier.name}`}>
                            <div className="basis-1/4 mx-4 border-b-[1px] border-slate-700 text-center">
                                <strong>{team.name}</strong>{" "}
                                <span
                                    className={`text-gray-400 italic ${tierCssColors[tiers?.find(item => item.tier.name === team.tier.name)?.tier.name as keyof typeof tierCssColors]}`}
                                >
                                    {team.tier.name}{" "}
                                </span>

                                {/*average rating*/}
                                <div className="flex float-right">
                                    <BiStats size="1.5em" className="mr-1 text-orange-500" />{" " + averageRating}
                                </div>
                            </div>
                            <div className="mx-4 px-2">
                                {team.players.length > 0 ? team.players.map(player => {
                                    const playerWithStats = players.find(
                                        p => p.steam64Id === player.steam64Id,
                                    );
                                    const isInactiveReserve =
                                        playerWithStats?.type === PlayerTypes.INACTIVE_RESERVE;

                                    return (
                                        <div
                                            key={`${team.tier.name}-${player.name}`}
                                            className={`${isInactiveReserve ? "text-slate-500" : ""}  m-1 grid grid-cols-3 gap-2`}
                                        >
                                            <div>
                                                {player.name}{" "}
                                                {isInactiveReserve ?
                                                    <span>(IR)</span>
                                                    : ""}{" "}
                                                {team?.captain?.steam64Id === player.steam64Id ?
                                                    <GiPirateHat
                                                        size="1.5em"
                                                        className="inline"
                                                    />
                                                    : ""}
                                            </div>
                                            <div className="text-center">
                                                {playerWithStats?.stats?.rating.toFixed(2)}
                                            </div>
                                            <div>{playerWithStats?.role}</div>
                                        </div>
                                    );
                                }) : (
                                    <div className="my-1 text-center italic text-gray-500">
                                        No rostered players
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
        </div>
    );
}