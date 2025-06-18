import { clamp, cloneDeep } from "lodash";
import { CscStats } from "../../models/csc-stats-types";
import { Player } from "../../models/player";
import { sortBy, get, set } from "lodash";
import { calculatePercentage } from "./string-utils";

export enum PlayerTypes {
	SIGNED = "SIGNED",
	FREE_AGENT = "FREE_AGENT",
	DRAFT_ELIGIBLE = "DRAFT_ELIGIBLE",
	PERMANENT_FREE_AGENT = "PERMANENT_FREE_AGENT",
	SPECTATOR = "SPECTATOR",
	INACTIVE_RESERVE = "INACTIVE_RESERVE",
	SIGNED_SUBBED = "SIGNED_SUBBED",
	TEMPSIGNED = "TEMPSIGNED",
	PERMFA_TEMP_SIGNED = "PERMFA_TEMP_SIGNED",
	UNROSTERED_GM = "UNROSTERED_GM",
	UNROSTERED_AGM = "UNROSTERED_AGM",
	INACTIVE = "INACTIVE",
	SIGNED_PROMOTED = "SIGNED_PROMOTED",
	EXPIRED = "EXPIRED",
}

export const PlayerMappings: Record<string, string> = {
	name: "Name",
	gameCount: "Games Played",
	rating: "Rating",
	kr: "Kills / Round",
	adr: "Damage / Round",
	kast: "Kill Assist Traded Survived (%)",
	odr: "Opening Duel (%)",
	impact: "Impact",
	adp: "Average Death Placement",
	utilDmg: "Utility Damage per Match",
	ef: "Enemies Flashed per Match",
	fAssists: "Flash Assists per Match",
	util: "Utility Thrown / Match",
	hs: "Headshot (%)",
	awpR: "Awp Kills / Round",
	multiR: "Multi-Kills / Round", // points based on difficulty/remaining players
	clutchR: "Clutch-ability", // points based on difficulty/remaining players
	suppR: "Support Rounds",
	suppXR: "Support Damage / Round",
	odaR: "Open Duel Attempts / Round",
	entriesR: "Entry Kill on T-side / Round",
	tradesR: "Trade Kills / Round",
	tRatio: "Deaths Traded Out (%)",
	savesR: "Saves / Round",
	sRate: "Rounds Survived (%)",
	twoK: "2K Rounds",
	threeK: "3K Rounds",
	fourK: "4K Rounds",
	fiveK: "Ace Rounds",
	cl_1: "1v1 Clutches",
	cl_2: "1v2 Clutches",
	cl_3: "1v3 Clutches",
	cl_4: "1v4 Clutches",
	cl_5: "Ace Clutches",
	rounds: "Total Rounds Played",
	peak: "Single Match Rating Peak",
	pit: "Single Match Rating Pit",
	form: "Avg Rating from last 3 games",
	consistency: "Std Deviation from Rating (Lower is better)",
	kills: "Total Kills",
	assists: "Total Assists",
	deaths: "Total Deaths",
	eaR: "Rounds with Opening Duel on T-side",
};
export const statDescriptionsShort: Record<string, string> = {
	name: "Name",
	gameCount: "Games Played",
	rating: "Rating",
	kr: "Kills/Round",
	adr: "ADR",
	kast: "KAST",
	odr: "Opening Duel (%)",
	impact: "Impact",
	adp: "Average Death Placement",
	utilDmg: "Util Dmg",
	ef: "EF/Match",
	fAssists: "FAssists/Match",
	util: "Utility Thrown / Match",
	hs: "HS(%)",
	awpR: "Awp Kills / Round",
	multiR: "Multi-Kills / Round", // points based on difficulty/remaining players
	clutchR: "Clutch-ability", // points based on difficulty/remaining players
	suppR: "Support Rounds",
	suppXR: "Support Damage / Round",
	odaR: "Open Duel Attempts / Round",
	entriesR: "Entry Kill on T-side / Round",
	tradesR: "Trade Kills / Round",
	tRatio: "Deaths Traded Out (%)",
	savesR: "Saves / Round",
	sRate: "Rounds Survived (%)",
	twoK: "2K Rounds",
	threeK: "3K Rounds",
	fourK: "4K Rounds",
	fiveK: "Ace Rounds",
	cl_1: "1v1 Clutches",
	cl_2: "1v2 Clutches",
	cl_3: "1v3 Clutches",
	cl_4: "1v4 Clutches",
	cl_5: "Ace Clutches",
	rounds: "Total Rounds Played",
	peak: "Single Match Rating Peak",
	pit: "Single Match Rating Pit",
	form: "Avg Rating from last 3 games",
	consistency: "Std Deviation from Rating (Lower is better)",
	kills: "Total Kills",
	assists: "Total Assists",
	deaths: "Total Deaths",
	eaR: "Rounds with Opening Duel on T-side",
};

export const tiers = ["Premier", "EliPrem", "Elite", "Challenger", "Contender", "Prospect", "New Tier"];

export const teamNameTranslator = (player?: Player) => {
	const name = player?.team?.name ?? player?.type ?? "";
	switch (name?.toUpperCase()) {
		case "DRAFT_ELIGIBLE":
			return "Draft Eligible";
		case "PERMANENT_FREE_AGENT":
			return "Perm FA";
		case "FREE_AGENT":
			return "Free Agent";
		case "UNROSTERED_GM":
			return `GM`;
		case "UNROSTERED_AGM":
			return `AGM`;
		default:
			return name;
	}
};

export const shortTeamNameTranslator = (player?: Player) => {
	const name = player?.team?.franchise.prefix ?? player?.type ?? "";
	switch (name?.toUpperCase()) {
		case "DRAFT_ELIGIBLE":
			return "DE";
		case "PERMANENT_FREE_AGENT":
			return "PFA";
		case "FREE_AGENT":
			return "FA";
		case "UNROSTERED_GM":
			return `GM`;
		default:
			return name;
	}
};

export function _sort<T>(items: T[], property: string, n?: number, order?: "asc" | "desc") {
	const sorted = sortBy(items, property);
	const orderDirection = order === "desc" ? sorted.reverse() : sorted;
	return n ? orderDirection.slice(0, n) : orderDirection;
}

export function _sortByGameCount(items: Player[], property: string, n?: number, order?: "asc" | "desc") {
	const deepCopy = cloneDeep(items);
	const dividedByGameCount = deepCopy.map(item => {
		set(item as object, 
			property, 
			+get(item, property) / (item.stats.gameCount + (item.statsOutOfTier ?? [])
				.map((o: any) => o?.stats?.gameCount ?? 0)
				.reduce((a : number, b: number) => a + b, 0)
		)
	);
		return item; 
	});
	return _sort(dividedByGameCount, property, n, order);
}

export const getPlayersInTier = (player: Player, allPlayers: Player[]) =>
	allPlayers.filter(ap => ap.tier.name === player.tier.name);
export const getPlayersInTier3GP = (player: Player, allPlayers: Player[]) =>
	allPlayers.filter(ap => ap.tier.name === player.tier.name && ap.stats?.gameCount > 3);
export const getPlayersInTierOrderedByRating = (player: Player, allPlayers: Player[]) =>
	getPlayersInTier(player, allPlayers)
		.sort((a, b) => {
			const aPlayerGameCount = a.stats?.gameCount ?? 0;
			const bPlayerGameCount = b.stats?.gameCount ?? 0;
			return aPlayerGameCount > bPlayerGameCount ? 1 : -1;
		})
		.sort((a, b) => {
			if (!a.stats?.rating || a.stats.gameCount < 3) {
				return 1;
			}
			if (!b.stats?.rating || b.stats.gameCount < 3) {
				return -1;
			}
			return a.stats?.rating < b.stats?.rating ? 1 : -1;
		});

export const getPlayerPercentileStatInTier = (player: Player, allPlayers: Player[], property: keyof CscStats) => {
	const playersInTier = getPlayersInTier(player, allPlayers);
	const sortedPlayers = playersInTier
		.filter(p => p.stats)
		.sort((a, b) => (a.stats[property] as any) - (b.stats[property] as any));
	const indexOfPlayer = sortedPlayers.findIndex(p => p.name === player.name);
	return calculatePercentage(indexOfPlayer + 1, sortedPlayers.length, 0);
};

export const getTop10PlayersInTier3GP = (player: Player, allPlayers: Player[], property: keyof CscStats) => {
	const playersInTier3GP = getPlayersInTier3GP(player, allPlayers);
	const sortedPlayers = playersInTier3GP.sort((a, b) => (b.stats[property] as any) - (a.stats[property] as any));
	return sortedPlayers.slice(0, 10);
};
export const getPlayerRatingIndex = (player: Player, allPlayers: Player[]) => {
	const playersInTierSortedByRating = getPlayersInTierOrderedByRating(player, allPlayers);
	return playersInTierSortedByRating.findIndex(p => p.name === player.name);
};

export const getPlayerTeammates = (player: Player, allPlayers: Player[]) => {
	return allPlayers.filter(player => !["DE", "FA", "PFA"].includes(player?.type ?? ""));
	// .filter( allPlayers => allPlayers.tier === player.Tier && allPlayers.Team === player.Team && allPlayers.Name !== player.Name);
};

export const getTotalPlayerAverages = (Players: Player[], options?: Record<string, unknown>) => {
	const players = options?.tier ? Players.filter(p => p.tier.name === options?.tier) : Players;
	const playersWithStats = players.filter(p => p.stats);
	const standardDeviation: Record<string, number> = {};
	const average: Record<string, number> = {};
	const median: Record<string, any> = {};
	const lowest: Record<string, any> = {};
	const highest: Record<string, any> = {};

	for (const key in PlayerMappings) {
		const statsKey = key as keyof CscStats;

		// TODO: FIX
		standardDeviation[key] = calculateStandardDeviation([], statsKey);
		average[key] = calculateAverage(
			playersWithStats.map(p => p.stats),
			statsKey,
		);
		median[key] = calcuateMedian(
			playersWithStats.map(p => p.stats),
			statsKey,
		);
		lowest[key] = calculateMinMax(
			playersWithStats.map(p => p.stats),
			statsKey,
			"min",
		);
		highest[key] = calculateMinMax(
			playersWithStats.map(p => p.stats),
			statsKey,
			"max",
		);
	}

	return {
		standardDeviation,
		average,
		median,
		lowest,
		highest,
	};
};

function calculateStandardDeviation(players: CscStats[], prop: string) {
	const mean = players.map(p => Number(p[prop as keyof CscStats])).reduce((a, b) => a + b, 0) / players.length;
	return Number(
		Math.sqrt(
			players.map(p => Math.pow(Number(p[prop as keyof CscStats]) - mean, 2)).reduce((a, b) => a + b, 0) /
				players.length,
		).toFixed(2),
	);
}

function calculateAverage(players: CscStats[], prop: string) {
	return Number(
		(
			players.reduce((cumulative, player) => cumulative + Number(player[prop as keyof CscStats]), 0) /
			players.length
		).toFixed(2),
	);
}

function calculateMinMax(players: CscStats[], prop: keyof CscStats, type: "min" | "max") {
	const sortedPlayers = _sort(players, prop);
	if (sortedPlayers.length === 0) return [];
	return type === "max" ?
			Number(Number(sortedPlayers.reverse()[0][prop]).toFixed(2))
		:	Number(Number(sortedPlayers[0][prop]).toFixed(2));
}

function calcuateMedian(players: CscStats[], prop: keyof CscStats) {
	const sortedPlayers = _sort(
		players.filter(p => Boolean(p)),
		prop,
	);
	if (sortedPlayers.length === 0 || typeof sortedPlayers[0][prop] !== "number") return undefined;
	if (sortedPlayers.length % 2 === 0) {
		return (
			Number(
				(
					Number(sortedPlayers[sortedPlayers.length / 2 - 1][prop]) +
					Number(sortedPlayers[sortedPlayers.length / 2][prop])
				).toFixed(2),
			) / 2
		);
	}
	return Number(Number(sortedPlayers[Math.floor(sortedPlayers.length / 2)][prop]).toFixed(2));
}

export function determinePlayerRole(stats: CscStats) {
	if (!stats?.gameCount || stats?.gameCount < 3) return "RIFLER";
	const roles = {
		AWPER: clamp(stats["awpR"], 0, 0.4) / 0.4, // Awper
		ENTRY: clamp(stats.odr * (stats["odaR"] * 3), 0, 1) / 1, // Entry
		FRAGGER: clamp(stats["multiR"], 0, 1.3) / 1.3, // Fragger
		RIFLER: clamp(stats.adr, 0, 230) / 230, // Rifler
		SUPPORT: clamp(stats.suppR * 12 + stats.suppXR, 0, 57) / 57, // Support
		//clamp(player.stats["wlpL"], 0, 5), // Lurker
	};

	return Object.entries(roles).reduce((role, [key, value]) => (value > role[1] ? [key, value] : role), ["", 0])[0];
}

export const calculateImpactApproximate = (killsPerRound: number, assistsPerRound: number) =>
	2.13 * killsPerRound + 0.42 * assistsPerRound - 0.41;

export function calculateHltvTwoPointOApproximationFromStats(stats: CscStats) {
	const { kast, kr: killsPerRound, deaths, adr, assists, rounds } = stats;
	return calculateHltvTwoPointOApproximation(kast, killsPerRound, deaths, adr, assists, rounds);
}

export function calculateHltvTwoPointOApproximation(
	kast: number,
	killsPerRound: number,
	deaths: number,
	adr: number,
	assists: number,
	rounds: number,
) {
	const calculatedImpact = calculateImpactApproximate(killsPerRound, assists / rounds);

	const xkast = 0.0073 * (kast * 100);
	const xkillsPerRound = 0.3591 * killsPerRound;
	const xdeathsPerRound = -0.5329 * (deaths / rounds);
	const ximpact = 0.2372 * calculatedImpact;
	const xavgDmgPerRround = 0.0032 * adr;

	return xkast + xkillsPerRound + xdeathsPerRound + ximpact + xavgDmgPerRround + 0.1587;
}
