import * as React from "react";
//import { mapImages } from "../../common/images/maps";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { calculateMapBanFloat, calculateMapBans } from "../../common/utils/match-utils";
import { Team } from "../../models/franchise-types";
import { Match } from "../../models/matches-types";
import { useDataContext } from "../../DataContext";

type MapBansType = {
    de_inferno: number, 
    de_vertigo: number,
    de_nuke: number,
    de_mirage: number,
    de_ancient: number,
    de_anubis: number,
    de_overpass: number
}
type Props = {
    matches?: Match[],
    team?: Team,
}

export function MapBans( { matches, team }: Props) {
    const { loggedinUser } = useDataContext();
    const mapBans: Record<"Round 1"|"Round 2"|"Round 3", MapBansType> = calculateMapBans( team, matches );
    const mapFloats = calculateMapBanFloat( team, matches );
    //{/* <div className='text-sm'><img className='w-16 h-16 mx-auto' src={mapImages[key]} alt=""/></div> */}
    const roundLabels = Object.keys( mapBans ?? {});
    const mapLabels = ["de_inferno","de_vertigo","de_nuke", "de_mirage", "de_ancient", "de_anubis", "de_overpass"];
    const data = Object.values( mapBans ?? {})
        .map( (i) => Object.values(i) )
        .map( (round, row) => round.map( (_, column) => [column, row, round[column] || "-"]));
    
    const mapBanMatrixOptions: EChartsOption = {
        title: { 
            text: `Map Ban Matrix`,
            subtext: "(Beta Feature)",
            subtextStyle: {
              align: 'center',
            },
            left: '10%',
            top: '0%', 
            textStyle: {
              align: 'center',
              color: '#FFFFFF', 
            },
          },
        tooltip: {
            position: 'top'
          },
        grid: {
            height: '50%',
            top: '15%',
            left: '12%',
        },
        xAxis: {
            type: 'category',
            data: mapLabels.map( i => i.split("de_")[1] ),
            splitArea: {
              show: true
            },
            axisLabel: {
                rotate: 45
            }
          },
          yAxis: {
            type: 'category',
            data: roundLabels,
            splitArea: {
              show: true
            },
            inverse: true,
            axisLabel: {
                rotate: 45
            }
          },
          visualMap: {
            min: 0,
            max: 10,
            calculable: false,
            orient: 'vertical',
            top: '14%',
            right: '0'
          },
          series: [
            {
              name: 'Banned',
              type: 'heatmap',
              data: data.flatMap( i => i ),
              label: {
                show: true,
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
    };

    const mapBanFloatOptions: EChartsOption = {
        title: {
            text: 'Map Floats & Picks',
            left: 'center',
            textStyle: {
                color: '#FFFFFF',
            },
        },
        legend: {
            data: mapLabels,
            top: 30
        },
        series: [
        {
            name: 'Map Picks',
            radius: [0, '50%'],
            center: ['50%', '50%'],
            type: 'pie',
            label: {
                position: 'inner',
                fontSize: 13,
                formatter(param: Record<string,unknown>) {
                // correct the percentage
                    return param.name + '\n' + param.percent + '%';
                }
            },
            itemStyle: {
                borderRadius: 4,
                borderColor: '#1d1d31',
                borderWidth: 2
              },
            labelLine: {
                show: false
            },
            data: Object.entries(mapFloats?.picks ?? {})
                .filter( ([_, value]) => value > 0)
                .map( ([key, value]) => ({ name: key.split("de_")[1], value: value }) )
        },
        {
            name: 'Map Floats',
            type: 'pie',
            radius: ['60%', '72%'],
            label: {
                fontSize: 14,
                formatter(param: Record<string,unknown>) {
                    // correct the percentage
                    return param.name + "\n (" + param.percent + '%)';
                },
                color: '#FFFFFF',
                textBorderColor: '#000',
            },
            labelLine: {
              length: 20,
            },
            itemStyle: {
                borderRadius: 4,
                borderColor: '#1d1d31',
                borderWidth: 2
              },
            emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
            },
            data: Object.entries(mapFloats?.float ?? {})
                .filter( ([_, value]) => value > 0)
                .map( ([key, value]) => ({ name: key.split("de_")[1], value: value }) )
        }
    ]
    };

    if ( !loggedinUser ) {
        return null;
    }

    return (
        <div className="flex md:flex-row flex-wrap">
            <div className="basis-full md:basis-7/12">
                <ReactECharts option={mapBanMatrixOptions} style={{ height: 320, width: "100%" }}/>
            </div>
            <div className="basis-full md:basis-5/12">
                <ReactECharts option={mapBanFloatOptions} style={{ height: 320, width: "100%" }}/>
            </div>
        </div>
    );
}