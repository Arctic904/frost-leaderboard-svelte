import { z } from 'zod';

export const RoundSchema = z.object({
	roundNumber: z.number(),
	startTime: z.string()
});
export type Round = z.infer<typeof RoundSchema>;

export const ScheduleSchemaBracket = z.object({
	rounds: z.array(RoundSchema),
	allowRescheduling: z.boolean()
});
export type ScheduleBracket = z.infer<typeof ScheduleSchemaBracket>;

export const SeriesSchema = z.object({
	round: z.number(),
	roundType: z.string(),
	numGames: z.number()
});
export type Series = z.infer<typeof SeriesSchema>;

export const BracketClassSchema = z.object({
	type: z.string(),
	seriesStyle: z.string(),
	series: z.array(SeriesSchema),
	style: z.string(),
	teamsCount: z.number(),
	hasThirdPlaceMatch: z.boolean(),
	roundsCount: z.number()
});
export type BracketClass = z.infer<typeof BracketClassSchema>;

export const BracketSchema = z.object({
	_id: z.string(),
	name: z.string(),
	startTime: z.coerce.date(),
	hasMatchCheckin: z.boolean(),
	hasCheckinTimer: z.boolean(),
	hasConfirmScore: z.boolean(),
	bracket: BracketClassSchema,
	matchCheckinDuration: z.number(),
	schedule: ScheduleSchemaBracket,
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	hasStarted: z.boolean(),
	teamIDs: z.array(z.string()),
	groupIDs: z.array(z.any()),
	matchIDs: z.array(z.any()),
	pickBan: z.array(z.any()),
	startedAt: z.coerce.date()
});
export type Bracket = z.infer<typeof BracketSchema>;
