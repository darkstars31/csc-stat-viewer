import { EChartsOption, graphic } from "echarts";
import * as React from "react";
import { PlayerRadar } from "./charts/radar";
import { clamp } from "lodash";
import { CscStats } from "../../models";

type Props = {
    stats: CscStats,
}

const multiplier = 1.5;

export function RoleRadar( { stats }: Props ){
    const options: EChartsOption = {
            //legend: { data: ["Role"] },
            darkMode: true,
            radar:{
                //shape: "circle",
                indicator: [
                    { name: "Awper", max: .55 },
                    { name: "Entry", max: .95 },
                    { name: "Fragger", max: 1.3 },
                    { name: "Rifler", max: 230 },
                    { name: "Support", max: 50 },
                    //{ name: "Lurker", max: 4 },
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
                        value: [ clamp(stats["awpR"]*multiplier,0, .56), // Awper
                                clamp(stats.odr*(stats["odaR"]*2*multiplier), 0, 1), // Entry
                                clamp(stats["multiR"]*multiplier, 0, 1.3), // Fragger
                                clamp(stats.adr*multiplier, 0, 230), // Rifler
                                clamp(((stats.suppR*10)+stats.suppXR)*multiplier, 0, 55), // Support
                                // clamp(player.stats["wlp/L"], 0, 5), // Lurker
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