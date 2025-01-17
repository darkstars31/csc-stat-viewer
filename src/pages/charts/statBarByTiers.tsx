import * as React from "react";

import ReactECharts from "echarts-for-react";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import { Player } from "../../models";
import * as Containers from "../../common/components/containers";

type Props = {
	statProperty: string;
	statName?: string;
	playerData?: Player[];
};

export function StatBarByTiers({ statProperty, statName, playerData = [] }: Props) {
	const recruitAverages = getTotalPlayerAverages(playerData, {
		tier: "Recruit",
	});
	const prospectAverages = getTotalPlayerAverages(playerData, {
		tier: "Prospect",
	});
	const contenderAverages = getTotalPlayerAverages(playerData, {
		tier: "Contender",
	});
	const challengerAverages = getTotalPlayerAverages(playerData, {
		tier: "Challenger",
	});
	const eliteAverages = getTotalPlayerAverages(playerData, { tier: "Elite" });
	const premierAverages = getTotalPlayerAverages(playerData, {
		tier: "Premier",
	});

	const emp = {
		focus: "series",
		label: {
			color: "#FFFFFF",
			show: true,
			formatter: function (param: { data: any[] }) {
				return param.data[3];
			},
			position: "top",
		},
	};

	const optionHeadShotTier = {
		title: {
			text: `Low, Avg, Highest ${statName} Percentage by Tier`,
			left: "center",
			textStyle: {
				color: "#FFFFFF",
			},
		},
		legend: {
			data: ["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier"],
			top: 30,
		},
		xAxis: {
			type: "category",
			axisTick: { show: false },
			data: ["Low", "Median", "Average", "High"],
		},
		yAxis: {
			type: "value",
		},
		tooltip: {
			label: {
				formatter: function (param: { data: any[] }) {
					return param.data[3];
				},
			},
		},
		series: [
			{
				name: "Recruit",
				data: [
					recruitAverages.lowest[statProperty],
					recruitAverages.median[statProperty],
					recruitAverages.average[statProperty],
					recruitAverages.highest[statProperty],
				],
				type: "bar",
				emphasis: emp,
			},
			{
				name: "Prospect",
				data: [
					prospectAverages.lowest[statProperty],
					prospectAverages.median[statProperty],
					prospectAverages.average[statProperty],
					prospectAverages.highest[statProperty],
				],
				type: "bar",
				emphasis: emp,
			},
			{
				name: "Contender",
				data: [
					contenderAverages.lowest[statProperty],
					contenderAverages.median[statProperty],
					contenderAverages.average[statProperty],
					contenderAverages.highest[statProperty],
				],
				type: "bar",
				emphasis: emp,
			},
			{
				name: "Challenger",
				data: [
					challengerAverages.lowest[statProperty],
					challengerAverages.median[statProperty],
					challengerAverages.average[statProperty],
					challengerAverages.highest[statProperty],
				],
				type: "bar",
				emphasis: emp,
			},
			{
				name: "Elite",
				data: [
					eliteAverages.lowest[statProperty],
					eliteAverages.median[statProperty],
					eliteAverages.average[statProperty],
					eliteAverages.highest[statProperty],
				],
				type: "bar",
				emphasis: emp,
			},
			{
				name: "Premier",
				data: [
					premierAverages.lowest[statProperty],
					premierAverages.median[statProperty],
					premierAverages.average[statProperty],
					premierAverages.highest[statProperty],
				],
				type: "bar",
				emphasis: emp,
			},
		],
	};

	return (
		<>
			<Containers.StandardContentBox>
				<ReactECharts option={optionHeadShotTier} className="w-full" style={{ height: 500 }} />
			</Containers.StandardContentBox>
		</>
	);
}
