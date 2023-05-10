import { EChartsOption, graphic } from "echarts";
import * as React from "react";
import { PlayerStats } from "../../models";
import { PlayerRadar } from "./charts/radar";

type Props = {
    player: PlayerStats,
}

export function RoleRadar( { player }: Props ){
    const options: EChartsOption = {
            //legend: { data: ["Role"] },
            darkMode: true,
            radar:{
                //shape: "circle",
                indicator: [
                    { name: "Awper", max: .55 },
                    { name: "Entry", max: 1 },
                    { name: "Fragger", max: 1 },
                    { name: "Rifler", max: 200 },
                    { name: "Support", max: 50 },
                    { name: "Lurker", max: 4 },
                ]
            },
            series: [ 
                {
                name: "X",
                type: 'radar',
                data: [
                    { 
                        symbol: "none",
                        name: "Role", 
                        value: [ player["awp/R"], // Awper
                                player.ODR*(player["oda/R"]*2), // Entry
                                player["multi/R"]+player["entries/R"]*4, // Fragger
                                player.ADR, // Rifler
                                (player.SuppR*10)+player.SuppXr, // Support
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