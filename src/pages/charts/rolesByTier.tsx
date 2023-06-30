import * as React from "react";
import { Player } from "../../models";
import ReactECharts from "echarts-for-react";

type Props = {
    playerData?: Player[]
}

export function RoleByTierBarChart({ playerData = [] }: Props) {
    const getByRoleAndTier = ( role: string, tier: string ) => playerData.filter( p => p.role === role && p.tier.name === tier );
    const getByTier = ( tier: string) => playerData.filter( p => p.tier.name === tier);
    const optionPlayersInTier = {
        title: {
            text: 'Players in Tier and Roles',
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
        ]
      };

    return (
        <ReactECharts option={optionPlayersInTier} style={{height: 500}} />
    );
    
}