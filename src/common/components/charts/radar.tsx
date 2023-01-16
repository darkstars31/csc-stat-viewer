import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";


type Props = {
    options: EChartsOption
}

export function PlayerRadar( { options }: Props) {
        const defaultOptions = {
            radar:{
                indicator: [
                    { name: "placeholder", max: "100"},
                    { name: "placeholder", max: "100"},
                    { name: "placeholder", max: "100"}
                ]
            },
            series: [
              {
                data: [150, 230, 224,],
                type: "radar"
              }
            ],
            ...options
          };


    return (
        <ReactECharts option={defaultOptions} />
    )
}