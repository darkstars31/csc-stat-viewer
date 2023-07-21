import * as React from "react";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import { Player } from "../../models";
import ReactECharts from "echarts-for-react";
import { linearRegression, linearRegressionLine, max, min } from "simple-statistics";
import { FiFilter } from "react-icons/fi";

type Props = {
    playerData?: Player[];
}

export function CartesianCompare( { playerData = [] }: Props) {
    const [ isExtraFiltersOpen, setIsExtraFiltersOpen ] = React.useState(false);
	const [ extraFilters, setExtraFilters ] = React.useState<{ minGamesPlayed: number}>({ minGamesPlayed: 0});
    const [ isHltvRating, setIsHltvRating ] = React.useState(false);

    const getPreferredRating = ( p: Player ) => isHltvRating ? p.hltvTwoPointO! : p.stats?.rating;

	const filteredPlayers = playerData.filter( p => p.stats?.gameCount >= extraFilters.minGamesPlayed);

    const data = filteredPlayers.map( p => ( [ getPreferredRating(p), p.mmr, p.tier.name, p.name, p]));
    const playerTotalStats = getTotalPlayerAverages(playerData ?? []);

    const ratingMmrPairs = playerData.map( p => ( [ getPreferredRating(p), p.mmr!]));
    const linearRegressionFunction = linearRegression( ratingMmrPairs );
    const linearRegressionLineFunction = linearRegressionLine( linearRegressionFunction );

    const xmin = isHltvRating ? min(playerData.map( p => p.hltvTwoPointO!)) : Number((playerTotalStats?.lowest.rating).toFixed(2));
    const xmax =  isHltvRating ? max(playerData.map( p => p.hltvTwoPointO!)): Number((playerTotalStats?.highest.rating).toFixed(2));

    const highest = playerTotalStats.highest.rating ? xmax + 0.05 : 0;
    const lowest = playerTotalStats.lowest.rating ? xmin - 0.05 : 0;

    const seriesSettings = ( datasetIndex: number) => ({
        symbolsize: 60,
        datasetIndex: datasetIndex,
        type: "scatter",
        symbolSize: 8,
        select: {
          selectedMode: 'multiple',
        },
        emphasis: {
            focus: 'series',
            label: {
                color: '#FFFFFF',
                show: true,
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
                position: 'top',
            }
          },
        tooltip: {
          show: true,
          triggerOn: 'none',
          showContent: true,
          alwaysShowContent: true,
          enterable: true,
          renderMode: 'html',
          backgroundColor: 'rgba(10,10,10,1)',
          position: ['11%','11%'],
          formatter: function (param: { data: any[]; }) {
              return `<b>${param.data[3]}</b><br />${isHltvRating ? 'HLTV Rating' : 'Rating'}: ${param.data[0].toFixed(2)}<br />MMR: ${param.data[1]}`;
          }
      }
    });

    const optionRatingMMR = {
        backgroundColor: '#090917',
        title: {
            text: 'MMR and Rating per Tier',
            textStyle: {
                color: '#FFFFFF',
            },
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier', 'Linear Regression'],
            top: 30,
            textStyle: {
              color: "#fff",
              fontSize: 12,
            },
            inactiveColor: "gray"
        },
        toolbox: {
          feature: {
            saveAsImage:{
                title: "Save Image",
                show: true,
                type: 'png',
            },
          }  
        },
        dataset: [ { source: data ?? [], },
            { transform: { type: 'filter', config: { dimension: 2, eq: "Recruit"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Prospect"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Contender"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Challenger"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Elite"}}},
            { transform: { type: 'filter', config: { dimension: 2, eq: "Premier"}}},          
        ],
        dataZoom: [
            {
              type: 'inside',
            },
            {
              type: 'slider',
              showDataShadow: true,
            //   handleIcon:
            //     'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '100%'
            },
            {
              type: 'inside',
              orient: 'vertical'
            },
            {
              type: 'slider',
              orient: 'vertical',
              showDataShadow: true,
            //   handleIcon:
            //     'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '100%'
            }
        ],
        xAxis: {
          max: highest,
          min: lowest,
          splitLine: {
              lineStyle: {
                type: 'dashed',
                color: `#383838`
              }
          },
          axisLabel: {
              formatter: function(value: number) {
                  return value.toFixed(2);
              }
          }
      },
        yAxis: {

            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `#383838`
                }
              }
        },
        tooltip: {
            show: false,
            trigger: 'item',
            label: {
                formatter: function (param: { data: any[]; }) {
                    console.info(param);
                    return `${param.data[3]} ${param.data[2]}`;
                },
            }
        },
        series: [ { 
            name: "Recruit", ...seriesSettings(1),
        },
        { 
            name: "Prospect", ...seriesSettings(2),
        },
        { 
            name: "Contender", ...seriesSettings(3),
        },
        { 
            name: "Challenger", ...seriesSettings(4),
        },
        { 
            name: "Elite", ...seriesSettings(5),
        },
        { 
            name: "Premier", ...seriesSettings(6),
        },
        { 
            name: "Linear Regression",
            color: "purple",
            symbolsize: 60,
            animationEasing: "cubicIn",
            lineStyle: {
              type: 'dashed',
            },
            data: [
              [lowest, linearRegressionLineFunction(lowest)],
              [highest, linearRegressionLineFunction(highest)],
            ],
            type: "line",
        },
    ],
    };

    return (
        <div className='py-4'>
          <div className="flex justify-end">
            <button title="Extra Filters" className={`p-2 m-1 rounded border bg-indigo-600 border-indigo-600`} onClick={ () => setIsExtraFiltersOpen(!isExtraFiltersOpen) }><FiFilter /></button>
            { isExtraFiltersOpen &&
            <div className="fixed z-10 mr-16 flex flex-col m-2 p-4 rounded gap-2 w-6/12 sm:w-3/12 bg-midnight2">
              <div className="pl-6">
                <input
                className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                type="checkbox"
                value=""
                onChange={ () => setIsHltvRating(!isHltvRating) }
                id="checkboxChecked"
                checked={ isHltvRating } />
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="checkboxChecked">
                  Use HLTV Rating
                </label>
              </div>
                <div>
                <label htmlFor="customRange1" className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                  Minimum Games Played ({extraFilters.minGamesPlayed})
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                  id="customRange1"
                  value={extraFilters.minGamesPlayed}
                  onChange={(e) => setExtraFilters({ ...extraFilters, minGamesPlayed: Number(e.target.value) })}
                />
              </div>
          </div>
          }
          </div>
            <ReactECharts option={optionRatingMMR} style={{height: 600}} />
        </div>
    );
}