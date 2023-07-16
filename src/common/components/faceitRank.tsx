import React from "react";
import { faceitRankImages } from "../images/faceitRanks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useFetchSearchFaceitPlayers } from "../../dao/faceitApiDao";
import { Player } from "../../models";

type Props = {
    player?: Player;
}

export const FaceitRank = ( { player }: Props ) => {
    const { data: faceitSearchPlayer = undefined, isLoading: isLoadingFaceitSearch } = useFetchSearchFaceitPlayers( player );
    const faceitRank = faceitRankImages[faceitSearchPlayer?.items[0]?.games[0]?.skill_level ?? 0] as unknown as string;
    
    if( isLoadingFaceitSearch ){
        return (
            <div className="animate-spin h-[1em] w-[1em] m-1"><AiOutlineLoading3Quarters /></div>
        );
    }
    return (
        // <ToolTip
        //     message={"taco"}
        //     type="generic"
        // >
            <img src={faceitRank} alt="" />
        // </ToolTip>
    );
}