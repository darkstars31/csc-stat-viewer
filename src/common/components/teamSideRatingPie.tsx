import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { PlayerStats } from "../../models";

type Props = {
    player: PlayerStats,
}

export function TeamSideRatingPie( { player }: Props) {
        
        const defaultOptions: EChartsOption = {
            color: ['#4169e1','#ff6347'],
            title: {
                text: 'Team Rating',
                top: '16px',
                textStyle: {
                    color: '#fff'
                },
                //subtext: 'Fake Data',
                left: 'center'
              },
            series:
              {
                //width: '250px',
                name: 'Rating',
                type: 'pie',
                radius: ['0%', '55%'],
                center: ['50%', '40%'],
                startAngle: 180,
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 4,
                  borderColor: 'none',
                  borderWidth: 2
                },
                label: {
                  show: true,
                  formatter: ( item ) =>{
                    return `${item.name}\n${item.value}`;
                  },
                  position: 'inner',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold'
                  }
                },
                labelLine: { 
                  show: true
                },
                data: [
                    { name: "CT", value: player['CT #']},
                    { name: "T", value: player['T #']},
                    { name: "", value: player['CT #'] + player['T #'], 
                        itemStyle: { color: 'none'}, 
                        label: { show: false }
                    },
                ],
              }
            ,
          };

    return (
        <ReactECharts option={defaultOptions} />
    )
}