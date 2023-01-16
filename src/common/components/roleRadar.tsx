import { EChartsOption, graphic } from "echarts";
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
                //shape: "circle",
                indicator: [
                    { name: "Awper", max: .5 },
                    { name: "Entry", max: 1 },
                    { name: "Fragger", max: 1 },
                    { name: "Rifler", max: 250 },
                    { name: "Support", max: 2 },
                    { name: "Lurker", max: 4 },
                ]
            },
            series: [ 
                {
                name: "X",
                type: 'radar',
                data: [
                    { 
                        name: "Role", 
                        value: [ player["awp/R"], // Awper
                                player.ODR*(player["oda/R"]*2), // Entry
                                player["multi/R"], // Fragger
                                player.ADR, // Rifler
                                player.SuppR, // Support
                                player["wlp/L"] // Lurker
                            ],
                        areaStyle: {
                            color: new graphic.RadialGradient(0.1, 0.6, 1, [
                                { color: 'rgba(255, 145, 124, 0.5)', offset: 0 },
                                { color: 'rgba(255, 145, 124, 1)', offset: 1 }
                              ])
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