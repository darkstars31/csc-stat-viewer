
import * as React from "react";
import { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

export const ExtendedMatchHistoryTeamEcon = ({ extendedMatchData }: { extendedMatchData: any }) => {

    const rounds = extendedMatchData?.data.rounds;
    const teamHome = rounds.map( (round: { teamAEquipmentValue: number; }) => round.teamAEquipmentValue)
    const teamAway = rounds.map( (round: { teamBEquipmentValue: number; }) => round.teamBEquipmentValue)

    const teamHomeRoundMark = rounds.map( (round: any) => round.teamASide === round.winnerSide ? ([{xAxis: round.number-1},{ xAxis: round.number}]) : null)
    const teamAwayRoundMark = rounds.map( (round: any) => round.teamBSide === round.winnerSide ? ([{xAxis: round.number-1},{ xAxis: round.number}]) : null)


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
                symbolSize: 10,
                data: teamAway,
                type: 'line',
                color: '#fb923c',
                markArea: {
                    itemStyle: {
                        color: '#4b2b12'
                    },
                    data: teamAwayRoundMark.filter((x: any) => x !== null)
                }
            },
            {
                name: 'Team Home',
                symbolSize: 10,
                data: teamHome,
                type: 'line',
                color: '#6976f7',
                markArea: {
                    itemStyle: {
                        color: '#262a4a'
                    },
                    data: teamHomeRoundMark.filter((x: any) => x !== null)
                }
            },
        ]
	};

    return <ReactECharts option={defaultOptions} style={{ height: "320px", width: "100%" }} />;
}