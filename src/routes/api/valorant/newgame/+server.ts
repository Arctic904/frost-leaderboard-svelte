import { db } from '$lib/server';
import { BattlefyMatchList } from '$lib/types/battlefy/matches';
import { BracketSchema } from '$lib/types/battlefy/bracket';
import type { RequestHandler } from '@sveltejs/kit';
import {
	game as gameDb,
	tournament,
	match as matchDb,
	player as playerDb,
	team as teamDb,
	statline,
	game
} from '$lib/server/schema';
import { MatchSchema } from '$lib/types/battlefy/match';
import { TeamElementSchema } from '$lib/types/battlefy/teams';

export const POST: RequestHandler = async ({ request }) => {
	const { bracket_id } = await request.json();

	const bracketData = await getBracket(bracket_id)
		.then((data) => {
			return data;
		})
		.catch((e) => {
			console.log(e);
			return null;
		});
	const gamedata = await getMatchList(bracket_id)
		.then((data) => {
			return data;
		})
		.catch((e) => {
			console.log(e);
			return null;
		});
	if (!bracketData) {
		return new Response(null, { status: 400 });
	}
	if (!gamedata) {
		return new Response(null, { status: 400 });
	}
	// console.log(gamedata);
	const players = new Map();
	const teams = new Map();
	try {
		for (const match of gamedata) {
			if (match.isBye) continue;
			const matchData = await getMatch(bracket_id, match._id).catch((e) => {
				console.log(e);
				return null;
			});
			if (!matchData) {
				continue;
			}
			matchData.stats.forEach((stat) => {
				stat.stats.teams.forEach((team) => {
					teams.set(team.battlefyTeamID, team);
					team.players.forEach((player) => {
						players.set(player.puuid, player);
					});
				});
			});
		}
	} catch (error) {
		console.log(error);
		return new Response(null, { status: 400 });
	}
	db.insert(tournament).values({
		id: bracketData._id,
		name: bracketData.name,
		teams: teams.size,
		players: players.size
	});
	try {
		gamedata.forEach(async (match) => {
			if (match.isBye) return;
			const matchData = await getMatch(bracket_id, match._id).catch((e) => {
				console.log(e);
				return null;
			});
			if (!matchData) {
				throw new Error('Invalid bracket');
			}
			db.insert(matchDb).values({
				id: matchData._id,
				tournament_id: bracketData._id,
				team1: matchData.top.teamID,
				team2: matchData.bottom.teamID,
				team1_score: matchData.top.score,
				team2_score: matchData.bottom.score,
				winner: matchData.top.winner ? matchData.top.teamID : matchData.bottom.teamID
			});
			try {
				matchData.stats.forEach((game) => {
					db.insert(gameDb).values({
						id: game.gameID,
						match_id: match._id,
						team1: matchData.top.teamID,
						team2: matchData.bottom.teamID,
						team1_score: game.stats.top.score,
						team2_score: game.stats.bottom.score,
						winner: game.stats.top.winner ? matchData.top.teamID : matchData.bottom.teamID
					});
					try {
						game.stats.teams.forEach((team) => {
							const teamCheck = db.query.team.findFirst({
								with: {
									battlefy_id: team.battlefyTeamID
								}
							});
							if (!teamCheck) {
								db.insert(teamDb).values({
									battlefy_id: team.battlefyTeamID,
									name: team.name
								});
							}
							try {
								team.players.forEach(async (player) => {
									const playerId = await getTeams(bracket_id)
										.then((data) => {
											const result = TeamElementSchema.safeParse(data);
											if (!result.success) {
												throw new Error('Invalid data');
											}
											return result.data;
										})
										.then((teams) => {
											return teams.players.find((p) => p.inGameName === player.inGameName);
										});
									if (!playerId?._id) return;
									if (!playerId?.username) return;
									const query = await db.query.player.findFirst({
										with: {
											id: playerId._id
										}
									});
									if (query) return;
									db.insert(playerDb).values({
										id: playerId._id,
										name: playerId.username,
										linked_user_id: player.puuid
									});
									db.insert(statline).values({
										game_id: game.gameID,
										player_id: playerId._id,
										team_id: team.battlefyTeamID,
										kills: player.kills,
										deaths: player.deaths,
										assists: player.assists,
										kda: player.kda,
										headshot_percentage: player.headshotPercent
									});
								});
							} catch (error) {
								console.log(error);
								throw new Error("Couldn't get players");
							}
						});
					} catch (error) {
						throw new Error("Couldn't get teams");
					}
				});
			} catch (error) {
				throw new Error("Couldn't get teams");
			}
		});
	} catch (error) {
		console.log(error);
		return new Response(null, { status: 400 });
	}
	return new Response('OK', { status: 200 });
};

async function getMatch(bracket_id: string, match_id: string) {
	const match = await fetch(
		`https://api.battlefy.com/stages/${bracket_id}/matches/${match_id}`
	).then((res) => res.json());
	const result = MatchSchema.safeParse(match);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
}

async function getMatchList(bracket_id: string) {
	const matchList = await fetch(`https://api.battlefy.com/stages/${bracket_id}/matches`).then(
		(res) => res.json()
	);
	const result = BattlefyMatchList.safeParse(matchList);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
}

async function getBracket(bracket_id: string) {
	const bracket = await fetch(`https://api.battlefy.com/stages/${bracket_id}`).then((res) =>
		res.json()
	);
	const result = BracketSchema.safeParse(bracket);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
}

async function getTeams(bracket_id: string) {
	const teams = await fetch(`https://api.battlefy.com/stages/${bracket_id}/teams`).then((res) =>
		res.json()
	);
	const result = TeamElementSchema.safeParse(teams);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
}
