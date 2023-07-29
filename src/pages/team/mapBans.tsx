import * as React from "react";
import { mapImages } from "../../common/images/maps";

type Props = {
    mapBans?: Record<string,{ banFor: number; banAgainst: number; }>;
}

export function MapBans( { mapBans }: Props) {
    return (
        <div className="flex flex-row">
            <div>MapBans</div>
            {
                Object.entries( mapBans ?? {} ).map( ([key, value]) => {
                    return (
                        <div key={`mapBanrecord ${key}`} className=''>
                            <div className='text-sm'><img className='w-16 h-16 mx-auto' src={mapImages[key]} alt=""/></div>
                            <div className='text-center'>
                                <span className='text-green-400'>{value.banFor}</span>
                                :
                                <span className='text-red-400'>{value.banAgainst}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}