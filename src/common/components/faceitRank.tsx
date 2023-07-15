import React from "react";
import { faceitRankImages } from "../images/faceitRanks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const FaceitRank = ( { rank }: { rank?: number } ) => {
    const faceitRank = faceitRankImages[rank!] as unknown as string;
    if( rank === 0 ){
        return (
            <div className="animate-spin h-[1em] w-[1em] m-1"><AiOutlineLoading3Quarters /></div>
        );
    }
    return (
        <img src={faceitRank} alt="" />
    );
}