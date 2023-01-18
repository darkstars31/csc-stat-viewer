import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";

type Props = {
    options: EChartsOption
}

export function Scatter( { options }: Props) {
        const defaultOptions = {
            series: [
              {
                data: [150, 230, 224,],
                type: "scatter"
              }
            ],
            ...options
          };


    return (
        <ReactECharts option={defaultOptions} style={{height: 300}} />
    )
}