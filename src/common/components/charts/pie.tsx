import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";

type Props = {
    options: EChartsOption,
}

export function PieChart( { options }: Props) {

        const defaultOptions: EChartsOption = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '0%',
              left: 'center'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['0%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                  }
                },
                labelLine: { 
                  show: true
                },
                data: [
                  { value: 3.14, name: 'CT' },
                  { value: 7, name: 'T' },
                ]
              }
            ],
            ...options
          };
          console.info( defaultOptions.series );

    return (
        <ReactECharts option={defaultOptions} />
    )
}