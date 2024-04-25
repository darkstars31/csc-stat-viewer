import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import chicken from "../assets/images/chicken.png";


export function Chickens() {
    const { totalChickenKills, players } = useDataContext();

    const leaderBoard = players.sort( (a, b) => (b?.extendedStats?.trackedObj.chickenKills ?? 0) - (a.extendedStats?.trackedObj?.chickenKills ?? 0) ).slice(0, 20);

    return (
        <Container>
            <div className="flex flex-row">
                <div>
                    <div className="text-3xl text-center m-8">Chickens killed in Combines</div>
                    <div className="text-6xl text-center m-4">{totalChickenKills}</div>
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
                                <td className="text-center">{player?.extendedStats?.trackedObj.chickenKills}</td>
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