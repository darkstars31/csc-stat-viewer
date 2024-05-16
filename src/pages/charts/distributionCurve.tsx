import React from "react";
import { Player } from "../../models";
import * as Containers from "../../common/components/containers";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { googleSheetsUrl } from "../../dataConfig";
import papa from "papaparse";


const getByTier = ( p: { MMR: number, Tier: string}[], { tier }: { tier: string } ) => p.filter( p => p.Tier === tier).flatMap( p => p.MMR);

const getDistribution = ( p: number[] ) => {
  const high = p[0];
  const width = 10;
  const distribution = {} as { [key: string]: number };
  for( let i = 0; i < high+width; i += width){
      const x = p.filter( x => x >= i && x < i+width );
      distribution[`${i}-${i+width}`] = x.length;
  }
  return distribution;
}

export function DistributionCurves( { playerData }: { playerData: Player[] } ) {
    const [rtl, setRtl] = React.useState("");
    const json = papa.parse<{ MMR: string, Tier: string}>( rtl, { header: true } )?.data.flatMap( p => ({ Tier: p.Tier, MMR: parseInt(p.MMR)}) ) ?? [];

    React.useEffect( () => {
        fetch(googleSheetsUrl('143NiTTtw2cG96gWUpiL8iO-H1HcFTzaUpgjcXrxRGdg') )
        .then(async response => setRtl(await response.text()));
    }, []);


    const recruit = getDistribution(getByTier(json, { tier: "Recruit"}));
    const prospect = getDistribution(getByTier(json, { tier: "Prospect"}));
    const contender = getDistribution(getByTier(json, { tier: "Contender"}));
    const challenger = getDistribution(getByTier(json, { tier: "Challenger"}));
    const elite = getDistribution(getByTier(json, { tier: "Elite"}));
    const premier = getDistribution(getByTier(json, { tier: "Premier"}));




    const options: EChartsOption = {
        xAxis: {
            type: 'value',
            //data: [json[-1].MMR ?? 0, json[0].MMR],
          },
          yAxis: {
            type: 'value'
          },
          series: [ { 
            name: "Recruit",
            data: Object.values(recruit) ,
            type: "bar",
            emphasis: {},
          },
          { 
            name: "Prospect",
            data: Object.values(prospect),
            type: "bar",
            emphasis: {},
          },
          { 
            name: "Contender",
            data: Object.values(contender),
            type: "bar",
            emphasis: {},
          },
          { 
            name: "Challenger",
            data: Object.values(challenger),
            type: "bar",
            emphasis: {},
          },
          { 
            name: "Elite",
            data: Object.values(elite),
            type: "bar",
            emphasis: {},
          },
          { 
            name: "Premier",
            data: Object.values(premier),
            type: "bar",
            emphasis: {},
          },
        ]
    }

    return (
        <Containers.StandardContentBox>
            <ReactECharts option={options} className="w-full pr-4" style={{height: 600}} />
        </Containers.StandardContentBox>
    );
}