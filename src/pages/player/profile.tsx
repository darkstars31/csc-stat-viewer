import * as React from "react"

import { Player } from "../../models"
import { CopyToClipboard } from "../servers"
import { ProfileJson } from "../../models/profile-types"

export const PlayerProfile = ({ player, playerProfile }: { player: Player, playerProfile: ProfileJson }) => {
    
    return (
        <div className="relative my-2">
            <div className="absolute rotate-45 bg-midnight1 h-24 w-24 left-12 -z-10"></div>
            <div className="flex flex-row flex-wrap gap-2">
                <div className="basis-1/3 grow text-sm bg-midnight1 rounded-lg p-4">
                    <div className="text-center pb-1 font-extrabold uppercase">Preferred</div>
                    <div className="flex flex-row justify-between">
                        <span>Playstyle</span>
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
                <div className="basis-1/3 grow text-sm bg-midnight1 rounded-lg p-4">
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
                    { player?.extendedStats?.crosshairShareCode && <div className="flex flex-row justify-between">
                        <span>Crosshair Share Code</span>
                        <span><CopyToClipboard text={player.extendedStats.crosshairShareCode} /></span>
                    </div> }
                </div>
                { Object.values(playerProfile?.socials ?? {}).length > 0 &&
                    <div className="basis-1/3 grow text-sm bg-midnight1 rounded-lg p-4">
                        <div className="text-center pb-1 font-extrabold uppercase">Socials</div>
                        {
                            Object.values(playerProfile?.socials ?? {}).map( item =>
                                <div className="flex flex-row justify-between">
                                    <span className="text-blue-400 italic"><a href={item} target="_blank" >{item}</a></span>
                                </div>
                            )
                        }
                    </div>
                }
            </div>
        </div>
    )
}