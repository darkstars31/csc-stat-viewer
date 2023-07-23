import * as React from "react";
import { Player } from "../../models";
import ReactECharts from "echarts-for-react";
import * as Containers from "../../common/components/containers";

type Props = {
    playerData?: Player[]
}

export function RolePieChart({ playerData = [] }: Props) {

    const getByRole = ( role: string ) => playerData.filter( p => p.role === role);

    const optionByRole = {
        title: {
            text: 'Roles',
            left: 'center',
            textStyle: {
                color: '#FFFFFF',
            },
        },
        legend: {
            data: ['Awper','Fragger','Entry','Support','Rifler'], // 'Lurker' was removed from stats API vs Spreadsheet
            top: 30
        },
        series: {
            radius: ['24%', '48%'],
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
                  return param.name + '\n' + param.percent + '%';
                }
              },
            data: [ 
                { value: getByRole("FRAGGER").length, name: 'Fragger' },
                //{ value: getByRole("LURKER").length, name: 'Lurker' },
                { value: getByRole("AWPER").length, name: 'Awper' },
                { value: getByRole("ENTRY").length, name: 'Entry' },
                { value: getByRole("SUPPORT").length, name: 'Support' },
                { value: getByRole("RIFLER").length, name: 'Rifler' },
            ]
        }
    };

    return (
        <>
            <Containers.StandardContentBox>
                <ReactECharts option={optionByRole} style={{height: 500}} />
            </Containers.StandardContentBox>
        </>
    );

}
