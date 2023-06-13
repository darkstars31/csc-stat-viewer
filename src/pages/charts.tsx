import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import ReactECharts from "echarts-for-react";
import { getTotalPlayerAverages } from '../common/utils/player-utils';

export function Charts() {
    const { players } = useDataContext();
    const playersWithStats = players.filter( p => p.stats );

    if( playersWithStats.length === 0) {
        return <div>Loading</div>;
    }

    const data = playersWithStats.map( p => ( [p.stats?.Rating, p.mmr, p.tier.name, p.name]));

    const emp = {
        focus: 'series',
        label: {
            color: '#FFFFFF',
            show: true,
            formatter: function (param: { data: any[]; }) {
                return param.data[3];
            },
            position: 'top',
        }
      };

    const optionRatingMMR = {
        title: {
            text: 'Rating and MMR per Tier',
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier'],
            top: 30
        },
        dataset: [ { source: data ?? [], },
            { transform: { type: 'filter', config: { dimension: 2, eq: "Recruit"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Prospect"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Contender"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Challenger"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Elite"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Premier"}}},
        ],
        dataZoom: [
            {
              type: 'inside'
            },
            {
              type: 'slider',
              showDataShadow: false,
              handleIcon:
                'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%'
            },
            {
              type: 'inside',
              orient: 'vertical'
            },
            {
              type: 'slider',
              orient: 'vertical',
              showDataShadow: false,
              handleIcon:
                'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%'
            }
        ],
        xAxis: {
            min: .3,
            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `gray`
                }
              }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `gray`
                }
              }
        },
        tooltip: {
            label: {
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
            }
        },
        series: [ { 
            name: "Recruit",
            symbolsize: 40,
            datasetIndex: 1,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Prospect",
            symbolsize: 60,
            datasetIndex: 2,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Contender",
            symbolsize: 60,
            datasetIndex: 3,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Challenger",
            symbolsize: 60,
            datasetIndex: 4,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Elite",
            symbolsize: 60,
            datasetIndex: 5,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Premier",
            symbolsize: 60,
            datasetIndex: 6,
            type: "scatter",
            emphasis: emp,
        },
    ],
  
    };

    const optionHeadShotTier =  {
        title: {
            text: 'Low, Avg, Highest Headshot Percentage by Tier',
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier'],
            top: 30
        },
        xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: ['Low', 'Avg', 'High',]
        },
        yAxis: {
            type: "value"
        },
        tooltip: {
            label: {
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
            }
        },
        series: [ { 
            name: "Recruit",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Recruit"}).lowest["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Recruit"}).average["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Recruit"}).highest["HS"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Prospect",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Prospect"}).lowest["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Prospect"}).average["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Prospect"}).highest["HS"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Contender",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Contender"}).lowest["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Contender"}).average["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Contender"}).highest["HS"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Challenger",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Challenger"}).lowest["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Challenger"}).average["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Challenger"}).highest["HS"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Elite",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Elite"}).lowest["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Elite"}).average["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Elite"}).highest["HS"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Premier",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Premier"}).lowest["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Premier"}).average["HS"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Premier"}).highest["HS"]
            ],
            type: "bar",
            emphasis: emp,
        },
        
    ],
    };

    const optionUtils =  {
        title: {
            text: 'Util Thrown by Tier',
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier'],
            top: 30
        },
        xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: ['Low', 'Avg', 'High',]
        },
        yAxis: {
            type: "value"
        },
        tooltip: {
            label: {
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
            }
        },
        series: [ { 
            name: "Recruit",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Recruit"}).lowest["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Recruit"}).average["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Recruit"}).highest["Util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Prospect",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Prospect"}).lowest["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Prospect"}).average["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Prospect"}).highest["Util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Contender",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Contender"}).lowest["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Contender"}).average["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Contender"}).highest["Util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Challenger",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Challenger"}).lowest["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Challenger"}).average["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Challenger"}).highest["Util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Elite",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Elite"}).lowest["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Elite"}).average["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Elite"}).highest["Util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Premier",
            data: [ getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Premier"}).lowest["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Premier"}).average["Util"],
                getTotalPlayerAverages(playersWithStats.map( p => p.stats!), { tier: "Premier"}).highest["Util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        
    ],
    };

    return (
        <Container>
            <div>
                Did someone say data? (This page is a work in progress)
            </div>
            <div>
                <ReactECharts option={optionRatingMMR} style={{height: 600}} />
            </div>
            <div>
                <ReactECharts option={optionHeadShotTier} style={{height: 500}} />
            </div>
            <div>
                <ReactECharts option={optionUtils} style={{height: 500}} />
            </div>
        </Container>
    );
}