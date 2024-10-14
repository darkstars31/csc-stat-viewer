import * as React from "react";
import { Link } from "wouter";
import { Player } from "../../models/player";

export function FranchiseManagementNamePlate ({ player, title }: { player?: Player, title: string}) {

    if( !player ){
        return null;
    }

    return (
        <div className="flex flex-col m-2">
            <Link
                className="basis-5/12 hover:cursor-pointer hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300"
                to={`/players/${player?.name}`}
            >
                <img
                    className="inline-block w-8 h-8 mr-2 rounded-full"
                    src={player?.avatarUrl}
                    alt=""
                />
                <span className="mr-2 text-lg font-bold">
                    {player?.name}
                </span>
            </Link>
            <div className="text-gray-400 text-xs font-bold uppercase overline">{title}</div>
        </div>
    )
}