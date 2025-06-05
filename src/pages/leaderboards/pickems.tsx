import * as React from 'react';
import { usePickemsLeaderboard } from "../../dao/analytikill"
import { useDataContext } from "../../DataContext"
import { Container } from "../../common/components/container";
import { StatsLeaderBoard } from "./stats";
import { Loading } from '../../common/components/loading';

type PickemLeaderboards = {
    discordId: string;
    tier: "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier";
    points: number;
}

export const PickemLeaderboards = ({ limit }: { limit: number}) => {
    const { seasonAndMatchType, players } = useDataContext();
    const { data: pickemsLeaderboardData, isLoading: isLoadingPickemLeaderboards } = usePickemsLeaderboard<{ lastUpdate: string, leaderboard: PickemLeaderboards[]}>(seasonAndMatchType.season, { enabled: !!seasonAndMatchType.season });
    const leaderboards = pickemsLeaderboardData?.leaderboard.filter( l => l.points > 0);
    const leaderboardsByTier = {
        Recruit: leaderboards?.filter(p => p.tier === "Recruit").slice(0, limit) ?? [],
        Prospect: leaderboards?.filter(p => p.tier === "Prospect").slice(0, limit) ?? [],
        Contender: leaderboards?.filter(p => p.tier === "Contender").slice(0, limit) ?? [] ,
        Challenger: leaderboards?.filter(p => p.tier === "Challenger").slice(0, limit) ?? [],
        Elite: leaderboards?.filter(p => p.tier === "Elite").slice(0, limit) ?? [],
        Premier: leaderboards?.filter(p => p.tier === "Premier").slice(0, limit) ?? [],
    }

    if( isLoadingPickemLeaderboards ){
        <Container><Loading /></Container>
    }

    return (
        <Container>
            <div className='flex flex-wrap gap-8'>
            { Object.entries(leaderboardsByTier).map(([tier, leaderboards]) => (
                <StatsLeaderBoard
                    key={tier}
                    title={`Pickems ${tier} Leaderboard`}
                    subtitle={`Season ${seasonAndMatchType.season}`}
                    rows={leaderboards?.map(lb => ({
                        player: players.find( p => p.discordId === lb.discordId)!,
                        value: lb.points
                    })).filter( p => p.player) ?? []}
                    //headerImage={`/assets/leaderboard-${tier.toLowerCase()}.png`}
                />
            ))}
            </div>
        </Container>
    )
}