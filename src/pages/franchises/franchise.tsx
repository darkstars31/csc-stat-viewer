import * as React from "react"
import { Franchise } from "../../models/franchise-types"
import { franchiseImages } from "../../common/images/franchise"
import { franchiseMetadata } from "../../common/constants/franchiseMetadata"
import { RxDiscordLogo } from "react-icons/rx"
import { Link } from "wouter"
import { BiSolidTrophy } from "react-icons/bi"
import { FranchiseTeams } from "./teams"
import { FranchiseManagementNamePlate } from "./franchiseManagementNamePlate"
import { useDataContext } from "../../DataContext"

export function FranchisesFranchise ({ franchise, selectedTier }: { franchise: Franchise, selectedTier: string | null }) {
    const { players } = useDataContext();
    const trophies = franchiseMetadata.find( f => f.prefix === franchise.prefix )?.trophies;
    const discord = franchiseMetadata.find( i => i.prefix === franchise.prefix)?.discordUrl

    return (
        <div
            key={`${franchise.name}`}
            className="relative shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
        >
            <div
                style={{
                    backgroundImage: `url(${franchiseImages[franchise.prefix]})`,
                }}
                className={`bg-repeat bg-fixed bg-center`}
            >
                <div className="rounded-md border border-gray-800 md:flex-row overflow-hidden backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] p-2">
                   <div className="float-right">              
                        { discord ? 
                            <a className="hover:cursor-pointer bg-blue-700 p-1 rounded w-6 float-left m-[1px]" href={franchiseMetadata.find( i => i.prefix === franchise.prefix)?.discordUrl ?? ""} target="_blank" rel="noreferrer">
                                <RxDiscordLogo />
                            </a>
                            :                         
                            null
                        }                   
                    </div>
                    <Link to={`/franchises/${encodeURIComponent(franchise.name)}`}>
                        <div className="flex flex-col sm:flex-row hover:cursor-pointer gap-4"> 
                            <div className="basis-3/12">
                                <div className="z-10 h-24 w-24 md:w-48 md:h-48">
                                    <img
                                        src={franchiseImages[franchise.prefix]}
                                        placeholder=""
                                        alt=""
                                    />                              
                                </div>
                            </div>
                            <div>
                                <div className="basis-6/12 grow flex flex-col gap-8 justify-end">
                                    <div className="basis-2/3 text-3xl font-bold text-white text-center leading-loose">
                                        {franchise.name} (<i>{franchise.prefix}</i>)
                                    </div>
                                    <div className="basis-1/2">                                  
                                        <FranchiseManagementNamePlate player={players.find( p => p.name === franchise.gm.name)!} title="General Manager" />                                       
                                        <div className="flex flex-row">
                                            {(franchise?.agms ?? []).map( agm => 
                                                    <FranchiseManagementNamePlate player={players.find(p => p.name === agm?.name)!} title="Asst. GM"/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="basis-3/12 text-sm text-yellow-300">
                                { trophies?.map( t => (
                                    <div className="flex flex-row gap-1">
                                        <span className="">{t.season}</span>
                                        <BiSolidTrophy className="inline mt-1" /> 
                                        <span className="basis-8/12 truncate">{t.tier}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Link>
                    <FranchiseTeams franchise={franchise} selectedTier={selectedTier}/>
                </div>
            </div>
        </div>
    )
}