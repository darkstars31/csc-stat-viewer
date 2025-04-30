import ak47 from "../../assets/images/cs2icons/ak47.png";
import m4a4 from "../../assets/images/cs2icons/m4a4.png";
import m4a1 from "../../assets/images/cs2icons/m4a1.png";
import awp from "../../assets/images/cs2icons/awp.png";
import galil from "../../assets/images/cs2icons/galil.png";
import aug from "../../assets/images/cs2icons/aug.png";
import famas from "../../assets/images/cs2icons/famas.png";

import scout from "../../assets/images/cs2icons/scout.png";

import deagle from "../../assets/images/cs2icons/deagle.png";
import usps from "../../assets/images/cs2icons/usp-s.png";
import Glock from "../../assets/images/cs2icons/glock.png";
import duelies from "../../assets/images/cs2icons/duelies.png";
import fiveseven from "../../assets/images/cs2icons/fiveseven.png";
import p2000 from "../../assets/images/cs2icons/p2000.png";
import tec9 from "../../assets/images/cs2icons/tec9.png";
import cz from "../../assets/images/cs2icons/cz.png";
import r8revolver from "../../assets/images/cs2icons/r8revolver.png";
import MP9 from "../../assets/images/cs2icons/mp9.png";
import mp5 from "../../assets/images/cs2icons/mp5.png";
import mp7 from "../../assets/images/cs2icons/mp7.png";
import mac10 from "../../assets/images/cs2icons/mac10.png";
import ump from "../../assets/images/cs2icons/ump.png";
import p90 from "../../assets/images/cs2icons/p90.png";
import ppbizon from "../../assets/images/cs2icons/ppbizon.png";
import p250 from "../../assets/images/cs2icons/p250.png";
import negev from "../../assets/images/cs2icons/negev.png";
import sawedoff from "../../assets/images/cs2icons/sawed-off.png";
import nova from "../../assets/images/cs2icons/nova.png";
import xm1014 from "../../assets/images/cs2icons/xm1014.png";
import mag7 from "../../assets/images/cs2icons/mag7.png";
import krieg from "../../assets/images/cs2icons/krieg.png";

import m249 from "../../assets/images/cs2icons/m249.png";

import Knife from "../../assets/images/cs2icons/knife.png";
import zues from "../../assets/images/cs2icons/zues.png";

import he from "../../assets/images/cs2icons/HE.png";
import molly from "../../assets/images/cs2icons/molly.png";

import noScope from "../../assets/images/cs2icons/noScope.png";
import blindKill from "../../assets/images/cs2icons/blindKill.png";
import smokeKill from "../../assets/images/cs2icons/smokeKill.png";
import wallBang from "../../assets/images/cs2icons/wallBang.png";
import flashAssist from "../../assets/images/cs2icons/flashassist.png";
import suicide from "../../assets/images/cs2icons/suicide.png";
import headshot from "../../assets/images/cs2icons/headshot.png";
import airborne from "../../assets/images/cs2icons/airborne.png";

type Cs2Icons = Record<string, string>;

const rifles = {
	"AK-47": ak47,
	M4A4: m4a4,
	M4A1: m4a1,
	"Galil AR": galil,
	AUG: aug,
	FAMAS: famas,
	"SG 553": krieg,
};

const snipers = {
	AWP: awp,
	"SSG 08": scout,
	"G3SG1": awp,
};

const subMachineGuns = {
	MP9: MP9,
	"MP5-SD": mp5,
	MP7: mp7,
	P90: p90,
	"UMP-45": ump,
	"PP-Bizon": ppbizon,
	"MAC-10": mac10,
};

const heavy = {
	M249: m249,
	Negev: negev,
};

const shotguns = {
	"Sawed-Off": sawedoff,
	Nova: nova,
	XM1014: xm1014,
	"MAG-7": mag7,
};

const pistols = {
	"Desert Eagle": deagle,
	"USP-S": usps,
	"Glock-18": Glock,
	"Dual Berettas": duelies,
	"Five-SeveN": fiveseven,
	P2000: p2000,
	P250: p250,
	"Tec-9": tec9,
	"CZ75 Auto": cz,
	"R8 Revolver": r8revolver,
};

const other = {
	Knife: Knife,
	"Zeus x27": zues,
	"HE Grenade": he,
	"Incendiary Grenade": molly,
	Molotov: molly,
	Flashbang: flashAssist,
};

export const cs2killfeedIcons: Cs2Icons = {
	noScope,
	blindKill,
	smokeKill,
	wallBang,
	flashAssist,
	suicide,
	airborne,
	headshot,
};
export const cs2icons: Cs2Icons = {
	...rifles,
	...snipers,
	...subMachineGuns,
	...shotguns,
	...pistols,
	...other,
	...heavy,
};
