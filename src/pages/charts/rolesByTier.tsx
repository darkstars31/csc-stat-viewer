import * as React from "react";
import { Player } from "../../models";
import ReactECharts from "echarts-for-react";

type Props = {
    playerData?: Player[]
}
type BarSeriesType = {
  name: string;
  type: 'bar';
  stack: string;
  label: {
    show: boolean;
    formatter: (params: { value: number }) => string;
  };
  emphasis: { focus: 'series' };
  data: number[];
};

type LineSeriesType = {
  name: string;
  type: 'line';
  data: number[];
  smooth: boolean;
};
export function RoleByTierBarChart({ playerData = [] }: Props) {
  const [showProportions, setShowProportions] = React.useState(false);

  const getByRoleAndTier = (role: string, tier: string) => {
    const roleAndTierCount = playerData.filter(p => p.role === role && p.tier.name === tier).length;
    const tierCount = playerData.filter(p => p.tier.name === tier).length;
    return showProportions ? (roleAndTierCount / tierCount) * 100 : roleAndTierCount; 
  };

  const getByTier = (tier: string) => {
    return playerData.filter(p => p.tier.name === tier).length;
  };
  const seriesArray: (BarSeriesType | LineSeriesType)[] = [
    {
      name: 'Rifler',
      type: 'bar',
      stack: 'total', 
      label: {
        show: true,
        formatter: function(params: { value: number }) {
          return showProportions ? `${params.value.toFixed(2)}%` : `${params.value}`;
        }
      },  
      emphasis: {focus: 'series'},
      data: [getByRoleAndTier('RIFLER','Recruit'),
              getByRoleAndTier('RIFLER','Prospect'),
              getByRoleAndTier('RIFLER','Contender'),
              getByRoleAndTier('RIFLER','Challenger'),
              getByRoleAndTier('RIFLER','Elite'),
              getByRoleAndTier('RIFLER','Premier')]
    },
    {
      name: 'Awper',
      type: 'bar',
      stack: 'total', 
      label: {
        show: true,
        formatter: function(params: { value: number }) {
          return showProportions ? `${params.value.toFixed(2)}%` : `${params.value}`;
        }
      }, 
      emphasis: {focus: 'series'},
      data: [getByRoleAndTier('AWPER','Recruit'),
              getByRoleAndTier('AWPER','Prospect'),
              getByRoleAndTier('AWPER','Contender'),
              getByRoleAndTier('AWPER','Challenger'),
              getByRoleAndTier('AWPER','Elite'),
              getByRoleAndTier('AWPER','Premier')]
    },
    {
      name: 'Support',
      type: 'bar',
      stack: 'total', 
      label: {
        show: true,
        formatter: function(params: { value: number }) {
          return showProportions ? `${params.value.toFixed(2)}%` : `${params.value}`;
        }
      }, 
      emphasis: {focus: 'series'},
      data: [getByRoleAndTier('SUPPORT','Recruit'),
              getByRoleAndTier('SUPPORT','Prospect'),
              getByRoleAndTier('SUPPORT','Contender'),
              getByRoleAndTier('SUPPORT','Challenger'),
              getByRoleAndTier('SUPPORT','Elite'),
              getByRoleAndTier('SUPPORT','Premier')]
    },
    {
      name: 'Fragger',
      type: 'bar',
      stack: 'total', 
      label: {
        show: true,
        formatter: function(params: { value: number }) {
          return showProportions ? `${params.value.toFixed(2)}%` : `${params.value}`;
        }
      }, 
      emphasis: {focus: 'series'},
      data: [getByRoleAndTier('FRAGGER','Recruit'),
              getByRoleAndTier('FRAGGER','Prospect'),
              getByRoleAndTier('FRAGGER','Contender'),
              getByRoleAndTier('FRAGGER','Challenger'),
              getByRoleAndTier('FRAGGER','Elite'),
              getByRoleAndTier('FRAGGER','Premier')]
    },
    {
      name: 'Entry',
      type: 'bar',
      stack: 'total', 
      label: {
        show: true,
        formatter: function(params: { value: number }) {
          return showProportions ? `${params.value.toFixed(2)}%` : `${params.value}`;
        }
      }, 
      emphasis: {focus: 'series'},
      data: [getByRoleAndTier('ENTRY','Recruit'),
              getByRoleAndTier('ENTRY','Prospect'),
              getByRoleAndTier('ENTRY','Contender'),
              getByRoleAndTier('ENTRY','Challenger'),
              getByRoleAndTier('ENTRY','Elite'),
              getByRoleAndTier('ENTRY','Premier')]
    },
    ...(showProportions
      ? []
      : [
          {
            name: 'Total Players',
            data: [
              getByTier('Recruit'),
              getByTier('Prospect'),
              getByTier('Contender'),
              getByTier('Challenger'),
              getByTier('Elite'),
              getByTier('Premier')
            ],
            type: 'line' as const,
            smooth: true
          }
        ]
    )
];
        // {
        //   name: 'Lurker',
        //   type: 'bar', stack: 'total', label: {show: true},  emphasis: {focus: 'series'},
        //   data: [getByRoleAndTier('LURKER','Recruit').length,
        //           getByRoleAndTier('LURKER','Prospect').length,
        //           getByRoleAndTier('LURKER','Contender').length,
        //           getByRoleAndTier('LURKER','Challenger').length,
        //           getByRoleAndTier('LURKER','Elite').length,
        //           getByRoleAndTier('LURKER','Premier').length]
        // },
      
  const optionPlayersInTier = {
    title: {
      text: showProportions ? 'Proportion of Players in Roles by Tier' : 'Total Players in Roles by Tier',      
      left: 'center',
      top: 30,
      textStyle: {
        color: '#FFFFFF',
      },
    },
    xAxis: {
      type: 'category',
      data: ['Recruit', 'Prospect', 'Contender', 'Challenger', 'Elite', 'Premier']
    },
    yAxis: {
    type: 'value',
    max: showProportions ? 100 : null,
    axisLabel: {
      formatter: showProportions ? '{value}%' : '{value}'
    },
  },     
    legend: [{
      orient: "vertical",
      right: -10,
      top: 100,
    }],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      }
    },
    series: seriesArray,
      };
    
      return (
        <>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setShowProportions(false)}
              className={`px-4 py-2 mx-1 rounded-lg ${!showProportions ? 'bg-midnight1 text-white border border-blue-500' : 'bg-midnight2 text-blue-500'}`}
            >
              Totals
            </button>
            <button
              onClick={() => setShowProportions(true)}
              className={`px-4 py-2 mx-1 rounded-lg ${showProportions ? 'bg-midnight1 text-white border border-blue-500' : 'bg-midnight2 text-blue-500'}`}
            >
              Proportions
            </button>
          </div>
          <ReactECharts key={showProportions ? 'proportions' : 'totals'} option={optionPlayersInTier} style={{height: 500}} />
        </>
      );      
    }