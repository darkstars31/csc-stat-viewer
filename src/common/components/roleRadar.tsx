import { EChartsOption } from "echarts";
import * as React from "react";
import { Player } from "../../models";
import { PlayerRadar } from "./charts/radar";

type Props = {
    player: Player,
}

export function RoleRadar( { player }: Props ){
    const options: EChartsOption = {
            //legend: { data: ["Role"] },
            radar:{
                indicator: [
                    { name: "Awper", max: 2 },
                    { name: "Awper", max: 2 },
                    { name: "Entry", max: 2 },
                    { name: "Fragger", max: 2 },
                    { name: "Rifler", max: 100 },
                    { name: "Support", max: 2 },
                    { name: "Lurker", max: 2 },
                ]
            },
            series: [ 
                {
                name: "X",
                type: 'radar',
                data: [
                    { name: "Role", value: [ 1,player["awp/R"], player.ODR, player["multi/R"], player.ADR, player.SuppR,player["wlp/L"]] },
                     ] 
                }
            ],
        };

    return (
        <PlayerRadar options={options} />
    );
}