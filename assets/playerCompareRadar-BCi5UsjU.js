import{u as h,g,y as n,z as f,j as v,E as w}from"./index-B3Rvoy9Y.js";function b({selectedPlayers:s,tier:a,statOptions:r,startAngle:i=90}){const{players:t}=h(),d=g(t,{tier:a}),l={name:`${a} Average`,tier:{name:a},stats:{name:`${a} Average`,...d.average}},u={name:`${a} Average`,lineStyle:{width:1,type:"dotted"},value:r.map(e=>n(l,[...t,l],e)),label:{show:!0,formatter:function(e){return e.value}}},c=s.map(e=>({name:e.name,value:r.map(o=>n(e,Object.values(e.statsOutOfTier??{}).some(p=>p.tier===e.tier.name)?[...t,e]:t,o)),label:{show:!0,formatter:function(o){return o.value}}})),m={legend:{data:[...s.map(e=>`${e.name}`),`${a} Average`],textStyle:{color:"#B9B8CE"}},darkMode:!0,radar:{radius:"75%",startAngle:i,label:{show:!0},shape:"circle",indicator:r.map(e=>({name:f[e],max:100,min:0})),toolTip:{show:!0},gradientColor:["#f6efa61","#d882732","#bf444c"],splitNumber:4,axisNameGap:15,splitArea:{areaStyle:{color:["#0c0c18","#0f0f1c","#111121","#131325"],shadowColor:"rgba(0, 0, 0, 0.2)",shadowBlur:10}},axisLabel:{show:!1},axisLine:{show:!0,lineStyle:{width:1,color:"#4D4D4D",type:"dashed"},onZero:!0},splitLine:{lineStyle:{color:"#4D4D4D"}}},axisName:{color:"#fff",backgroundColor:"#666",borderRadius:0,padding:[3,5]},series:[{emphasis:{show:!1,label:{fontSize:20},lineStyle:{width:8}},label:{position:"top"},select:{},selectedMode:"single",name:"X",type:"radar",data:[...c,u]}]};return v.jsx(w,{option:m,style:{height:"700px",width:"100%"}})}export{b as PlayerCompareRadar};