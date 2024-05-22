import React from "react";
import { Player } from "../../models";
import * as Containers from "../../common/components/containers";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { useDataContext } from "../../DataContext";
import { Loading } from "../../common/components/loading";


const getByTier = ( p: { MMR: number, Tier: string}[], { tier }: { tier: string } ) => p.filter( p => p.Tier === tier).flatMap( p => p.MMR);

const getDistribution = ( p: number[] ) => {
  const high = p[p.length-1];
  const width = 25;
  const distribution = {} as { [key: string]: number };
  for( let i = 100; i < high+width; i += width){
      const x = p.filter( x => x >= i && (x < i+width && x < high) );
      distribution[`${i}-${i+width}`] = x.length;
  }
  return distribution;
}

export function DistributionCurves( { playerData }: { playerData: Player[] } ) {
    const { players, isLoading } = useDataContext();
    const x = players.flatMap( p => ({ MMR: p.mmr ?? 0, Tier: p.tier.name })).sort( (a, b) => a.MMR - b.MMR );


    if( isLoading ) {
      return <Containers.StandardContentBox><Loading /></Containers.StandardContentBox>;
    }


    const recruit = getDistribution(getByTier(x, { tier: "Recruit"}));
    const prospect = getDistribution(getByTier(x, { tier: "Prospect"}));
    const contender = getDistribution(getByTier(x, { tier: "Contender"}));
    const challenger = getDistribution(getByTier(x, { tier: "Challenger"}));
    const elite = getDistribution(getByTier(x, { tier: "Elite"}));
    const premier = getDistribution(getByTier(x, { tier: "Premier"}));

    const BAR_WIDTH = "4";

    const options: EChartsOption = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
            type: 'category',
            data: [...Object.keys( { ...recruit, ...prospect, ...contender, ...challenger, ...elite, ...premier } )],
          },
          yAxis: {
            type: 'value'
          },
          series: [ { 
            name: "Recruit",
            data: Object.values(recruit) ,
            type: "bar",
            barWidth: BAR_WIDTH,
            emphasis: {},
          },
          { 
            name: "Prospect",
            data: Object.values(prospect),
            type: "bar",
            barWidth: BAR_WIDTH,
            emphasis: {},
          },
          { 
            name: "Contender",
            data: Object.values(contender),
            type: "bar",
            barWidth: BAR_WIDTH,
            emphasis: {},
          },
          { 
            name: "Challenger",
            data: Object.values(challenger),
            type: "bar",
            barWidth: BAR_WIDTH,
            emphasis: {},
          },
          { 
            name: "Elite",
            data: Object.values(elite),
            type: "bar",
            barWidth: BAR_WIDTH,
            emphasis: {},
          },
          { 
            name: "Premier",
            data: Object.values(premier),
            type: "bar",
            barWidth: BAR_WIDTH,
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