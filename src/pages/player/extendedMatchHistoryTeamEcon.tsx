
import * as React from "react";
import { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

export const ExtendedMatchHistoryTeamEcon = ({ extendedMatchData }: { extendedMatchData: any }) => {

    const rounds = extendedMatchData?.data.rounds;
    const teamHome = rounds.map( (round: { teamAEquipmentValue: number; }) => round.teamAEquipmentValue)
    const teamAway = rounds.map( (round: { teamBEquipmentValue: number; }) => round.teamBEquipmentValue)

    const datasetWithFilters = [];
    const defaultOptions: EChartsOption = {
        animationDuration: 2500,
        title: {
            text: 'Team Equipment Values',
            textStyle: {
                color: '#fff'
            }
          },
        legend: {
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis',
        },
		xAxis: {
            type: 'category',
            data: [...Array(rounds.length).keys()],
          },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Team Away',
                data: teamAway,
                type: 'line',
                color: '#fb923c'
            },
            {
                name: 'Team Home',
                data: teamHome,
                type: 'line',
                color: '#818cf8'
            },
        ]
	};

    return <ReactECharts option={defaultOptions} style={{ height: "320px", width: "100%" }} />;
}