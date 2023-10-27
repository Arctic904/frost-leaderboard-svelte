import * as z from 'zod';

export const GameIdSchema = z.string();
export type GameId = z.infer<typeof GameIdSchema>;

export const OrganizationIdSchema = z.string();
export type OrganizationId = z.infer<typeof OrganizationIdSchema>;

export const TournamentIdSchema = z.string();
export type TournamentId = z.infer<typeof TournamentIdSchema>;

export const HeaderSchema = z.object({
	url: z.string()
});
export type Header = z.infer<typeof HeaderSchema>;

export const PersistentTeamSchema = z.object({
	_id: z.string(),
	name: z.string(),
	logo: HeaderSchema,
	header: HeaderSchema,
	sponsor: HeaderSchema,
	logoUrl: z.string(),
	shortDescription: z.string(),
	bannerUrl: z.string(),
	sponsorBannerUrl: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	teamIDs: z.array(z.any()),
	gameID: GameIdSchema,
	persistentPlayerIDs: z.array(z.string()),
	persistentCaptainID: z.string(),
	pendingPlayerIDs: z.array(z.any()),
	ownerID: z.string()
});
export type PersistentTeam = z.infer<typeof PersistentTeamSchema>;

export const EquipmentSchema = z.object({
	face: z.string(),
	head: z.union([z.null(), z.string()]).optional(),
	body: z.union([z.null(), z.string()]).optional()
});
export type Equipment = z.infer<typeof EquipmentSchema>;

export const CaptainSchema = z.object({
	_id: z.string(),
	onTeam: z.boolean(),
	isFreeAgent: z.boolean(),
	beCaptain: z.boolean(),
	inGameName: z.string(),
	gameID: GameIdSchema,
	persistentPlayerID: z.union([z.null(), z.string()]).optional(),
	userID: z.union([z.null(), z.string()]).optional(),
	ownerID: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	organizationID: OrganizationIdSchema,
	tournamentID: TournamentIdSchema,
	userSlug: z.union([z.null(), z.string()]).optional(),
	equipment: z.union([EquipmentSchema, z.null()]).optional(),
	username: z.union([z.null(), z.string()]).optional(),
	avatarUrl: z.union([z.null(), z.string()]).optional()
});
export type Captain = z.infer<typeof CaptainSchema>;

export const TeamElementSchema = z.object({
	_id: z.string(),
	name: z.string(),
	pendingTeamID: z.string(),
	persistentTeamID: z.string(),
	tournamentID: TournamentIdSchema,
	userID: z.string(),
	customFields: z.array(z.any()),
	ownerID: z.string(),
	createdAt: z.coerce.date(),
	playerIDs: z.array(z.string()),
	captainID: z.string(),
	captain: CaptainSchema,
	players: z.array(CaptainSchema),
	persistentTeam: PersistentTeamSchema,
	checkedInAt: z.union([z.coerce.date(), z.null()]).optional()
});
export type TeamElement = z.infer<typeof TeamElementSchema>;
