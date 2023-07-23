import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Player, CscStats } from "../../models";
import ReactECharts from "echarts-for-react";
import * as Containers from "../../common/components/containers";


type Props = {
  playerData?: Player[];
};

type BarData = {
  value: number;
  itemStyle: {
    color: string;
  };
};
type TooltipParams = {
  axisValueLabel: string;
  value: number;
}[];
type ChartOption = {
  title: {
    text: string;
    left: string;
    top: string;
    textStyle: {
      align: string;
      color: string;
    };
  };
  xAxis: {
    type: "category";
    data: string[];
    axisLabel: {
      interval: number;
      rotate: number;
    };
  };
  yAxis: {
    type: "value";
    name: string;
  };
  tooltip: {
    trigger: "axis";
    formatter: (params: any) => string; 
    };
  grid: {
    left: string;
    right: string;
    top: string;
    bottom: string;
    containLabel: boolean;
  };
  series: {
    type: "bar";
    data: BarData[];
  }[];
};


type CorrelationData = [string, (number | undefined)[]][];

const CHART_HEIGHT = 300;
const RED_THRESHOLD = 0.7;
const ORANGE_THRESHOLD = 0.5;
const YELLOW_THRESHOLD = 0.3;
const TIERS = ["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier"];


export function CorrelationByTier({ playerData = [] }: Props) {
  const [options, setOptions] = useState<ChartOption[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationData>([]);
  const [selectedRating, setSelectedRating] = useState('mmr');

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
  };

  const getBarColor = useCallback((coefficient: number, red: number, orange: number, yellow: number): string => {
    if (coefficient >= red || coefficient <= -red) return 'red';
    if (coefficient >= orange || coefficient <= -orange) return 'orange';
    if (coefficient >= yellow || coefficient <= -yellow) return 'yellow';
    return 'green';
  }, []);

  const playerStatsKeys = useMemo(() => {
    if (playerData.length > 0 && playerData[0].stats) {
      return Object.keys(playerData[0].stats) as (keyof CscStats)[];
    }
    return [];
  }, [playerData]);

  useEffect(() => {
    (async () => {
      const NUM_WORKERS = navigator.hardwareConcurrency || 4;
  
      const chunkSize = Math.ceil(TIERS.length / NUM_WORKERS);
      const chunks = Array.from({ length: NUM_WORKERS }, (_, i) =>
        TIERS.slice(i * chunkSize, i * chunkSize + chunkSize)
      );
  
      const workers = chunks.map((chunk, i) => {
        const worker = new Worker("./correlation-worker.js");
  
        worker.postMessage({
          playerData,
          tiers: chunk,
          statsKeys: playerStatsKeys,
          ratingKey: selectedRating,
        });
  
        return worker;
      });
  
      const results = await Promise.all(
        workers.map(
          (worker) =>
            new Promise<CorrelationData>((resolve, reject) => {
              const onMessage = (e: MessageEvent) => {
                worker.removeEventListener("message", onMessage);
                worker.terminate();
                if (Array.isArray(e.data) && e.data.every(
                  (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === "string" && Array.isArray(item[1]) && item[1].every(
                    (subItem) => typeof subItem === "number" || subItem === undefined
                  )
                )) {
                  resolve(e.data);
                } else {
                  reject(new Error("Invalid data format from worker."));
                }
              };
              const onError = (e: ErrorEvent) => {
                worker.removeEventListener("error", onError);
                worker.terminate();
                reject(e.message);
              };
      
              worker.addEventListener("message", onMessage);
              worker.addEventListener("error", onError);
            })
        )
      );
      
      setCorrelationData(results.flat() as CorrelationData);
    })();
  }, [playerData, playerStatsKeys, selectedRating]);

  



  useEffect(() => {
    const newOptions: ChartOption[] = playerStatsKeys.map((stat, statIndex) => {
      if (stat !== "rating") {
        const correlationCoefficients: BarData[] = correlationData.map(([tier, coefficients]): BarData | undefined => {
          const coefficient = coefficients[statIndex];
          if (typeof coefficient === 'number') {
            return {
              value: coefficient,
              itemStyle: { color: getBarColor(coefficient, RED_THRESHOLD, ORANGE_THRESHOLD, YELLOW_THRESHOLD) }
            };
          }
          return undefined;
        }).filter((barData): barData is BarData => barData !== undefined);

        return {
          title: { 
            text: `Correlation - ${selectedRating === 'mmr' ? selectedRating.toUpperCase() : selectedRating.charAt(0).toUpperCase() + selectedRating.slice(1)} and ${stat}`,
            left: '5%',
            top: '5%', 
            textStyle: {
              align: 'center',
              color: '#FFFFFF', 
            },
          },
          xAxis: {
            type: "category",
            data: TIERS,
            axisLabel: {
              interval: 0, 
              rotate: 45 
            }
          },
          yAxis: { type: "value", name: "" },
          tooltip: {
            trigger: "axis",
            formatter: function(params: TooltipParams) {
              return `${params[0].axisValueLabel}: ${params[0].value.toFixed(2)}`;
            }
          },            
          grid: { 
            left: "5%", 
            right: "5%", 
            top: "20%", 
            bottom: "5%", 
            containLabel: true 
          },
          series: [{ type: "bar", data: correlationCoefficients }]
        };
      }
      return null;
    }).filter((option): option is ChartOption => option !== null);

    setOptions(newOptions);
  }, [correlationData, getBarColor, playerStatsKeys, selectedRating]);

  return (
    <>
      <Containers.ChartButtonBoundingBox>
        <Containers.ChartButtonBox isSelected={selectedRating === 'mmr'} onClick={() => handleRatingChange('mmr')}>
          MMR
        </Containers.ChartButtonBox>
        <Containers.ChartButtonBox isSelected={selectedRating === 'rating'} onClick={() => handleRatingChange('rating')}>
          Rating
        </Containers.ChartButtonBox>
      </Containers.ChartButtonBoundingBox>
      
        <Containers.StandardBoxRow>
          {options.map((option) => (
            <Containers.StandardContentBox key={`chart-${option.title.text}`}>
              <ReactECharts option={option} className="w-full" style={{ height: CHART_HEIGHT }} notMerge={true} />
            </Containers.StandardContentBox>
          ))}
        </Containers.StandardBoxRow>
    </>
  );
}