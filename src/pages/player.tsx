import * as React from "react";
import { Container } from "../common/container";
import { Pill } from "../common/pill";
import { type Player as PlayerType } from "../models";
import { PlayerMappings, TotalPlayerAverages } from "./player-utils";
import { getSteamApiPlayerSummeries } from "../dao/steamApiDao";
import { Tooltip } from "../common/tooltip";

type Props = {
    request: {
        data: PlayerType[],
        isLoading: boolean,
    }
}

function Stat( { title, value, children }: { title?:string, value: string|number, children?: React.ReactNode | React.ReactNode[] } ) {
    return (
        <div className="mb-4 flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center dark:border-gray-800">
          { title && <dt className="order-last text-lg font-medium text-gray-500 dark:text-gray-400">
            {title}
          </dt> }
          <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
            {value}
          </dd>
          <div className="pt-4"> {children} </div>
        </div>
    );
}

export function Player( { request }: Props ) {
    const params = window.location.pathname.split("/");
    const id = params.at(-1);
    const player = request.data.find( player => player.Steam === id);
    const averages = TotalPlayerAverages();
    console.info(averages);
    if( player?.Steam ) {
        getSteamApiPlayerSummeries( [ player.Steam ] ).then( data => console.info( "player", data ));
    }
    const { 
        Name, Tier, Team, Rating, Steam, ppR, GP, "": _,
        Kills, Assists, Deaths,
        "2k": twoKills, "3k": threeKills, "4k": fourKills, "5k": aces,
        HS,
        "CT #": ctRating, "T #": tRating,
        "1v1": clutch1v1, "1v2": clutch1v2, "1v3": clutch1v3, "1v4": clutch1v4, "1v5": clutch1v5,
        Peak, Pit, Form, "CONCY": ratingConsistency,
        ...playerRest 
    } = player!;
    // const indexOfName = Object.keys(player!).find( (p, i) => p === "Name" ? i : false);
    // delete stats![indexOfName];
    console.info( player );
    return (
        <Container>
            <Stat value={ Name ?? "n/a"}>
                <Pill label={Tier} color="bg-yellow-300" />
                <Pill label={ppR} color="bg-red-300" />
                <Pill label={Team} color="bg-blue-300" />
                <Tooltip content={
                    <>
                        <div>Trending {Form > Rating ? "Up" : "Down"} in last 3 games</div>
                        <div>Consistency(SD): {ratingConsistency}σ ({ratingConsistency < averages.avgRatingConsistency ? "Better" : "Worse"} than average)</div>
                        <div>Peak {Peak} / Bottom {Pit}</div>
                        <div>CT: {ctRating} / T: {tRating}</div>
                    </>
                }>
                    <Pill label={`Rating ${Rating} ${Form > Rating ? "↑" : "↓"}`} color="bg-green-300" data-tooltip-target="rating-tooltip" data-tooltip-placement="top"/>
                </Tooltip>
                <Pill label={`Games Played ${GP}`} color="bg-orange-300" />
            </Stat>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Stat title={"K/A/D"} value={ `${Kills} / ${Assists} / ${Deaths}` } />
                <Stat title={"K/D Ratio"} value={ `${(Kills/Deaths).toFixed(2)}` } />
                <Stat title={"Headshots"} value={ `${HS}%` } />
                <Stat title={"2k / 3k / 4k"} value={ `${twoKills} / ${threeKills} / ${fourKills}` } />
                <Stat title={"Aces"} value={ `${aces}` } />
                {/* <Stat title={"CT-side / T-side Rating"} value={ `${ctRating} / ${tRating}` } /> */}
                {/* <Stat title={"Rating Peak / Bottom"} value={ `${Peak} / ${Pit}` } /> */}

                <Stat title={"1v2/3/4/5 Clutch Rounds"} value={ `${clutch1v2} / ${clutch1v3} / ${clutch1v4} / ${clutch1v5}` } />

                { Object.entries(playerRest ?? []).map( ( [key, value] ) => 
                    <Stat key={`${key}${value}`} title={PlayerMappings[key]} value={ value ?? "n/a"} />
                )}
            </dl>
        </Container>
    );
}