import React from "react";
import { faceitRankImages } from "../images/faceitRanks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useFetchFaceitPlayerData } from "../../dao/faceitApiDao";
import { Player } from "../../models";

type Props = {
    player?: Player;
}

export const FaceitRank = ( { player }: Props ) => {
    const { data: faceitPlayer, isLoading } = useFetchFaceitPlayerData( player );
    const faceitRank = faceitRankImages[faceitPlayer?.games?.csgo?.skill_level ?? 0] as unknown as string;
    
    if( isLoading ){
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