import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";

type Props = {
    options: EChartsOption,
}

export function PieChart( { options }: Props) {
        
        const defaultOptions: EChartsOption = {
            color: ['#4169e1','#ff6347'],
            tooltip: {
              trigger: 'item'
            },
            legend: {
              show: false,
              top: '0%',
              left: 'center'
            },
            series:
              {
                name: '',
                type: 'pie',
                radius: ['0%', '50%'],
                center: ['50%', '40%'],
                startAngle: 230,
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 6,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: true,
                  formatter: ( item ) =>{
                    return `${item.name} - ${item.value}`;
                  },
                  position: 'inner',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 30,
                    fontWeight: 'bold'
                  }
                },
                labelLine: { 
                  show: true
                },
                data: [],
              }
            ,
            ...options
          };
          console.info( defaultOptions.series );

    return (
        <ReactECharts option={defaultOptions} />
    )
}