import * as React from "react";
import { EChartsOption } from "echarts-for-react";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages, statDescriptionsShort } from "../../common/utils/player-utils";
import { Player } from "../../models/player";
import ReactECharts from "echarts-for-react";
import { getPlayerPercentileStatInTier } from "../../common/utils/player-utils";
import { type CscStats } from "../../models";

export function PlayerCompareRadar({
	selectedPlayers,
	tier,
	statOptions,
	startAngle = 90,
}: {
	selectedPlayers: Player[];
	tier: string;
	statOptions: string[];
	startAngle: number;
}) {
	const { players } = useDataContext();
	const playerAverages = getTotalPlayerAverages(players, { tier: tier });
	const tierAveragePlayer = {
		name: `${tier} Average`,
		tier: { name: tier },
		stats: { name: `${tier} Average`, ...playerAverages.average },
	} as unknown as Player;

	const tierAverageValues = {
		name: `${tier} Average`,
		lineStyle: {
			width: 1,
			type: "dotted",
		},
		value: statOptions.map(stat =>
			getPlayerPercentileStatInTier(tierAveragePlayer, [...players, tierAveragePlayer], stat as keyof CscStats),
		),
		label: {
			show: true,
			formatter: function (params: { value: any }) {
				return params.value;
			},
		},
	};

	const selectedPlayerValues = selectedPlayers.map(player => ({
		name: player.name,
		value: statOptions.map(stat => getPlayerPercentileStatInTier(player, Object.values(player.statsOutOfTier ?? {})
			.some( i => i.tier === player.tier.name) ? 
			[ ...players, player] 
			: players, stat as keyof CscStats)),
		label: {
			show: true,
			formatter: function (params: { value: any }) {
				return params.value;
			},
		},
	}));

	const options: EChartsOption = {
		legend: {
			data: [...selectedPlayers.map(player => `${player.name}`), `${tier} Average`],
			textStyle: {
				color: "#B9B8CE",
			},
		},
		darkMode: true,
		radar: {
			radius: "75%",
			startAngle,
			label: {
				show: true,
			},
			shape: "circle",
			indicator: statOptions.map(stat => ({
				name: statDescriptionsShort[stat],
				max: 100,
				min: 0,
			})),
			toolTip: {
				show: true,
			},
			gradientColor: ["#f6efa61", "#d882732", "#bf444c"],
			splitNumber: 4,
			axisNameGap: 15,
			splitArea: {
				areaStyle: {
					color: ["#0c0c18", "#0f0f1c", "#111121", "#131325"],
					shadowColor: "rgba(0, 0, 0, 0.2)",
					shadowBlur: 10,
				},
			},
			axisLabel: {
				show: false, // Numbers inside radar for each "step"
			},
			axisLine: {
				show: true,
				lineStyle: {
					width: 1,
					color: "#4D4D4D",
					type: "dashed",
				},
				onZero: true,
			},
			splitLine: {
				lineStyle: {
					color: "#4D4D4D",
				},
			},
		},
		axisName: {
			color: "#fff",
			backgroundColor: "#666",
			borderRadius: 0,
			padding: [3, 5],
		},
		series: [
			{
				emphasis: {
					show: false,
					label: {
						fontSize: 20,
					},
					lineStyle: {
						width: 8,
					},
				},
				label: {
					position: "top",
				},
				select: {},
				selectedMode: "single",
				name: "X",
				type: "radar",
				data: [...selectedPlayerValues, tierAverageValues],
			},
		],
	};

	return <ReactECharts option={options} style={{ height: "700px", width: "100%" }} />;
}
