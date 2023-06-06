import { EChartsOption, graphic } from "echarts";
import * as React from "react";
import { PlayerStats } from "../../models";
import { PlayerRadar } from "./charts/radar";
import { clamp } from "lodash";

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
                        value: [ clamp(player["awp/R"],0, .6), // Awper
                                clamp(player.ODR*(player["oda/R"]*2), 0, 1.1), // Entry
                                clamp(player["multi/R"]+player["entries/R"]*4, 0, 1.1), // Fragger
                                clamp(player.ADR, 0, 220), // Rifler
                                clamp((player.SuppR*10)+player.SuppXr, 0, 55), // Support
                                clamp(player["wlp/L"], 0, 5), // Lurker
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