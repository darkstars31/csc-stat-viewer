import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import ReactECharts from "echarts-for-react";
import { getTotalPlayerAverages } from '../common/utils/player-utils';
import { Pill } from '../common/components/pill';

export function Charts() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { players } = useDataContext();
    const playersWithStats = players.filter( p => p.stats );
    const [ filters, setFilters ] = React.useState<string[]>([]);

    const addFilter = () => {
        const searchValue = inputRef.current!.value; 
        const newFilters = [ ...filters, searchValue ].filter(Boolean);
        setFilters( newFilters );
    }

    const removeFilter = ( label: string ) => {
        const newFilters = filters;
        delete newFilters[filters.indexOf(label)];
        setFilters( newFilters.filter(Boolean) );
    }

    const filteredPlayers = filters.length > 0 ? playersWithStats.filter( player => {
        return filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ) );
    } ) : playersWithStats;

    if( playersWithStats.length === 0) {
        return <div>Loading</div>;
    }

    const data = filteredPlayers.map( p => ( [p.stats?.Rating, p.mmr, p.tier.name, p.name]));

    const emp = {
        focus: 'series',
        label: {
            color: '#FFFFFF',
            show: true,
            formatter: function (param: { data: any[]; }) {
                return param.data[3];
            },
            position: 'top',
        }
      };

    const optionRatingMMR = {
        title: {
            text: 'Rating and MMR per Tier',
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier'],
            top: 30
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
              type: 'inside'
            },
            {
              type: 'slider',
              showDataShadow: false,
              handleIcon:
                'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%'
            },
            {
              type: 'inside',
              orient: 'vertical'
            },
            {
              type: 'slider',
              orient: 'vertical',
              showDataShadow: false,
              handleIcon:
                'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%'
            }
        ],
        xAxis: {
            min: .3,
            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `gray`
                }
              }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: `gray`
                }
              }
        },
        tooltip: {
            label: {
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
            }
        },
        series: [ { 
            name: "Recruit",
            symbolsize: 40,
            datasetIndex: 1,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Prospect",
            symbolsize: 60,
            datasetIndex: 2,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Contender",
            symbolsize: 60,
            datasetIndex: 3,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Challenger",
            symbolsize: 60,
            datasetIndex: 4,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Elite",
            symbolsize: 60,
            datasetIndex: 5,
            type: "scatter",
            emphasis: emp,
        },
        { 
            name: "Premier",
            symbolsize: 60,
            datasetIndex: 6,
            type: "scatter",
            emphasis: emp,
        },
    ],
  
    };

    const optionHeadShotTier =  {
        title: {
            text: 'Low, Avg, Highest Headshot Percentage by Tier',
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier'],
            top: 30
        },
        xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: ['Low', 'Avg', 'High',]
        },
        yAxis: {
            type: "value"
        },
        tooltip: {
            label: {
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
            }
        },
        series: [ { 
            name: "Recruit",
            data: [ getTotalPlayerAverages(players, { tier: "Recruit"}).lowest["hs"],
                getTotalPlayerAverages(players, { tier: "Recruit"}).average["hs"],
                getTotalPlayerAverages(players, { tier: "Recruit"}).highest["hs"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Prospect",
            data: [ getTotalPlayerAverages(players, { tier: "Prospect"}).lowest["hs"],
                getTotalPlayerAverages(players, { tier: "Prospect"}).average["hs"],
                getTotalPlayerAverages(players, { tier: "Prospect"}).highest["hs"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Contender",
            data: [ getTotalPlayerAverages(players, { tier: "Contender"}).lowest["hs"],
                getTotalPlayerAverages(players, { tier: "Contender"}).average["hs"],
                getTotalPlayerAverages(players, { tier: "Contender"}).highest["hs"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Challenger",
            data: [ getTotalPlayerAverages(players, { tier: "Challenger"}).lowest["hs"],
                getTotalPlayerAverages(players, { tier: "Challenger"}).average["hs"],
                getTotalPlayerAverages(players, { tier: "Challenger"}).highest["hs"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Elite",
            data: [ getTotalPlayerAverages(players, { tier: "Elite"}).lowest["hs"],
                getTotalPlayerAverages(players, { tier: "Elite"}).average["hs"],
                getTotalPlayerAverages(players, { tier: "Elite"}).highest["hs"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Premier",
            data: [ getTotalPlayerAverages(players, { tier: "Premier"}).lowest["hs"],
                getTotalPlayerAverages(players, { tier: "Premier"}).average["hs"],
                getTotalPlayerAverages(players, { tier: "Premier"}).highest["hs"]
            ],
            type: "bar",
            emphasis: emp,
        },
        
    ],
    };

    const optionUtils =  {
        title: {
            text: 'Util Thrown by Tier',
            left: 'center'
        },
        legend: {
            data: ['Recruit', 'Prospect','Contender', 'Challenger', 'Elite', 'Premier'],
            top: 30
        },
        xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: ['Low', 'Avg', 'High',]
        },
        yAxis: {
            type: "value"
        },
        tooltip: {
            label: {
                formatter: function (param: { data: any[]; }) {
                    return param.data[3];
                },
            }
        },
        series: [ { 
            name: "Recruit",
            data: [ getTotalPlayerAverages(players, { tier: "Recruit"}).lowest["util"],
                getTotalPlayerAverages(players, { tier: "Recruit"}).average["util"],
                getTotalPlayerAverages(players, { tier: "Recruit"}).highest["util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Prospect",
            data: [ getTotalPlayerAverages(players, { tier: "Prospect"}).lowest["util"],
                getTotalPlayerAverages(players, { tier: "Prospect"}).average["util"],
                getTotalPlayerAverages(players, { tier: "Prospect"}).highest["util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Contender",
            data: [ getTotalPlayerAverages(players, { tier: "Contender"}).lowest["util"],
                getTotalPlayerAverages(players, { tier: "Contender"}).average["util"],
                getTotalPlayerAverages(players, { tier: "Contender"}).highest["util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Challenger",
            data: [ getTotalPlayerAverages(players, { tier: "Challenger"}).lowest["util"],
                getTotalPlayerAverages(players, { tier: "Challenger"}).average["util"],
                getTotalPlayerAverages(players, { tier: "Challenger"}).highest["util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Elite",
            data: [ getTotalPlayerAverages(players, { tier: "Elite"}).lowest["util"],
                getTotalPlayerAverages(players, { tier: "Elite"}).average["util"],
                getTotalPlayerAverages(players, { tier: "Elite"}).highest["util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        { 
            name: "Premier",
            data: [ getTotalPlayerAverages(players, { tier: "Premier"}).lowest["util"],
                getTotalPlayerAverages(players, { tier: "Premier"}).average["util"],
                getTotalPlayerAverages(players, { tier: "Premier"}).highest["util"]
            ],
            type: "bar",
            emphasis: emp,
        },
        
    ],
    };

    const getByRole = ( role: string ) => filteredPlayers.filter( p => p.role === role);

    const optionByRole = {
        title: {
            text: 'Roles',
            left: 'center'
        },
        legend: {
            data: ['Awper','Fragger','Entry','Support','Lurker','Rifler'],
            top: 30
        },
        series: {
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            type: 'pie',
            roseType: 'radius',
            itemStyle: {
                borderRadius: 5
              },
            label: {
                color: '#fff',
                show: true,
                formatter(param: Record<string,unknown>) {
                  // correct the percentage
                  return param.name + ' (' + param.percent + '%)';
                }
              },
            data: [ 
                { value: getByRole("FRAGGER").length, name: 'Fragger' },
                { value: getByRole("LURKER").length, name: 'Lurker' },
                { value: getByRole("AWPER").length, name: 'Awper' },
                { value: getByRole("ENTRY").length, name: 'Entry' },
                { value: getByRole("SUPPORT").length, name: 'Support' },
                { value: getByRole("RIFLER").length, name: 'Rifler' },
            ]
        }
    };

    const getByRoleAndTier = ( role: string, tier: string ) => playersWithStats.filter( p => p.role === role && p.tier.name === tier );
    const getByTier = ( tier: string) => playersWithStats.filter( p => p.tier.name === tier);
    const optionPlayersInTier = {
        title: {
            text: 'Players in Tier and Roles',
            left: 'center',
            top: 30,
        },
        xAxis: {
          type: 'category',
          data: ['Recruit', 'Prospect', 'Contender', 'Challenger', 'Elite', 'Premier']
        },
        yAxis: {
          type: 'value',
        },
        legend: [{
            orient: "vertical",
            right: -40,
            top: 100,
        }],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            }
          },
        series: [
          {
            name: 'Total Players',
            data: [getByTier('Recruit').length, 
                getByTier('Prospect').length, 
                getByTier('Contender').length, 
                getByTier('Challenger').length, 
                getByTier('Elite').length, 
                getByTier('Premier').length
            ],
            type: 'line',
            smooth: true
          },
          {
            name: 'No Role',
            type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
            data: [ getByRoleAndTier('','Recruit').length,
                    getByRoleAndTier('','Prospect').length,
                    getByRoleAndTier('','Contender').length,
                    getByRoleAndTier('','Challenger').length,
                    getByRoleAndTier('','Elite').length,
                    getByRoleAndTier('-','Premier').length]
          },
          {
            name: 'Rifler',
            type: 'bar', stack: 'total', label: {show: true}, emphasis: {focus: 'series'},
            data: [getByRoleAndTier('RIFLER','Recruit').length,
                    getByRoleAndTier('RIFLER','Prospect').length,
                    getByRoleAndTier('RIFLER','Contender').length,
                    getByRoleAndTier('RIFLER','Challenger').length,
                    getByRoleAndTier('RIFLER','Elite').length,
                    getByRoleAndTier('RIFLER','Premier').length]
          },
          {
            name: 'Awper',
            type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
            data: [getByRoleAndTier('AWPER','Recruit').length,
                    getByRoleAndTier('AWPER','Prospect').length,
                    getByRoleAndTier('AWPER','Contender').length,
                    getByRoleAndTier('AWPER','Challenger').length,
                    getByRoleAndTier('AWPER','Elite').length,
                    getByRoleAndTier('AWPER','Premier').length]
          },
          {
            name: 'Support',
            type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
            data: [getByRoleAndTier('SUPPORT','Recruit').length,
                    getByRoleAndTier('SUPPORT','Prospect').length,
                    getByRoleAndTier('SUPPORT','Contender').length,
                    getByRoleAndTier('SUPPORT','Challenger').length,
                    getByRoleAndTier('SUPPORT','Elite').length,
                    getByRoleAndTier('SUPPORT','Premier').length]
          },
          {
            name: 'Fragger',
            type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
            data: [getByRoleAndTier('FRAGGER','Recruit').length,
                    getByRoleAndTier('FRAGGER','Prospect').length,
                    getByRoleAndTier('FRAGGER','Contender').length,
                    getByRoleAndTier('FRAGGER','Challenger').length,
                    getByRoleAndTier('FRAGGER','Elite').length,
                    getByRoleAndTier('FRAGGER','Premier').length]
          },
          {
            name: 'Entry',
            type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
            data: [getByRoleAndTier('ENTRY','Recruit').length,
                    getByRoleAndTier('ENTRY','Prospect').length,
                    getByRoleAndTier('ENTRY','Contender').length,
                    getByRoleAndTier('ENTRY','Challenger').length,
                    getByRoleAndTier('ENTRY','Elite').length,
                    getByRoleAndTier('ENTRY','Premier').length]
          },
          {
            name: 'Lurker',
            type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
            data: [getByRoleAndTier('LURKER','Recruit').length,
                    getByRoleAndTier('LURKER','Prospect').length,
                    getByRoleAndTier('LURKER','Contender').length,
                    getByRoleAndTier('LURKER','Challenger').length,
                    getByRoleAndTier('LURKER','Elite').length,
                    getByRoleAndTier('LURKER','Premier').length]
          },
        ]
      };


    return (
        <Container>
           
            <div>
                <div className='text-center mx-auto max-w-lg mt-4'>
                    <form className="flex flex-box h-12 mx-auto" onSubmit={(e)=>{e.preventDefault()}}>
                        <label
                            htmlFor="textInput"
                            className={"relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 "}
                            >
                            <input
                                ref={inputRef}
                                placeholder='Filter players by Name'
                                className="basis-1/2 grow peer h-8 w-full border-none bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                type="text"                                     
                            />
                        </label>
                        <button
                            type="submit"
                            className="basis-1/6 ml-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                            onClick={addFilter}
                            >
                            +Filter
                        </button>
                    </form>
                </div>
                <div className="pt-4">
                    {filters.map( filter => 
                        <Pill key={filter} label={filter} onClick={() => removeFilter(filter)}/>
                        )
                    }
                </div>
            </div>
            <div>
                <ReactECharts option={optionRatingMMR} style={{height: 600}} />
            </div>
            <div>
                <ReactECharts option={optionHeadShotTier} style={{height: 500}} />
            </div>
            <div>
                <ReactECharts option={optionUtils} style={{height: 500}} />
            </div>
            <div className='grid grid-cols-2'>
                <ReactECharts option={optionByRole} style={{height: 500}} />
          
                <ReactECharts option={optionPlayersInTier} style={{height: 500,width: 650}} />
            </div>
        </Container>
    );
}