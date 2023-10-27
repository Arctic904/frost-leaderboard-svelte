import * as z from 'zod';

export const BottomEnumSchema = z.enum(['Blue', 'Red']);
export type BottomEnum = z.infer<typeof BottomEnumSchema>;

export const ValorantTeamIDsByPositionSchema = z.object({
	top: BottomEnumSchema,
	bottom: BottomEnumSchema
});
export type ValorantTeamIDsByPosition = z.infer<typeof ValorantTeamIDsByPositionSchema>;

export const SPerSiteSchema = z.object({
	B: z.union([z.number(), z.null()]).optional(),
	A: z.union([z.number(), z.null()]).optional()
});
export type SPerSite = z.infer<typeof SPerSiteSchema>;

export const PlayerSchema = z.object({
	characterId: z.string(),
	character: z.string(),
	puuid: z.string(),
	kills: z.number(),
	deaths: z.number(),
	assists: z.number(),
	rounds: z.number(),
	kda: z.number(),
	bombPlantsPerSite: SPerSiteSchema,
	bombDefusesPerSite: SPerSiteSchema,
	totalDamage: z.number(),
	teamId: BottomEnumSchema,
	headshots: z.number(),
	bodyshots: z.number(),
	legshots: z.number(),
	totalHits: z.number(),
	headshotPercent: z.number(),
	inGameName: z.string()
});
export type Player = z.infer<typeof PlayerSchema>;

export const TeamSchema = z.object({
	isWinner: z.boolean(),
	teamId: BottomEnumSchema,
	battlefyTeamID: z.string(),
	name: z.string(),
	players: z.array(PlayerSchema),
	teamPostPlantWinsPerSite: SPerSiteSchema,
	teamBombPlantsPerSite: SPerSiteSchema,
	teamBombDefusesPerSite: SPerSiteSchema,
	teamKills: z.number(),
	teamAssists: z.number(),
	teamDeaths: z.number(),
	teamDamage: z.number(),
	teamKda: z.number()
});
export type Team = z.infer<typeof TeamSchema>;

export const StatsBottomSchema = z.object({
	score: z.number(),
	winner: z.boolean()
});
export type StatsBottom = z.infer<typeof StatsBottomSchema>;

export const StatsSchema = z.object({
	isComplete: z.boolean(),
	top: StatsBottomSchema,
	bottom: StatsBottomSchema,
	valorantTeamIDsByPosition: ValorantTeamIDsByPositionSchema,
	valorantMatchID: z.string(),
	teams: z.array(TeamSchema),
	gameStartMillis: z.number(),
	gameLengthMillis: z.number(),
	gameId: z.string(),
	mapName: z.string(),
	mapSlug: z.string(),
	totalBombPlantsPerSite: SPerSiteSchema,
	totalBombDefusesPerSite: SPerSiteSchema
});
export type Stats = z.infer<typeof StatsSchema>;

export const StatSchema = z.object({
	matchID: z.string(),
	gameID: z.string(),
	tournamentID: z.string(),
	stageID: z.string(),
	gameNumber: z.number(),
	stats: StatsSchema,
	createdAt: z.coerce.date(),
	_id: z.string()
});
export type Stat = z.infer<typeof StatSchema>;

export const ScheduleSchema = z.object({
	startTime: z.string(),
	reschedulingRequested: z.boolean()
});
export type Schedule = z.infer<typeof ScheduleSchema>;

export const WinnerSchema = z.object({
	position: z.string(),
	matchID: z.string()
});
export type Winner = z.infer<typeof WinnerSchema>;

export const NextSchema = z.object({
	winner: WinnerSchema
});
export type Next = z.infer<typeof NextSchema>;

export const MatchBottomSchema = z.object({
	winner: z.boolean(),
	disqualified: z.boolean(),
	seedNumber: z.number(),
	readyAt: z.coerce.date(),
	score: z.number(),
	teamID: z.string()
});
export type MatchBottom = z.infer<typeof MatchBottomSchema>;

export const MatchSchema = z.object({
	_id: z.string(),
	top: MatchBottomSchema,
	bottom: MatchBottomSchema,
	matchType: z.string(),
	matchNumber: z.number(),
	roundNumber: z.number(),
	isBye: z.boolean(),
	next: NextSchema,
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	doubleLoss: z.boolean(),
	stageID: z.string(),
	schedule: ScheduleSchema,
	stats: z.array(StatSchema),
	isComplete: z.boolean(),
	completedAt: z.coerce.date(),
	inConsolationBracket: z.boolean()
});
export type Match = z.infer<typeof MatchSchema>;
