import{j as a}from"./v-react-CxbgOXn3.js";import{S as d}from"./stats-Df2NM7Fm.js";import{l as S}from"./index-Cu9HCLvR.js";import"./v-echarts-BUbrvsb8.js";import"./v-@sentry-D7IO1rHj.js";import"./v-prosemirror-B74nKu9v.js";import"./v-lodash-BXP2N_uY.js";function f({players:i,limit:n}){const l=["Zeus x27","Knife","AK-47","M4A1","M4A4","Galil AR","FAMAS","AUG","SG 553","AWP","SSG 08","Desert Eagle","USP-S","Glock-18","P2000","P250","Five-SeveN","Tec-9","Dual Berettas","CZ75 Auto","R8 Revolver","MP5-SD","MP7","MP9","UMP-45","P90","PP-Bizon","XM1014","Nova","Sawed-Off","MAG-7","MAC-10","M249","Negev","Incendiary Grenade","Molotov","HE Grenade"].map(e=>{const o=i.filter(t=>t.extendedStats).sort((t,r)=>{var s;return((r==null?void 0:r.extendedStats.weaponKills[e])??0)-(((s=t.extendedStats)==null?void 0:s.weaponKills[e])??0)}).slice(0,n);return{title:e,rows:o.map(t=>{var r;return{player:t,value:((r=t.extendedStats)==null?void 0:r.weaponKills[e])??0}})}});return a.jsx(a.Fragment,{children:l.map(e=>a.jsx(d,{title:e.title,headerImage:S[e.title],rows:e.rows.filter(o=>o.value>0)},e.title))})}export{f as WeaponLeaderboards};