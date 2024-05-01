import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import chicken from "../assets/images/chicken.png";
import { Player } from '../models';
import { ExtendedStats } from '../models/extended-stats';


const LeaderBoard = ( { title, property, leaderBoard }: { title: string, property: string,  leaderBoard: Player[]} ) => 
<div className='m-4'>
    <div>
        <div className="text-3xl text-center m-4">{title}</div>
    </div>
    <table className="table-auto w-full">
        <thead className="underline decoration-yellow-400">
            <tr className="text-left h-12">
                <th></th>
                <th>NAME</th>
                <th>{title}</th>
            </tr>
        </thead>
        <tbody>
            { leaderBoard.map( (player, index) => 
            <tr className={`${index % 2 === 0 ? "bg-midnight1" : "bg-midnight2"}`} key={player.name}>
                <td className="pr-4">{index + 1}</td>
                <td className='truncate'>{player.name}</td>
                <td className="text-center">{player.extendedStats["trackedObj" as keyof ExtendedStats][property]}</td>
            </tr> ) }
        </tbody>
    </table>
</div>


export function Chickens() {
    const { players } = useDataContext();

    const playersWithExtendedStats = players.filter( p => p.extendedStats);

    const totalChickenKills = playersWithExtendedStats.reduce( (total, player) => total + (player.extendedStats.chickens.killed), 0);
    const chickenDeathTotals = {
        "Knifed": playersWithExtendedStats.reduce( (total, player) => total + (player.extendedStats.chickens.stabbed), 0),
        "Roasted": playersWithExtendedStats.reduce( (total, player) => total + (player.extendedStats.chickens.roasted), 0),
        "Exploded": playersWithExtendedStats.reduce( (total, player) => total + (player.extendedStats.chickens.exploded), 0),
        "Shot": playersWithExtendedStats.reduce( (total, player) => total + (player.extendedStats.chickens.shot), 0),
    }
    

    const chickenLeaderBoard = playersWithExtendedStats.sort( (a, b) => (b?.extendedStats.chickens.killed) - (a.extendedStats?.chickens.killed) ).slice(0, 10);
    const ninjaLeaderBoard = playersWithExtendedStats.sort( (a, b) => (b?.extendedStats.trackedObj.ninjaDefuses) - (a.extendedStats?.trackedObj.ninjaDefuses) ).slice(0, 10);
    const noScopesLeaderBoard = playersWithExtendedStats.sort( (a, b) => (b?.extendedStats.trackedObj.noScopesKills) - (a.extendedStats?.trackedObj.noScopesKills) ).slice(0, 10);
    const wallBangLeaderBoard = playersWithExtendedStats.sort( (a, b) => (b?.extendedStats.trackedObj.wallBangKills) - (a.extendedStats?.trackedObj.wallBangKills) ).slice(0, 10);
    const TeamKillLeaderBoard = playersWithExtendedStats.sort( (a, b) => (b?.extendedStats.trackedObj.teamKills) - (a.extendedStats?.trackedObj.teamKills) ).slice(0, 10);
    const selfKillLeaderBoard = playersWithExtendedStats.sort( (a, b) => (b?.extendedStats.trackedObj.selfKills) - (a.extendedStats?.trackedObj.selfKills) ).slice(0, 10);
    //const knifeLeaderBoard = playersWithExtendedStats.filter( p => p.extendedStats.weaponKills.Knife ).sort( (a, b) => (b?.extendedStats.weaponKills.Knife!) - (a.extendedStats?.weaponKills.Knife!) ).slice(0, 10);


    return (
        <Container>
                <div className='flex'>
                    <div className='flex flex-row flex-wrap'>
                        <div className='flex flex-row'>
                            <div className="text-3xl text-center m-4"><img className='m-auto h-16 w-16' src={chicken} alt="Chickens" />killed in Combines</div>
                            <div className="text-6xl text-center m-4 pt-16">{totalChickenKills}</div>
                        </div>
                        <div className='flex flex-row flex-wrap'>
                            {   Object.entries(chickenDeathTotals).map( ([key, value]) =>
                                <div className="text-l text-center m-auto w-32">
                                    <div>{key}</div>
                                    <div className="text-center">{value}</div>
                                </div>
                            )}
                        </div>
                        <table className="table-auto w-full">
                            <thead className="underline decoration-yellow-400">
                                <tr className="text-left">
                                    <th></th>
                                    <th>NAME</th>
                                    <th>CHICKENS MURDERED</th>
                                </tr>
                            </thead>
                            <tbody>
                                { chickenLeaderBoard.map( (player, index) => 
                                <tr className={`${index % 2 === 0 ? "bg-midnight1" : "bg-midnight2"}`} key={player.name}>
                                    <td className="pr-4">{index + 1}</td>
                                    <td className='truncate'>{player.name}</td>
                                    <td className="text-center">{player?.extendedStats?.chickens.killed}</td>
                                </tr> ) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='flex flex-row flex-wrap m-auto'>
                    <LeaderBoard title='Ninja Defuses' property='ninjaDefuses' leaderBoard={ninjaLeaderBoard} />
                    <LeaderBoard title='No Scopes' property='noScopesKills' leaderBoard={noScopesLeaderBoard} />
                    <LeaderBoard title='Wall Bangs' property='wallBangKills' leaderBoard={wallBangLeaderBoard} />
                    <LeaderBoard title='Team Kills' property='teamKills' leaderBoard={TeamKillLeaderBoard} />
                    <LeaderBoard title='Self Kill' property='selfKills' leaderBoard={selfKillLeaderBoard} />
                    {/* <LeaderBoard title='Knife' property='Knifes' leaderBoard={wallBangLeaderBoard} /> */}

                </div>
        </Container>
    );
}