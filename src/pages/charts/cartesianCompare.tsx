import * as React from "react";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import { Player } from "../../models";
import ReactECharts from "echarts-for-react";
import { linearRegression, linearRegressionLine, max, min } from "simple-statistics";
import * as Containers from "../../common/components/containers";
import { Toggle } from "../../common/components/toggle";

type Props = {
	playerData?: Player[];
};

export function CartesianCompare({ playerData = [] }: Props) {
	const [extraFilters, setExtraFilters] = React.useState<{
		minGamesPlayed: number;
	}>({ minGamesPlayed: 0 });
	const [isHltvRating, setIsHltvRating] = React.useState(false);

	const getPreferredRating = (p: Player) => (isHltvRating ? p.hltvTwoPointO! : p.stats?.rating);

	const filteredPlayers = playerData.filter(p => p.stats?.gameCount >= extraFilters.minGamesPlayed);

	const data = filteredPlayers.map(p => [getPreferredRating(p), p.mmr, p.tier.name, p.name, p]);
	const playerTotalStats = getTotalPlayerAverages(playerData ?? []);

	const ratingMmrPairs = playerData.map(p => [getPreferredRating(p), p.mmr!]);
	const linearRegressionFunction = linearRegression(ratingMmrPairs);
	const linearRegressionLineFunction = linearRegressionLine(linearRegressionFunction);

	const xmin =
		isHltvRating ?
			min(playerData.map(p => p.hltvTwoPointO!))
		:	Number((playerTotalStats?.lowest.rating).toFixed(2));
	const xmax =
		isHltvRating ?
			max(playerData.map(p => p.hltvTwoPointO!))
		:	Number((playerTotalStats?.highest.rating).toFixed(2));

	const highest = playerTotalStats.highest.rating ? xmax + 0.05 : 0;
	const lowest = playerTotalStats.lowest.rating ? xmin - 0.05 : 0;

	const seriesSettings = (datasetIndex: number) => ({
		symbolsize: 60,
		datasetIndex: datasetIndex,
		type: "scatter",
		symbolSize: 8,
		select: {
			selectedMode: "multiple",
		},
		emphasis: {
			focus: "series",
			label: {
				color: "#FFFFFF",
				show: true,
				formatter: function (param: { data: any[] }) {
					return param.data[3];
				},
				position: "top",
			},
		},
		tooltip: {
			show: true,
			triggerOn: "none",
			showContent: true,
			alwaysShowContent: true,
			enterable: true,
			renderMode: "html",
			backgroundColor: "rgba(10,10,10,1)",
			position: ["11%", "11%"],
			formatter: function (param: { data: any[] }) {
				return `<b>${param.data[3]}</b><br />${isHltvRating ? "HLTV Rating" : "Rating"}: ${param.data[0].toFixed(2)}<br />MMR: ${param.data[1]}`;
			},
		},
	});

	const optionRatingMMR = {
		backgroundColor: "#090917",
		title: {
			text: "MMR and Rating per Tier",
			textStyle: {
				color: "#FFFFFF",
			},
			left: "center",
		},
		legend: {
			data: ["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier", "Linear Regression"],
			top: 30,
			textStyle: {
				color: "#fff",
				fontSize: 12,
			},
			inactiveColor: "gray",
		},
		toolbox: {
			feature: {
				saveAsImage: {
					title: "Save Image",
					show: true,
					type: "png",
				},
			},
		},
		dataset: [
			{ source: data ?? [] },
			{
				transform: { type: "filter", config: { dimension: 2, eq: "Recruit" } },
			},
			{
				transform: { type: "filter", config: { dimension: 2, eq: "Prospect" } },
			},
			{
				transform: {
					type: "filter",
					config: { dimension: 2, eq: "Contender" },
				},
			},
			{
				transform: {
					type: "filter",
					config: { dimension: 2, eq: "Challenger" },
				},
			},
			{ transform: { type: "filter", config: { dimension: 2, eq: "Elite" } } },
			{
				transform: { type: "filter", config: { dimension: 2, eq: "Premier" } },
			},
		],
		dataZoom: [
			{
				type: "inside",
			},
			{
				type: "slider",
				showDataShadow: true,
				//   handleIcon:
				//     'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: "100%",
			},
			{
				type: "inside",
				orient: "vertical",
			},
			{
				type: "slider",
				orient: "vertical",
				showDataShadow: true,
				//   handleIcon:
				//     'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: "100%",
			},
		],
		xAxis: {
			max: highest,
			min: lowest,
			splitLine: {
				lineStyle: {
					type: "dashed",
					color: `#383838`,
				},
			},
			axisLabel: {
				formatter: function (value: number) {
					return value.toFixed(2);
				},
			},
		},
		yAxis: {
			splitLine: {
				lineStyle: {
					type: "dashed",
					color: `#383838`,
				},
			},
		},
		tooltip: {
			show: false,
			trigger: "item",
			label: {
				formatter: function (param: { data: any[] }) {
					console.info(param);
					return `${param.data[3]} ${param.data[2]}`;
				},
			},
		},
		series: [
			{
				name: "Recruit",
				...seriesSettings(1),
			},
			{
				name: "Prospect",
				...seriesSettings(2),
			},
			{
				name: "Contender",
				...seriesSettings(3),
			},
			{
				name: "Challenger",
				...seriesSettings(4),
			},
			{
				name: "Elite",
				...seriesSettings(5),
			},
			{
				name: "Premier",
				...seriesSettings(6),
			},
			{
				name: "Linear Regression",
				color: "purple",
				symbolSize: 4,
				animationEasing: "cubicIn",
				lineStyle: {
					type: "dashed",
				},
				data: [
					[lowest, linearRegressionLineFunction(lowest)],
					[highest, linearRegressionLineFunction(highest)],
				],
				type: "line",
			},
		],
	};

	return (
		<>
			<Containers.StandardContentBox>
				<ReactECharts option={optionRatingMMR} className="w-full pr-4" style={{ height: 600 }} />
			</Containers.StandardContentBox>
			<div className="m-2">
				<Containers.ChartButtonBoundingBox>
					<Containers.ChartButtonBox>
						<div className="flex flex-row">
							<Toggle checked={isHltvRating} onChange={() => setIsHltvRating(!isHltvRating)} />
							HLTV Rating
						</div>
					</Containers.ChartButtonBox>
					<Containers.ChartButtonBox>
						<label htmlFor="customRange1" className="flex text-neutral-700 dark:text-neutral-200">
							Minimum Games Played ({extraFilters.minGamesPlayed})
						</label>
						<input
							type="range"
							min="0"
							max="12"
							step="1"
							className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
							id="customRange1"
							value={extraFilters.minGamesPlayed}
							onChange={e =>
								setExtraFilters({
									...extraFilters,
									minGamesPlayed: Number(e.target.value),
								})
							}
						/>
					</Containers.ChartButtonBox>
				</Containers.ChartButtonBoundingBox>
			</div>
		</>
	);
}
