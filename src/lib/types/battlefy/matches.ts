import { z } from 'zod';

export const TeamEnumSchema = z.enum(['Blue', 'Red']);
export type TeamEnum = z.infer<typeof TeamEnumSchema>;

export const ValorantTeamIDsByPositionSchema = z.object({
	top: TeamEnumSchema,
	bottom: TeamEnumSchema
});
export type ValorantTeamIDsByPosition = z.infer<typeof ValorantTeamIDsByPositionSchema>;

export const SPerSiteSchema = z.object({
	B: z.union([z.number(), z.null()]).optional(),
	A: z.union([z.number(), z.null()]).optional(),
	C: z.union([z.number(), z.null()]).optional()
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
	teamId: TeamEnumSchema,
	headshots: z.number(),
	bodyshots: z.number(),
	legshots: z.number(),
	totalHits: z.number(),
	headshotPercent: z.number(),
	inGameName: z.string()
});
export type Player = z.infer<typeof PlayerSchema>;

export const TeamElementSchema = z.object({
	isWinner: z.boolean(),
	teamId: TeamEnumSchema,
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
export type TeamElement = z.infer<typeof TeamElementSchema>;

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
	teams: z.array(TeamElementSchema),
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

export const BottomTeamSchema = z.object({
	_id: z.string(),
	name: z.string(),
	pendingTeamID: z.string(),
	persistentTeamID: z.string(),
	tournamentID: z.string(),
	userID: z.string(),
	customFields: z.array(z.any()),
	ownerID: z.string(),
	createdAt: z.coerce.date(),
	playerIDs: z.array(z.string()),
	captainID: z.string()
});
export type BottomTeam = z.infer<typeof BottomTeamSchema>;

export const BattlefyBottomSchema = z.object({
	winner: z.boolean(),
	disqualified: z.boolean(),
	seedNumber: z.union([z.number(), z.null()]).optional(),
	teamID: z.union([z.null(), z.string()]).optional(),
	readyAt: z.union([z.coerce.date(), z.null()]).optional(),
	score: z.union([z.number(), z.null()]).optional(),
	team: z.union([BottomTeamSchema, z.null()]).optional()
});
export type BattlefyBottom = z.infer<typeof BattlefyBottomSchema>;

export const BattlefyMatchList = z.array(
	z.object({
		_id: z.string(),
		top: BattlefyBottomSchema,
		bottom: BattlefyBottomSchema,
		matchType: z.string(),
		matchNumber: z.number(),
		roundNumber: z.number(),
		isBye: z.boolean(),
		next: z.union([NextSchema, z.null()]).optional(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		doubleLoss: z.boolean(),
		stageID: z.string(),
		isComplete: z.boolean(),
		schedule: ScheduleSchema,
		stats: z.union([z.array(StatSchema), z.null()]).optional(),
		completedAt: z.union([z.coerce.date(), z.null()]).optional(),
		isMarkedLive: z.union([z.boolean(), z.null()]).optional()
	})
);
export type BattlefyElement = z.infer<typeof BattlefyMatchList>;
