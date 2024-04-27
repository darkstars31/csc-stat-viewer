import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import chicken from "../assets/images/chicken.png";


export function Chickens() {
    const { players } = useDataContext();

    const totalChickenKills = players.reduce( (total, player) => total + (player?.extendedStats?.chickens.killed ?? 0), 0);
    const chickenDeathTotals = {
        "Knifed": players.reduce( (total, player) => total + (player?.extendedStats?.chickens.stabbed ?? 0), 0),
        "Roasted": players.reduce( (total, player) => total + (player?.extendedStats?.chickens.roasted ?? 0), 0),
        "Exploded": players.reduce( (total, player) => total + (player?.extendedStats?.chickens.exploded ?? 0), 0),
        "Shot": players.reduce( (total, player) => total + (player?.extendedStats?.chickens.shot ?? 0), 0),
    }
    

    const leaderBoard = players.sort( (a, b) => (b?.extendedStats?.chickens.killed ?? 0) - (a.extendedStats?.chickens.killed ?? 0) ).slice(0, 20);

    return (
        <Container>
            <div className="flex flex-row">
                <div>
                    <div className="text-3xl text-center m-8">Chickens killed in Combines</div>
                    <div className="text-6xl text-center m-4">{totalChickenKills}</div>
                    <div className='flex flex-row flex-wrap'>
                        {   Object.entries(chickenDeathTotals).map( ([key, value]) =>
                            <div className="text-l text-center m-4"><div>{key}</div><div className="text-center">{value}</div></div>
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
                            { leaderBoard.map( (player, index) => 
                            <tr className={`${index % 2 === 0 ? "bg-midnight1" : "bg-midnight2"}`} key={player.name}>
                                <td className="pr-4">{index + 1}</td>
                                <td>{player.name}</td>
                                <td className="text-center">{player?.extendedStats?.chickens.killed}</td>
                            </tr> ) }
                        </tbody>
                    </table>
                </div>
                <div>
                    <img src={chicken} alt="Chickens" />
                </div>
            </div>
        </Container>
    );
}