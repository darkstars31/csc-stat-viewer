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
                    { name: "Awper", max: 1 },
                    { name: "Entry", max: 1 },
                    { name: "Fragger", max: 2 },
                    { name: "Rifler", max: 100 },
                    { name: "Support", max: 1 },
                    { name: "Lurker", max: 2 },
                ]
            },
            series: [ 
                {
                name: "X",
                type: 'radar',
                data: [
                    { 
                        name: "Role", 
                        value: [ player["awp/R"], player.ODR, player["multi/R"], player.ADR, player.SuppR,player["wlp/L"]],
                        areaStyle: {
                            color: 'rgba(255, 228, 52, 1)'
                          }
                    },
                     ] 
                }
            ],
        };

    return (
        <PlayerRadar options={options} />
    );
}