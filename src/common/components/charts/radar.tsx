import * as React from "react";
import useEcharts from "react-hooks-echarts";

export function PlayerRadar() {
    const [chartRef, ref ] = useEcharts();

    React.useEffect(() => {
        const chart = chartRef.current;
        console.info( chart );
        chart?.setOption({
            xAxis: {
              type: "category",
              data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: "line"
              }
            ]
          });
    });

    return (
        <div ref={ref} className="chart" style={{ height: 300}} ></div>
    )
}