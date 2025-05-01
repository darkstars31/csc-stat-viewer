import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFetchMatchesGraphBySeasonTierAndType } from '../../dao/cscMatchesGraphQLDao';
import { Container } from '../../common/components/container';
import { useDataContext } from '../../DataContext';
import { Loading } from '../../common/components/loading';
import { mapImages } from '../../common/images/maps';

export const MapsPlayedChart: React.FC = () => {
    const { seasonAndMatchType } = useDataContext();
    const { data: matches, isLoading } = useFetchMatchesGraphBySeasonTierAndType(seasonAndMatchType.season, seasonAndMatchType.matchType);

    if (isLoading){
        return <Container>
            <Loading />
        </Container>;
    };
   

    // Process data to calculate the distribution of maps played
    const mapCounts: Record<string, number> = {};
    matches?.forEach(match => {
        const map = match.mapName;
        if (map) {
            mapCounts[map] = (mapCounts[map] || 0) + 1;
        }
    });

    const chartData = Object.entries(mapCounts).map(([map, count]) => ({
        name: map,
        value: count,
    }));

    const chartOptions = {
        title: {
            text: `Distribution of ${seasonAndMatchType.matchType} Maps Played during Season ${seasonAndMatchType.season}`,
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            formatter: (params: any) => {
                const { name, value } = params[0];
                return `<div style="text-align: center;">
                            <img src="${mapImages[name]}" alt="${name}" style="width: 40px; height: 40px; display: block; margin: 0 auto;" />
                            <strong>${name}</strong>: ${value}
                        </div>`;
            },
        },
        xAxis: {
            type: 'category',
            data: chartData.map(item => item.name),
            axisLabel: {
                rich: {
                    image: {
                        height: 40,
                        width: 40,
                        backgroundColor: {
                            image: (name: string) => mapImages[name],
                        },
                    },
                    name: {
                        fontSize: 14,
                        lineHeight: 16,
                        color: '#333',                   
                    },
                },
            },
        },
        yAxis: {
            type: 'value',
            name: 'Count',
        },
        series: [
            {
                name: 'Maps Played',
                type: 'bar',
                data: chartData.map((item, index) => ({
                    value: item.value,
                    itemStyle: {
                        color: `hsl(${(index * 360) / chartData.length}, 70%, 50%)`,
                    },                  
                })),
            },
        ],
    };

    return <ReactECharts option={chartOptions} />;
};