import React from "react";
import { faceitRankImages } from "../images/faceitRanks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useFetchFaceItPlayerWithCache } from "../../dao/faceitApiDao";
import { Player } from "../../models";

type Props = {
    player?: Player;
}

export const FaceitRank = ( { player }: Props ) => {
    const { data: faceitSearchPlayer = undefined, isLoading: isLoadingFaceitSearch } = useFetchFaceItPlayerWithCache( player );
    const faceitRank = faceitRankImages[faceitSearchPlayer?.rank ?? 0 as keyof typeof faceitRankImages];
    console.info( faceitSearchPlayer );
    
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
            <img src={faceitRank as unknown as string} alt="" />
        // </ToolTip>
    );
}