import { EChartsOption } from "echarts";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { Player } from "../../models/player";
import { useDataContext } from "../../DataContext";
import { useCscStatsProfileTrendGraph } from "../../dao/cscProfileTrendGraph";
import { Loading } from "./loading";
import { calculateHltvTwoPointOApproximation } from "../utils/player-utils";
import { dataConfiguration } from "../../dataConfig";

type Props = {
  player: Player;
};

export function PlayerRatingTrendGraph({ player }: Props) {
  const { dataConfig } = useDataContext();
  const { data: cscPlayerProfile, isLoading } = useCscStatsProfileTrendGraph(
    player.steam64Id,
    dataConfig?.season
  );

  console.info( cscPlayerProfile )

  const sortedCscPlayerProfile = React.useMemo(() => {
    if (cscPlayerProfile) {
      // HACK: Check if combines in Season Name so trendgraph continues working during combines
      if( dataConfiguration[0].name.includes("Combines")){
        return cscPlayerProfile.sort((a, b) => {
          const matchDayA = parseInt(a.match.matchDay.slice(1), 10);
          const matchDayB = parseInt(b.match.matchDay.slice(1), 10);
    
          return matchDayA - matchDayB;
        });
      }
      // HACK: Filter'd on 'M' to remove combine info (Mixed types dates/static match day number)
      return [...cscPlayerProfile.filter(match => match.match.matchDay.includes("M"))].sort((a, b) => {
        const matchDayA = parseInt(a.match.matchDay.slice(1), 10);
        const matchDayB = parseInt(b.match.matchDay.slice(1), 10);
  
        return matchDayA - matchDayB;
      });
    }
    return undefined;
  }, [cscPlayerProfile]);

  const defaultOptions: EChartsOption = {
    title: {
      text: "Trends",
      textStyle: {
        color: "#fff",
      },
      textAlign: "left",
      top: "16px",
      padding: [12, 0, 0, 24],
    },
    legend: {
      data: ["Rating", "HLTV", "Impact", "KAST", "ADR", "EF", "UtilDmg", "HS%", "DMG", "SideRating"],
      padding: [0, 0, 8, 0],
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
      icon: "roundRect",
      selected: {
        Rating: true,
        HLTV: false,
        Impact: false,
        ADR: false,
        EF: false,
        KAST: false,
        UtilDmg: false,
        "HS%": false,
        DMG: false,
        SideRating: false,
      },
      bottom: "0",
    },
    xAxis: {
      type: "category",
      data: sortedCscPlayerProfile?.map((match) => 
         match.match.matchDay ? match.match.matchDay : match.match.matchDay
      ),
      boundaryGap: false,
      minorSplitLine: {
        show: false,
      },
      minorTick: {
        show: false,
      }
    },
    yAxis: {
      min: 0.2,
      type: "value",
      minorSplitLine: {
        show: false,
      },
      minorTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: "Rating",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.rating.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#9061F9",
          type: "solid",
        },
        itemStyle: {
          color: "#9061F9",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "HLTV",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => calculateHltvTwoPointOApproximation( match.kast, match.KR, match.deaths, match.adr, match.assists, match.rounds).toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "orange",
          type: "solid",
        },
        itemStyle: {
          color: "orange",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "KAST",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.kast.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#f97316",
          type: "solid",
        },
        itemStyle: {
          color: "#f97316",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "ADR",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.adr.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#0ea5e9",
          type: "solid",
        },
        itemStyle: {
          color: "#0ea5e9",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "Impact",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.impactRating.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#10b981",
          type: "solid",
        },
        itemStyle: {
          color: "#10b981",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "EF",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.ef.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#eab308",
          type: "solid",
        },
        itemStyle: {
          color: "#eab308",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "UtilDmg",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.utilDmg.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#f43f5e",
          type: "solid",
        },
        itemStyle: {
          color: "#f43f5e",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      // {
      //   name: "HS%",
      //   type: "line",
      //   animationEasing: "quarticIn",
      //   data: sortedCscPlayerProfile?.map((match) => match.hs),
      //   smooth: true,
      //   lineStyle: {
      //     width: 2,
      //     color: "#ffe100",
      //     type: "solid",
      //   },
      //   itemStyle: {
      //     color: "#ffe100",
      //   },
      //   symbol: "circle",
      //   symbolSize: 6,
      //   showSymbol: true,
      //   markLine: {
      //     symbol: "none",
      //     animation: true,
      //     animationEasing: "cubicIn",
      //     label: { 
      //       show: false,
      //     },
      //     data: [{
      //       type: "average",
      //       name: "Avg"
      //     }]
      //   }
      // },
      {
        name: "DMG",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.damage),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "red",
          type: "solid",
        },
        itemStyle: {
          color: "red",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
        markLine: {
          symbol: "none",
          animation: true,
          animationEasing: "cubicIn",
          label: { 
            show: false,
          },
          data: [{
            type: "average",
            name: "Avg"
          }]
        }
      },
      {
        name: "SideRating",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.ctRating.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#30b3ff",
          type: "dashed",
        },
        itemStyle: {
          color: "#30b3ff",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
      },
      {
        name: "SideRating",
        type: "line",
        animationEasing: "quarticIn",
        data: sortedCscPlayerProfile?.map((match) => match.TRating.toFixed(2)),
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#ff3072",
          type: "dashed",
        },
        itemStyle: {
          color: "#ff3072",
        },
        symbol: "circle",
        symbolSize: 6,
        showSymbol: true,
      },
    ],
    animation: true,
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let tooltipText = '';
        if (Array.isArray(params)) {
          params.forEach(param => {
            let coloredDot = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
            if (param.seriesName === "SideRating") {
              if (param.color === '#30b3ff') {
                tooltipText += `${coloredDot} CT Side: ${param.data} <br/>`;
              } else if (param.color === '#ff3072') {
                tooltipText += `${coloredDot} T Side: ${param.data} <br/>`;
              } else {
                tooltipText += `${coloredDot} ${param.seriesName}: ${param.data} <br/>`;
              }
            } else {
              tooltipText += `${coloredDot} ${param.seriesName}: ${param.data} <br/>`;
            }
          });
        } else {
          let coloredDot = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>`;
          tooltipText += `${coloredDot} ${params.seriesName}: ${params.data} <br/>`;
        }
        return tooltipText;
      },
    },
  };

  return !isLoading ? (
    <ReactECharts
      loadingOption={isLoading}
      option={defaultOptions}
      style={{ height: "100%", width: "100%" }}
    />
  ) : (
    <div className="mx-auto pt-16">
      <Loading />
    </div>
  );
}