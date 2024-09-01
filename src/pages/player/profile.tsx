import * as React from "react"

import { Player } from "../../models"
import { CopyToClipboard } from "../servers"
import { useFetchPlayerProfile } from "../../dao/analytikill"
import { Loading } from "../../common/components/loading"

export const PlayerProfile = ({ player }: { player: Player }) => {

    const { data: playerProfile , isLoading: loadingPlayerProfile } = useFetchPlayerProfile(player?.discordId);

    if (loadingPlayerProfile) {
        return (
            <div className="w-full flex flex-row flex-warp">
                <Loading />
            </div>
        )
    }

    if ( Object.keys(playerProfile ?? {}).length === 0 ) {
        return (
            <div className="relative w-full flex flex-row flex-warp bg-midnight1 rounded-lg m-0.5 my-2 p-4">
                <div className="absolute rotate-45 bg-midnight1 h-10 w-10 left-20 -top-2 -z-10"></div>
                <div className="text-center italic">Player has not updated their profile.</div>
            </div>  
        )
    }
    
    return (
        <div className="relative">
            <div className="absolute rotate-45 bg-midnight1 h-24 w-24 left-12 -z-10"></div>
            <div className="w-full flex flex-row flex-warp">
                <div className="flex flex-col text-sm basis-72 bg-midnight1 rounded-lg mx-0.5 my-2 p-4">
                    <div className="text-center pb-1 font-extrabold uppercase">Preferred</div>
                    <div className="flex flex-row justify-between">
                        <span>Role</span>
                        <span>{playerProfile?.favoriteRole}</span>
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Weapon</span>
                        <span>{playerProfile?.favoriteWeapon}</span>
                        </div>
                    <div className="flex flex-row justify-between">
                        <span>Map</span>
                        <span>{playerProfile?.favoriteMap}</span>
                    </div>
                </div>
                <div className="flex flex-col text-sm basis-72 bg-midnight1 rounded-lg m-0.5 my-2 p-4">
                    <div className="text-center pb-1 font-extrabold uppercase">Game Settings</div>
                    <div className="flex flex-row justify-between">
                        <span>Screen Ratio</span>
                        <span>{playerProfile?.aspectRatio ?? "Not Specified"}</span>
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Mouse DPI</span>
                        <span>{playerProfile?.dpi ?? "Not Specified"}</span>
                        </div>
                    <div className="flex flex-row justify-between">
                        <span>In-game Sens</span>
                        <span>{playerProfile?.inGameSensitivity ?? "Not Specified"}</span>
                    </div>
                    { player?.extendedStats.crosshairShareCode && <div className="flex flex-row justify-between">
                        <span>Crosshair Share Code</span>
                        <span><CopyToClipboard text={player.extendedStats.crosshairShareCode} /></span>
                    </div> }
                </div>
                <div className="flex flex-col text-sm basis-72 bg-midnight1 rounded-lg m-0.5 my-2 p-4">
                    <div className="text-center pb-1 font-extrabold uppercase">Socials</div>
                    {
                        Object.values(playerProfile?.socials ?? {}).map( item => 
                            <div className="flex flex-row justify-between">
                                <span className="text-blue-400 italic"><a href={item} target="_blank" >{item}</a></span>
                            </div>
                        )
                    }								
                </div>
            </div>								
        </div>
    )
}