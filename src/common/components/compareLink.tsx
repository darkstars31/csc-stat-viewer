import { Link } from "wouter";
import { Player } from "../../models";
import React from "react";
import { CgExternal } from "react-icons/cg";


export const CompareLink = ( { players }: { players?: (Player | undefined)[] }) => players?.length ?
<Link className="text-blue-600 hover:underline" 
target="_blank" 
to={`/player-compare?players=${encodeURIComponent(players?.map( p => p?.name).join(","))}`}>
    Compare Chart <CgExternal className="inline"/></Link>
    : null;