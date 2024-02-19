import * as React from "react";
//import { mapImages } from "../../common/images/maps";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { calculateMapBanFloat, calculateMapBans } from "../../common/utils/match-utils";
import { Team } from "../../models/franchise-types";
import { Match } from "../../models/matches-types";
import { useDataContext } from "../../DataContext";
import { Exandable } from "../../common/components/containers/Expandable";

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
            text: `Matrix`,
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
            text: 'Floats & Picks',
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
            radius: [0, '45%'],
            center: ['50%', '45%'],
            type: 'pie',
            label: {
                position: 'inner',
                fontSize: 12,
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
            startAngle: 45,
            radius: ['50%', '60%'],
            center: ['50%', '45%'],
            label: {
                fontSize: 12,
                formatter(param: Record<string,unknown>) {
                    // correct the percentage
                    return param.name + "\n (" + param.percent + '%)';
                },
                color: '#FFFFFF',
                textBorderColor: '#000',
            },
            labelLine: {
              length: 10,
            },
            itemStyle: {
                borderRadius: 4,
                borderColor: '#1d1d31',
                borderWidth: 2
              },
            emphasis: {
                label: {
                  show: true,
                  fontSize: 14,
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
        <Exandable title="Map Analysis">
            { loggedinUser ? 
              <div className="flex flex-row flex-wrap">
                <ReactECharts className="w-full md:w-1/2" option={mapBanMatrixOptions} style={{ height: 320 }}/>
                <ReactECharts className="w-full md:w-1/2" option={mapBanFloatOptions} style={{ height: 320 }}/>
              </div>
              :
              <div className="w-full text-center font-italic">AnalytiKill Prime is only available for logged in users.</div>
            } 
           
        </Exandable>
    );
}