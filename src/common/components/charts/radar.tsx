import { EChartsOption } from "echarts";
import * as React from "react";
import useEcharts from "react-hooks-echarts";

type Props = {
    options: EChartsOption
}

export function PlayerRadar( { options }: Props) {
    const [chartRef, ref ] = useEcharts();

    React.useEffect(() => {
        const chart = chartRef.current;
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
            //...options
          };
          chart?.setOption( { ...defaultOptions } );

    }, [ chartRef, options ] );

    return (
        <div ref={ref} className="chart" style={{ height: 300}}></div>
    )
}