import * as React from "react";
import { PlayerStats } from "../../models";
import { Gauge } from "./charts/gauge";

type Props = {
    player: PlayerStats
}

export function PlayerGauge( { player }: Props ) {
    const gaugeData = [
        { name: "Pit", value: player?.Pit },
        { value: (player?.CONCY ?? 0).toFixed(2) },
        { name: "Rating", value: player?.Rating },
        { value: (player?.CONCY ?? 0).toFixed(2) },
        { name: "Peak", value: player?.Peak },
    ].map( (item,index) => (
        {   ...item,
            title: { offsetCenter: [`${index*7-14}0%`,'40%']},
            detail: { valueAnimation: true, offsetCenter: [`${index*7-14}0%`,'20%']}
        }
    ));
    const options = {
        darkMode: true,
        color: ['salmon','gray','yellow','gray','lime'],
        textStyle: {
            color: '#B9B8CE'
        },
        series: [ {
                type: 'gauge',
                startAngle: 140,
                endAngle: 400,
                max: 2,
                min: 0,
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 10
                    }
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                progress: { 
                    show: true,
                    roundCap: true,
                    clip: false,
                },
                detail: {
                    width: 50,
                    height: 14,
                    fontSize: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                    formatter: '{value}'
                },
                data: gaugeData,
            }
        ]
    }
    return ( 
        // @ts-ignore: wtf
        <Gauge options={options} />
    );
}