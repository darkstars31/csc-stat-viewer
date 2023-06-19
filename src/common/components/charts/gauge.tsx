import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";

type Props = {
    options?: EChartsOption,
    data?: Record<string,unknown>[],
}

export function Gauge( { options, data }: Props) {
        const defaultOptions = {
            darkMode: true,
            series: [
              {
                axisLine: {
                    lineStyle: {
                      width: 40
                    }
                  },
                  splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    show: false,
                    distance: 50
                  },
                  detail: {
                    width: 50,
                    height: 14,
                    fontSize: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                    formatter: '{value}%'
                  },
                data: [ 
                    { name: "Pit", value: .4, title: { offset: ['0%','30%'] } }, 
                    { value: .9 },
                    { name: "Rating", value: 1 },
                    { value: 1.1 },
                    { name: "Peak", value: 1.41 },
                ],
                ...data,
                min: 0,
                max: 3,
                type: "gauge",
                startAngle: 210,
                endAngle: 330,
                pointer: { show: false },
                progress: { 
                    show: true,
                    roundCap: true,
                    clip: false,
                },
              }
            ],
            ...options, 
          };

    return (
        <ReactECharts option={defaultOptions} style={{height: 300}} />
    )
}