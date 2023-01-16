import { EChartsOption } from "echarts";
import * as React from "react";
import useEcharts from "react-hooks-echarts";


export function PieChart( options: EChartsOption) {
    const [chartRef, ref ] = useEcharts();

    React.useEffect(() => {
        const chart = chartRef.current;
        chart?.setOption({
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
                radius: ['40%', '70%'],
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
                  show: false
                },
                data: [
                  { value: 1048, name: 'CT' },
                  { value: 735, name: 'T' },
                ]
              }
            ],
            //...options
          });
    });

    return (
        <div ref={ref} className="chart" style={{ height: 300}} ></div>
    )
}