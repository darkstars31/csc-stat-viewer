import{j as e,Z as S,Q as U,R as E,b0 as I}from"./v-react-CxbgOXn3.js";import{u as C,P as v,b as R,f as j,F as N}from"./index-Cu9HCLvR.js";import"./v-echarts-BUbrvsb8.js";import"./v-@sentry-D7IO1rHj.js";import"./v-prosemirror-B74nKu9v.js";import"./v-lodash-BXP2N_uY.js";const s={Recruit:"Recruit",Prospect:"Prospect",Contender:"Contender",Challenger:"Challenger",Elite:"Elite",Premier:"Premier"},b=[{prefix:"UPS",discordUrl:"https://discord.gg/VPdMevRF",inceptionSeason:7,trophies:[{season:14,tier:s.Elite},{season:14,tier:s.Challenger},{season:12,tier:s.Premier},{season:12,tier:s.Challenger},{season:11,tier:s.Recruit},{season:10,tier:s.Prospect},{season:9,tier:s.Elite},{season:8,tier:s.Premier},{season:7,tier:s.Challenger}]},{prefix:"WET",discordUrl:"https://discord.gg/hWn2DGhf",inceptionSeason:11,trophies:[{season:14,tier:s.Prospect},{season:13,tier:s.Contender},{season:11,tier:s.Contender}]},{prefix:"H4K",discordUrl:"",inceptionSeason:8,trophies:[{season:14,tier:s.Contender},{season:13,tier:s.Elite},{season:12,tier:s.Elite},{season:11,tier:s.Elite},{season:10,tier:s.Elite}]},{prefix:"OS",discordUrl:"",inceptionSeason:2,trophies:[{season:8,tier:s.Challenger},{season:7,tier:s.Prospect},{season:6,tier:"Minor"}]},{prefix:"HG",discordUrl:"",inceptionSeason:6,trophies:[{season:14,tier:s.Premier},{season:13,tier:s.Challenger},{season:10,tier:s.Premier},{season:9,tier:s.Challenger},{season:7,tier:s.Premier},{season:7,tier:s.Elite}]},{prefix:"SAV",discordUrl:"https://discord.gg/BAbNKr55",inceptionSeason:5,trophies:[{season:12,tier:s.Recruit},{season:9,tier:s.Contender}]},{prefix:"ATL",discordUrl:"",inceptionSeason:10,trophies:[{season:13,tier:s.Prospect},{season:10,tier:s.Challenger}]},{prefix:"AVI",discordUrl:"https://discord.gg/uXHms59b",inceptionSeason:7,trophies:[{season:13,tier:s.Premier},{season:11,tier:s.Prospect},{season:8,tier:s.Elite}]},{prefix:"NAN",discordUrl:"",inceptionSeason:5,trophies:[{season:11,tier:s.Challenger},{season:13,tier:s.Recruit}]},{prefix:"COW",discordUrl:"",inceptionSeason:10,trophies:[{season:11,tier:s.Premier}]},{prefix:"ABW",discordUrl:"",inceptionSeason:13,trophies:[{season:14,tier:s.Recruit}]},{prefix:"dB",discordUrl:"https://discord.gg/sp89uQbX",inceptionSeason:13,trophies:[]},{prefix:"FRG",discordUrl:"https://discord.gg/qfGUbbFgAh",inceptionSeason:11,trophies:[]},{prefix:"BS",discordUrl:void 0,inceptionSeason:8,trophies:[]},{prefix:"GAS",discordUrl:void 0,inceptionSeason:9,trophies:[]},{prefix:"ACA",discordUrl:void 0,inceptionSeason:11,trophies:[]},{prefix:"AG",discordUrl:void 0,inceptionSeason:15,trophies:[]},{prefix:"PA",discordUrl:void 0,inceptionSeason:15,trophies:[]},{prefix:"LEC",discordUrl:void 0,inceptionSeason:13,trophies:[]},{prefix:"GRN",discordUrl:void 0,inceptionSeason:15,trophies:[]},{prefix:"HR",discordUrl:void 0,inceptionSeason:15,trophies:[]},{prefix:"DRG",discordUrl:void 0,inceptionSeason:13,trophies:[]}],u={Recruit:1,Prospect:2,Contender:3,Challenger:4,Elite:5,Premier:6},w={Recruit:"text-red-400",Prospect:"text-orange-400",Contender:"text-yellow-400",Challenger:"text-green-400",Elite:"text-blue-400",Premier:"text-purple-400"};function y({franchise:i,selectedTier:m}){const{players:c,tiers:t}=C(),p=m?i.teams.filter(r=>r.tier.name.toLowerCase()===m.toLowerCase()):i.teams;return e.jsx("div",{className:"grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 p-1 text-sm text-gray-300",children:p.sort((r,d)=>u[d.tier.name]-u[r.tier.name]).map(r=>{var h;let d=0,l=0;r.players.forEach(a=>{var x;const n=c.find(g=>g.steam64Id===a.steam64Id);(n==null?void 0:n.type)===v.INACTIVE_RESERVE||(x=n==null?void 0:n.stats)!=null&&x.rating&&(d+=n.stats.rating,l++)});const o=l>0?(d/l).toFixed(2):"N/A";return e.jsxs(R,{to:`/franchises/${i.name}/${r.name}`,className:"transition hover:bg-slate-600/25 hover:scale-[105%] rounded",children:[e.jsxs("div",{className:"basis-1/4 mx-4 border-b-[1px] border-slate-700 text-center",children:[e.jsx("strong",{children:r.name})," ",e.jsxs("span",{className:`text-gray-400 italic ${w[(h=t==null?void 0:t.find(a=>a.tier.name===r.tier.name))==null?void 0:h.tier.name]}`,children:[r.tier.name," "]}),e.jsxs("div",{className:"flex float-right",children:[e.jsx(S,{size:"1.5em",className:"mr-1 text-orange-500"})," "+o]})]}),e.jsx("div",{className:"mx-4 px-2",children:r.players.length>0?r.players.map(a=>{var x,g;const n=c.find(P=>P.steam64Id===a.steam64Id),f=(n==null?void 0:n.type)===v.INACTIVE_RESERVE;return e.jsxs("div",{className:`${f?"text-slate-500":""}  m-1 grid grid-cols-3 gap-2`,children:[e.jsxs("div",{children:[a.name," ",f?e.jsx("span",{children:"(IR)"}):""," ",((x=r==null?void 0:r.captain)==null?void 0:x.steam64Id)===a.steam64Id?e.jsx(U,{size:"1.5em",className:"inline"}):""]}),e.jsx("div",{className:"text-center",children:(g=n==null?void 0:n.stats)==null?void 0:g.rating.toFixed(2)}),e.jsx("div",{children:n==null?void 0:n.role})]},`${r.tier.name}-${a.name}`)}):e.jsx("div",{className:"my-1 text-center italic text-gray-500",children:"No rostered players"})})]},`${r.tier.name}`)})})}function B({franchise:i,selectedTier:m}){var l;const{players:c}=C(),t=b.find(o=>o.prefix===i.prefix),p=t==null?void 0:t.trophies,r=t==null?void 0:t.discordUrl,d=t==null?void 0:t.inceptionSeason;return e.jsx("div",{className:"relative shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10",children:e.jsx("div",{style:{backgroundImage:`url(${j[i.prefix]})`},className:"bg-repeat bg-fixed bg-center",children:e.jsxs("div",{className:"rounded-md border border-gray-800 md:flex-row overflow-hidden backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] p-2",children:[e.jsx("div",{className:"float-right",children:r?e.jsx("a",{className:"hover:cursor-pointer bg-blue-700 p-1 rounded w-6 float-left m-[1px]",href:((l=b.find(o=>o.prefix===i.prefix))==null?void 0:l.discordUrl)??"",target:"_blank",rel:"noreferrer",children:e.jsx(E,{})}):null}),e.jsx(R,{to:`/franchises/${encodeURIComponent(i.name)}`,children:e.jsxs("div",{className:"flex flex-col sm:flex-row hover:cursor-pointer gap-4",children:[e.jsx("div",{className:"basis-3/12",children:e.jsx("div",{className:"z-10 h-24 w-24 md:w-48 md:h-48",children:e.jsx("img",{src:j[i.prefix],alt:"",loading:"lazy"})})}),e.jsx("div",{children:e.jsxs("div",{className:"basis-6/12 grow flex flex-col m-2 justify-end",children:[e.jsx("div",{className:"basis-2/3 font-bold text-white text-center leading-loose",children:e.jsxs("div",{children:[e.jsx("div",{style:{mixBlendMode:"difference"},className:"text-5xl",children:i.name}),e.jsxs("div",{className:"flex flex-row gap-6 justify-center text-l text-gray-400",children:[e.jsx("div",{children:i.prefix}),e.jsx("div",{className:"border h-3/6 border-gray-400"}),e.jsxs("div",{className:"italic",children:["Est. Season ",d]})]})]})}),e.jsxs("div",{className:"basis-1/2",children:[e.jsx(N,{player:c.find(o=>o.name===i.gm.name),title:"General Manager"}),e.jsx("div",{className:"flex flex-row",children:((i==null?void 0:i.agms)??[]).map(o=>e.jsx(N,{player:c.find(h=>h.name===(o==null?void 0:o.name)),title:"Asst. GM"}))})]})]})}),e.jsx("div",{className:"basis-3/12 text-sm text-yellow-300",children:p==null?void 0:p.map(o=>e.jsxs("div",{className:"flex flex-row gap-1",children:[e.jsx("span",{className:"",children:o.season}),e.jsx(I,{className:"inline mt-1"}),e.jsx("span",{className:"basis-8/12 truncate",children:o.tier})]}))})]})}),e.jsx(y,{franchise:i,selectedTier:m})]})})},`${i.name}`)}export{B as FranchisesFranchise};
