import React from "react";
import { Player } from "../../models";
import * as Containers from "../../common/components/containers";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { useDataContext } from "../../DataContext";
import { Loading } from "../../common/components/loading";


const getByTier = ( p: { MMR: number, Tier: string}[], { tier }: { tier: string } ) => p.filter( p => p.Tier === tier).flatMap( p => p.MMR);

const getDistribution = ( width: number, p: number[] ) => {
  const high = p[p.length-1];
  const distribution = {} as { [key: string]: number };
  for( let i = 100; i < high+width; i += width){
      const x = p.filter( x => x >= i && (x < i+width && x < high) );
      distribution[`${i}-${i+width}`] = x.length;
  }
  return distribution;
}

export function DistributionCurves( { playerData }: { playerData: Player[] } ) {
    const { players, isLoading } = useDataContext();
    const [ extraFilters, setExtraFilters ] = React.useState<{ mmrGroupingWidth: number}>({ mmrGroupingWidth: 20});

    const x = players.flatMap( p => ({ MMR: p.mmr ?? 0, Tier: p.tier.name })).sort( (a, b) => a.MMR - b.MMR );


    if( isLoading ) {
      return <Containers.StandardContentBox><Loading /></Containers.StandardContentBox>;
    }


    const recruit = getDistribution( extraFilters.mmrGroupingWidth, getByTier(x, { tier: "Recruit"}));
    const prospect = getDistribution( extraFilters.mmrGroupingWidth, getByTier(x, { tier: "Prospect"}));
    const contender = getDistribution( extraFilters.mmrGroupingWidth, getByTier(x, { tier: "Contender"}));
    const challenger = getDistribution( extraFilters.mmrGroupingWidth, getByTier(x, { tier: "Challenger"}));
    const elite = getDistribution( extraFilters.mmrGroupingWidth, getByTier(x, { tier: "Elite"}));
    const premier = getDistribution( extraFilters.mmrGroupingWidth, getByTier(x, { tier: "Premier"}));

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
      <>
        <Containers.StandardContentBox>
            <ReactECharts option={options} className="w-full pr-4" style={{height: 600}} />
        </Containers.StandardContentBox>
        <div className="m-2">
        <Containers.ChartButtonBoundingBox>
          <Containers.ChartButtonBox>
              <label htmlFor="customRange1" className="flex text-neutral-700 dark:text-neutral-200">
                MMR Group Size ({extraFilters.mmrGroupingWidth})
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                id="customRange1"
                value={extraFilters.mmrGroupingWidth}
                onChange={(e) => setExtraFilters({ ...extraFilters, mmrGroupingWidth: Number(e.target.value) })}/>
            </Containers.ChartButtonBox>
        </Containers.ChartButtonBoundingBox>
      </div>
      </>
    );
}