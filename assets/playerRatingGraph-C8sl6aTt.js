import{a as y,r as d,j as r,E as h}from"./v-react-CxbgOXn3.js";import{e as p,u,h as g,L as b}from"./index-C7ZjwL9S.js";import"./v-echarts-BUbrvsb8.js";import"./v-@sentry-D7IO1rHj.js";import"./v-prosemirror-B74nKu9v.js";import"./v-lodash-BXP2N_uY.js";const S=1e3*60*60,f=async(o,s)=>await fetch(p.endpoints.cscGraphQL.stats,{method:"POST",body:JSON.stringify({operationName:"ProfileTrendGraph",query:`query ProfileTrendGraph($steamId: BigInt!, $season: Int!) {
                    findManyPlayerMatchStats(
                        where: {
                            steamID: {
                                equals: $steamId
                            }, 
                            match: {
                                season: {
                                    equals: $season
                                }
                            }, 
                            side: {
                                equals: 4
                            }
                        }
                        orderBy: {
                            matchId: asc
                        }
                    ) {
                        rating
                        impactRating
                        damage
                        adr
                        deaths
                        rounds
                        assists
                        KR
                        ef
                        kast
                        utilDmg
                        TRating
                        ctRating
                        match {
                            matchDay
                            matchId
                            __typename
                        }
                        __typename
                    }
                }`,variables:{season:s,steamId:o}}),headers:{"Content-Type":"application/json"}}).then(async l=>l.json().then(m=>m.data.findManyPlayerMatchStats));function w(o,s){return y([`cscstats-${o}-trend-graph`],()=>f(o,s),{enabled:!!o,staleTime:S})}function R({player:o}){const{seasonAndMatchType:s}=u(),{data:l,isLoading:m}=w(o.steam64Id,s.season),t=d.useMemo(()=>{if(l)return s.matchType.includes("Combine")?l.sort((a,i)=>{const e=parseInt(a.match.matchDay.slice(1),10),n=parseInt(i.match.matchDay.slice(1),10);return e-n}):[...l.filter(a=>a.match.matchDay.includes("M"))].sort((a,i)=>{const e=parseInt(a.match.matchDay.slice(1),10),n=parseInt(i.match.matchDay.slice(1),10);return e-n})},[l]),c={title:{text:"Trends",textStyle:{color:"#fff"},textAlign:"left",top:"16px",padding:[12,0,0,24]},legend:{data:["Rating","HLTV","Impact","KAST","ADR","EF","UtilDmg","HS%","DMG","SideRating"],padding:[0,0,8,0],textStyle:{color:"#fff",fontSize:12},icon:"roundRect",selected:{Rating:!0,HLTV:!1,Impact:!1,ADR:!1,EF:!1,KAST:!1,UtilDmg:!1,"HS%":!1,DMG:!1,SideRating:!1},bottom:"0"},xAxis:{type:"category",data:t==null?void 0:t.map(a=>(a.match.matchDay,a.match.matchDay)),boundaryGap:!1,minorSplitLine:{show:!1},minorTick:{show:!1}},yAxis:{min:.2,type:"value",minorSplitLine:{show:!1},minorTick:{show:!1},splitLine:{show:!1}},series:[{name:"Rating",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.rating.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#9061F9",type:"solid"},itemStyle:{color:"#9061F9"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"HLTV",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>g(a.kast,a.KR,a.deaths,a.adr,a.assists,a.rounds).toFixed(2)),smooth:!0,lineStyle:{width:2,color:"orange",type:"solid"},itemStyle:{color:"orange"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"KAST",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.kast.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#f97316",type:"solid"},itemStyle:{color:"#f97316"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"ADR",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.adr.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#0ea5e9",type:"solid"},itemStyle:{color:"#0ea5e9"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"Impact",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.impactRating.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#10b981",type:"solid"},itemStyle:{color:"#10b981"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"EF",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.ef.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#eab308",type:"solid"},itemStyle:{color:"#eab308"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"UtilDmg",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.utilDmg.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#f43f5e",type:"solid"},itemStyle:{color:"#f43f5e"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"DMG",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.damage),smooth:!0,lineStyle:{width:2,color:"red",type:"solid"},itemStyle:{color:"red"},symbol:"circle",symbolSize:6,showSymbol:!0,markLine:{symbol:"none",animation:!0,animationEasing:"cubicIn",label:{show:!1},data:[{type:"average",name:"Avg"}]}},{name:"SideRating",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.ctRating.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#30b3ff",type:"dashed"},itemStyle:{color:"#30b3ff"},symbol:"circle",symbolSize:6,showSymbol:!0},{name:"SideRating",type:"line",animationEasing:"quarticIn",data:t==null?void 0:t.map(a=>a.TRating.toFixed(2)),smooth:!0,lineStyle:{width:2,color:"#ff3072",type:"dashed"},itemStyle:{color:"#ff3072"},symbol:"circle",symbolSize:6,showSymbol:!0}],animation:!0,tooltip:{trigger:"axis",formatter:function(a){let i="";if(Array.isArray(a))a.forEach(e=>{let n=`<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${e.color};"></span>`;e.seriesName==="SideRating"?e.color==="#30b3ff"?i+=`${n} CT Side: ${e.data} <br/>`:e.color==="#ff3072"?i+=`${n} T Side: ${e.data} <br/>`:i+=`${n} ${e.seriesName}: ${e.data} <br/>`:i+=`${n} ${e.seriesName}: ${e.data} <br/>`});else{let e=`<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${a.color};"></span>`;i+=`${e} ${a.seriesName}: ${a.data} <br/>`}return i}}};return m?r.jsx("div",{className:"mx-auto pt-16",children:r.jsx(b,{})}):r.jsx(h,{loadingOption:m,option:c,style:{height:"100%",width:"100%"}})}export{R as PlayerRatingTrendGraph};
