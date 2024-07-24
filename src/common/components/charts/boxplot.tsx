import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";

type Props = {
	options?: EChartsOption;
};

export function BoxPlot({ options }: Props) {
	const defaultOptions: EChartsOption = {
		darkMode: true,
		title: [
			{
				text: "Rating",
				left: "center",
			},
		],
		dataset: [
			{
				// prettier-ignore
				source: [
                          [.6, .95, 1, 1.05, 1.22],
                          [.4, .91, 1.01, 1.09, 1.1],
                      ],
			},
			{
				transform: {
					type: "boxplot",
					config: {
						itemNameFormatter: function (params: Record<string, unknown>) {
							return "expr " + params?.value;
						},
					},
				},
			},
			{
				fromDatasetIndex: 1,
				fromTransformResult: 1,
			},
		],
		tooltip: {
			trigger: "item",
			axisPointer: {
				type: "shadow",
			},
		},
		grid: {
			left: "10%",
			right: "10%",
			bottom: "15%",
		},
		yAxis: {
			type: "category",
			boundaryGap: true,
			nameGap: 10,
			splitArea: {
				show: false,
			},
			splitLine: {
				show: false,
			},
		},
		xAxis: {
			type: "value",
			name: "",
			splitArea: {
				show: true,
			},
		},
		series: [
			{
				name: "boxplot",
				type: "boxplot",
				boxWidth: [5, 20],
				encode: {
					x: ["Pit", "Consistency", "Rating", "Consistency", "Peak"],
					y: "Rating",
				},
				datasetIndex: 1,
			},
			{
				name: "outlier",
				type: "scatter",
				encode: { x: 1, y: 0 },
				datasetIndex: 2,
			},
		],
		...options,
	};

	return <ReactECharts option={defaultOptions} style={{ height: 150 }} />;
}
