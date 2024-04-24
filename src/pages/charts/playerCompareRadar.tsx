import * as React from "react";
import { EChartsOption } from "echarts-for-react";
import { useDataContext } from "../../DataContext";
import { PlayerMappings, getTotalPlayerAverages } from "../../common/utils/player-utils";
import { Player } from "../../models/player";
import ReactECharts from "echarts-for-react";
import { getPlayerPercentileStatInTier } from "../../common/utils/player-utils";
import { type CscStats } from "../../models";



export function PlayerCompareRadar( { selectedPlayers, tier, statOptions }: { selectedPlayers: Player[], tier: string, statOptions: string[] } ) {
    const { players } = useDataContext();
    const playerAverages = getTotalPlayerAverages(players, { tier: tier });
    const tierAveragePlayer = { name: `${tier} Average`, tier: { name: tier }, stats: { name: `${tier} Average`, ...playerAverages.average} } as unknown as Player;

    const tierAverageValues = { 
        name: `${tier} Average`,
        lineStyle: {
            type: 'dashed'
        },
        value: statOptions.map( (stat) => getPlayerPercentileStatInTier( tierAveragePlayer, [...players, tierAveragePlayer], stat as keyof CscStats)),
        label: {
            show: true,
            formatter: function (params: { value: any; }) {
              return params.value;
            }
        }
    };

    const selectedPlayerValues = selectedPlayers.map( player => 
    ({ 
        name: player.name, 
        value: statOptions.map( (stat) => getPlayerPercentileStatInTier(player, players, stat as keyof CscStats)),
        label: {
            show: true,
            formatter: function (params: { value: any; }) {
                return params.value;
            }
        }
    }));
  
    const options: EChartsOption = {
        legend: { data: [...selectedPlayers.map( player => player.name), `${tier} Average`],
            textStyle: {
                color: "#B9B8CE",
            },
          },
        darkMode: true,
        radar:{
            label:{
                show: true
            },
            shape: "circle",
            indicator: statOptions.map( (stat) => ({ name: PlayerMappings[stat], max: 100, min: 0})),
            toolTip:{
                show: true,
            },
            splitArea: {
                areaStyle: {
                    color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                  color: 'rgba(211, 253, 250, 0.8)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(211, 253, 250, 0.8)'
                }
              },
        },
        axisName: {
            color: '#fff',
            backgroundColor: '#666',
            borderRadius: 0,
            padding: [3, 5]
        },
        series: [ 
            {
            emphasis: {
                show: false,
                label: {
                    fontSize: 20
                },
                
                lineStyle: {
                    width: 7,
                }
            },
            select: {
            },
            selectedMode: 'single',
            name: "X",
            type: 'radar',
            data: [
                ...selectedPlayerValues,
                tierAverageValues,
                 ] 
            }
        ],
    };

return (
    <ReactECharts option={options} style={{height: "800px",width: "100%"}}/>
);


}