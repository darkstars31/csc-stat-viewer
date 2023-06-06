import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { PlayerStats } from "../../models";

type Props = {
    player: PlayerStats,
}

export function KillsAssistsDeathsPie( { player }: Props) {
        
        const defaultOptions: EChartsOption = {
            color: ['#2dd4bf', '#fde047', '#ff6347'],
            title: {
                text: 'Kills/Assists/Deaths',
                top: '16px',
                textStyle: {
                    color: '#fff'
                },
                show: false,
                //subtext: 'Fake Data',
                left: 'center'
              },
            series:
              {
                //width: '200px',
                height: '200px',
                name: 'Rating',
                type: 'pie',
                radius: ['0%', '55%'],
                center: ['50%', '52%'],
                startAngle: -120,
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 4,
                  borderColor: '#1d1d31',
                  borderWidth: 2,
                  
                },
                label: {
                  show: true,
                  formatter: ( item ) =>{
                    //const percent = (Number(item.value)/(player["Kills"]+player["Assists"]+player["Deaths"])*100).toFixed(2);
                    return `${item.name}\n${item.value}`;
                  },
                  fontSize: 18,
                  color: '#fff'
                  //position: 'outer',
                },
                emphasis: {
                  label: {
                    show: true,
                    //fontSize: 24,
                    //fontWeight: 'normal',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(255,255,255, 0.5)'
                  }
                },
                labelLine: { 
                  show: true
                },
                data: [
                    { name: "Kills", value: player["Kills"]},
                    { name: "Assists", value: player['Assists']},
                    { name: "Deaths", value: player['Deaths']},

                ],
              }
            ,
          };

    return (
        <ReactECharts option={defaultOptions} style={{height: "180px",width: "100%"}}/>
    )
}