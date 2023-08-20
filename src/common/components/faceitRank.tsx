import React from "react";
import { faceitRankImages } from "../images/faceitRanks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useFetchFaceItPlayerWithCache } from "../../dao/faceitApiDao";
import { Player } from "../../models";
import { ToolTip } from "../utils/tooltip-utils";

type Props = {
    player?: Player;
}

const faceitPopover = ( faceitSearchPlayer: { id: number, faceit_identifier: string, updated_at: string, rank: number, highest_rank: number, faceit_name: string, elo: number } | undefined ) => {
    const faceitRankHighest = faceitRankImages[faceitSearchPlayer?.highest_rank ?? 0 as keyof typeof faceitRankImages];
    return (
        <div className="z-40 w-48 bg-zinc-500 m-1 p-1 rounded-lg text-xs flex flex-col shadow">
            <div><strong>FACEIT Rank - {faceitSearchPlayer?.elo} ELO</strong></div>
            { faceitSearchPlayer?.rank !== faceitSearchPlayer?.highest_rank &&
                <div>
                    Highest Rank Achieved <img className="w-7 h-7" src={faceitRankHighest as unknown as string} alt="" />
                </div>
            }
        </div>
    );
} 

export const FaceitRank = ( { player }: Props ) => {
    const { data: faceitSearchPlayer = undefined, isLoading: isLoadingFaceitSearch } = useFetchFaceItPlayerWithCache( player );
    const faceitRank = faceitRankImages[faceitSearchPlayer?.rank ?? 0 as keyof typeof faceitRankImages];
    
    if( isLoadingFaceitSearch ){
        return (
            <div className="animate-spin h-[1em] w-[1em] m-1"><AiOutlineLoading3Quarters /></div>
        );
    }
    return (
        <ToolTip type="generic" message={faceitPopover( faceitSearchPlayer )}>
            <div className="w-7 h-7">
                <img src={faceitRank as unknown as string} alt="" />
            </div>
        </ToolTip>
    );
}