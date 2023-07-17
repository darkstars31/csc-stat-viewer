import * as React from "react";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import { Player } from "../../models";
import ReactECharts from "echarts-for-react";
import { linearRegression, linearRegressionLine } from "simple-statistics";

type Props = {
    playerData?: Player[];
}

export function CartesianCompare( { playerData = [] }: Props) {

    const data = playerData.map( p => ( [p.stats?.rating, p.mmr, p.tier.name, p.name]));
    const x = playerData.map( p => ( [p.stats.rating!, p.mmr!]));
    console.info(x)
    const linearRegressionExpression = linearRegression( x );
    const linearRegressionLinex = linearRegressionLine( linearRegressionExpression );

    console.info(linearRegressionExpression, linearRegressionLinex, linearRegressionLinex(0), linearRegressionLinex(1.5));

    const seriesSettings = ( datasetIndex: number) => ({
        symbolsize: 60,
        datasetIndex: datasetIndex,
        type: "scatter",
        emphasis: {
            focus: 'series',
            label: {
                color: '#FFFFFF',
                show: true,
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
                position: 'top',
            }
          },
    });

    const optionRatingMMR = {
        backgroundColor: '#090917',
        title: {
            text: 'MMR and Rating per Tier',
            textStyle: {
                color: '#FFFFFF',
            },
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier', 'Linear Regression'],
            top: 30,
            textStyle: {
              color: "#fff",
              fontSize: 12,
            },
            // itemStyle: {
            //   color: '#FFFFFF',
            // },
            // lineStyle: {
            //   color: '#FFFFFF',
            // },
            inactiveColor: "gray"
        },
        toolbox: {
          feature: {
            saveAsImage:{
                title: "Save Image",
                show: true,
                type: 'png',
            },
          }  
        },
        dataset: [ { source: data ?? [], },
            { transform: { type: 'filter', config: { dimension: 2, eq: "Recruit"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Prospect"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Contender"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Challenger"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Elite"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Premier"}}},
            { transform: { type: 'ecStat:regression'
                  // 'linear' by default.
                  // config: { method: 'linear', formulaOn: 'end'}
                }
              }
        ],
        dataZoom: [
            {
              type: 'inside',
            },
            {
              type: 'slider',
              showDataShadow: true,
            //   handleIcon:
            //     'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '100%'
            },
            {
              type: 'inside',
              orient: 'vertical'
            },
            {
              type: 'slider',
              orient: 'vertical',
              showDataShadow: true,
            //   handleIcon:
            //     'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '100%'
            }
        ],
        xAxis: {
            max: Number((getTotalPlayerAverages(playerData ?? []).highest.rating + 0.05).toFixed(1)),
            min: Number((getTotalPlayerAverages(playerData ?? []).lowest.rating - 0.05).toFixed(1)),
            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `#383838`
                }
              }
        },
        yAxis: {

            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `#383838`
                }
              }
        },
        tooltip: {
            show: true,
            label: {
                formatter: function (param: { data: any[]; }) {

                    return `${param.data[3]}`;
                },
            }
        },
        series: [ { 
            name: "Recruit", ...seriesSettings(1),
            // tooltip: {
            //     show: true,
            //     position: ['50%','50%'],
            //     formatter: function (param: { data: any[]; }) {
            //         return `${param.data[3]}<br />Rating: ${param.data[0].toFixed(2)}<br />MMR: ${param.data[1]}`;
            //     }
            // }
        },
        { 
            name: "Prospect", ...seriesSettings(2),
        },
        { 
            name: "Contender", ...seriesSettings(3),
        },
        { 
            name: "Challenger", ...seriesSettings(4),
        },
        { 
            name: "Elite", ...seriesSettings(5),
        },
        { 
            name: "Premier", ...seriesSettings(6),
        },
        { 
            name: "Linear Regression",
            color: "purple",
            symbolsize: 60,
            lineStyle: {
              type: 'dashed',
            },
            data: [
              [Number((getTotalPlayerAverages(playerData ?? []).lowest.rating - 0.05).toFixed(1)),linearRegressionLinex(0)],
              [Number((getTotalPlayerAverages(playerData ?? []).highest.rating + 0.05).toFixed(1)),linearRegressionLinex(1.5)],
            ],
            type: "line",
            //emphasis: emp,
        },
    ],
  
    };

    return (
        <div className='py-4'>
            <ReactECharts option={optionRatingMMR} style={{height: 600}} />
        </div>
    );
}