import React from "react";
import { Player } from "../../models";
import * as Containers from "../../common/components/containers";
import ReactECharts from "echarts-for-react";
import { googleSheetsUrl } from "../../dataConfig";
import papa from "papaparse";


export function DistributionCurves( { playerData }: { playerData: Player[] } ) {
    const [rtl, setRtl] = React.useState("");
    const json = papa.parse<{ MMR: string}>( rtl, { header: true } ).data.flatMap( p => parseInt(p.MMR) );

    React.useEffect( () => {
        fetch(googleSheetsUrl('143NiTTtw2cG96gWUpiL8iO-H1HcFTzaUpgjcXrxRGdg') )
        .then(async response => setRtl(await response.text()));
    }, []);

    const low = json[-1];
    const high = json[0];

    const distribution = {} as { [key: string]: number };
    for( let i = 0; i < high+100; i += 50){
        const x = json.filter( x => x >= i && x < i+100 );
        distribution[`${i}-${i+100}`] = x.length;
    }

    console.info( 'distribution', low, high, "\n", distribution )

    const options = {
        xAxis: {
            type: 'category',
            data: Object.keys(distribution)
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: Object.values(distribution),
              type: 'bar'
            }
          ]
    }

    return (
        <Containers.StandardContentBox>
            <ReactECharts option={options} className="w-full pr-4" style={{height: 600}} />
        </Containers.StandardContentBox>
    );
}