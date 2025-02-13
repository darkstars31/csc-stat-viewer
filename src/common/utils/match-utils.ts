import { MatchStats } from "../../models/csc-player-match-history-types";
import { Team } from "../../models/franchise-types";
import { Match } from "../../models/matches-types";

export const getTeamRecord = (team?: Team, matches?: Match[]) =>
	matches?.reduce(
		(acc, match) => {
			if (match.stats.length > 0) {
				const isHomeTeam = match.home.name === team?.name;
				if (match.stats.length > 0) {
					const didCurrentTeamWin =
						(isHomeTeam && match.stats[0].homeScore > match.stats[0].awayScore) ||
						(!isHomeTeam && match.stats[0].homeScore < match.stats[0].awayScore);
					didCurrentTeamWin ? (acc.wins = acc.wins + 1) : (acc.losses = acc.losses + 1);
				}
			}
			return acc;
		},
		{ wins: 0, losses: 0 },
	);

const initialMapBans = {
	de_inferno: 0,
	de_train: 0,
	de_nuke: 0,
	de_mirage: 0,
	de_ancient: 0,
	de_anubis: 0,
	de_dust2: 0,
};

export const calculateMapBans = (team?: Team, matches?: Match[]) => {
	const numberOfRegularSeasonBanRounds = 3;

	const mapBans = matches
		?.filter(match => match.stats.length === 1)
		?.flatMap(match => match.lobby.mapBans)
		?.filter(match => match.team.name === team?.name);

	const totalMapBans = mapBans?.reduce((acc, mapBan, index) => {
		const roundNumber = (index % numberOfRegularSeasonBanRounds) + 1;
		const roundKey = `Round ${roundNumber}`;
		if (mapBan.team.name === team?.name) {
			if (!acc[roundKey]) {
				acc[roundKey] = { ...initialMapBans };
			}
			acc[roundKey][mapBan.map] += 1;
		}

		return acc;
	}, {} as any);

	return totalMapBans;
};

export const calculateMapBanFloat = (team?: Team, matches?: Match[]) => {
	const regularSeasonMatches = matches?.filter(match => match.stats.length === 1);

	const mapFloats = regularSeasonMatches?.reduce(
		(acc, match) => {
			if (match.lobby.mapBans.length === 0) return acc;

			const isAwayTeam = match.lobby.mapBans[0].team.name === team?.name;
			const mapBan = match.lobby.mapBans;
			const selectedMap = match.stats[0].mapName;
			const mapFloat = mapBan[mapBan.length - 1].map;

			if (isAwayTeam) {
				acc["float"][mapFloat as keyof typeof initialMapBans] += 1;
				acc["float"][selectedMap as keyof typeof initialMapBans] += 1;
			} else {
				acc["picks"][selectedMap as keyof typeof initialMapBans] += 1;
			}

			return acc;
		},
		{ picks: { ...initialMapBans }, float: { ...initialMapBans } },
	);

	return mapFloats;
};

export const calculateTeamRecord = (team?: Team, matches?: Match[], conferncesTeams?: string[]) =>
	matches?.reduce((acc, match) => {
		if (match.stats.length > 0) {
			const isPlayoffMatch = match.stats.length > 1;
			for (const matchStat of match.stats) {
				if (matchStat.awayScore + matchStat.homeScore === 0) continue;
				const isHomeTeam = match.home.name === team?.name;
				const map = matchStat.mapName;
				const isSameConference =
					conferncesTeams?.includes(match.home.name) && conferncesTeams?.includes(match.away.name);

				if (!acc.record) {
					acc.record = {
						wins: 0,
						losses: 0,
						conferenceWins: 0,
						conferenceLosses: 0,
						roundsWon: 0,
						roundsLost: 0,
						teamsDefeated: [],
						playoffs: { wins: 0, losses: 0 },
					};
					acc.maps = [];
				}

				if (!acc.maps[map]) {
					acc.maps[map] = {
						name: map,
						wins: 0,
						loss: 0,
						roundsWon: 0,
						roundsLost: 0,
					};
				}

				const didCurrentTeamWin =
					(isHomeTeam && matchStat.homeScore > matchStat.awayScore) ||
					(!isHomeTeam && matchStat.homeScore < matchStat.awayScore);

				if (!isPlayoffMatch) {
					if (didCurrentTeamWin) {
						acc.record.teamsDefeated.push(isHomeTeam ? match.away.name : match.home.name);
						acc.record.wins += 1;
						acc.maps[map]["wins"] += 1;
						if (isSameConference) {
							acc.record.conferenceWins += 1;
						}
					} else {
						acc.record.losses += 1;
						acc.maps[map]["loss"] += +1;
						if (isSameConference) {
							acc.record.conferenceLosses += 1;
						}
					}

					if (isHomeTeam) {
						acc.record.roundsWon += matchStat.homeScore;
						acc.record.roundsLost += matchStat.awayScore;
						acc.maps[map]["roundsWon"] += matchStat.homeScore;
						acc.maps[map]["roundsLost"] += matchStat.awayScore;
					} else {
						acc.record.roundsWon += matchStat.awayScore;
						acc.record.roundsLost += matchStat.homeScore;
						acc.maps[map]["roundsWon"] += matchStat.awayScore;
						acc.maps[map]["roundsLost"] += matchStat.homeScore;
					}
				} else {
					if (didCurrentTeamWin) {
						acc.record.playoffs.wins += 1;
					} else {
						acc.record.playoffs.losses += 1;
					}
				}
			}
		}
		return acc;
	}, {} as any);

export const calculateClutchPoints = (matchStats: MatchStats) =>
	matchStats.cl_1 + matchStats.cl_2 * 2 + matchStats.cl_3 * 3 + matchStats.cl_4 * 5 + matchStats.cl_5 * 8;
