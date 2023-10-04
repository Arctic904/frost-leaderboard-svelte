import { relations, sql } from 'drizzle-orm';
import {
	tinyint,
	datetime,
	index,
	int,
	mysqlTableCreator,
	primaryKey,
	text,
	timestamp,
	varchar,
	double
} from 'drizzle-orm/mysql-core';
import type { AdapterAccount } from '@auth/core/adapters';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `frost-leaderboard_${name}`);

export const users = mysqlTable('user', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	name: varchar('name', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull(),
	emailVerified: timestamp('emailVerified', {
		mode: 'date',
		fsp: 3
	}).default(sql`CURRENT_TIMESTAMP(3)`),
	image: varchar('image', { length: 255 })
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts)
}));

export const accounts = mysqlTable(
	'account',
	{
		userId: varchar('userId', { length: 255 }).notNull(),
		type: varchar('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
		provider: varchar('provider', { length: 255 }).notNull(),
		providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: int('expires_at'),
		token_type: varchar('token_type', { length: 255 }),
		scope: varchar('scope', { length: 255 }),
		id_token: text('id_token'),
		session_state: varchar('session_state', { length: 255 })
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId),
		userIdIdx: index('userId_idx').on(account.userId)
	})
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] })
}));

export const sessions = mysqlTable(
	'session',
	{
		sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
		userId: varchar('userId', { length: 255 }).notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(session) => ({
		userIdIdx: index('userId_idx').on(session.userId)
	})
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export const verificationTokens = mysqlTable(
	'verificationToken',
	{
		identifier: varchar('identifier', { length: 255 }).notNull(),
		token: varchar('token', { length: 255 }).notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
);

export const player = mysqlTable(
	'player',
	{
		id: int('id').notNull().primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		linked_user_id: int('linked_user_id').notNull(),
		battlefy_id: varchar('battlefy_id', { length: 32 }).notNull(),
		created_at: datetime('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updated_at: datetime('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(player) => ({
		nameIdx: index('name_idx').on(player.name)
	})
);

export const playerRelations = relations(player, ({ one }) => ({
	user: one(users, { fields: [player.linked_user_id], references: [users.id] })
}));

export const team = mysqlTable(
	'team',
	{
		id: int('id').notNull().primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		battlefy_id: varchar('battlefy_id', { length: 32 }).notNull(),
		created_at: datetime('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updated_at: datetime('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(team) => ({
		nameIdx: index('name_idx').on(team.name)
	})
);

export const tournament = mysqlTable(
	'tournament',
	{
		id: int('id').notNull().primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		battlefy_id: varchar('battlefy_id', { length: 32 }).notNull(),
		created_at: datetime('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		teams: int('teams').notNull(),
		players: int('players').notNull()
	},
	(tournament) => ({
		nameIdx: index('name_idx').on(tournament.name)
	})
);

export const match = mysqlTable(
	'match',
	{
		id: int('id').notNull().primaryKey(),
		created_at: datetime('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updated_at: datetime('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		team1: int('team1').notNull(),
		team2: int('team2').notNull(),
		team1_score: tinyint('team1_score').notNull(),
		team2_score: tinyint('team2_score').notNull(),
		winner: int('winner').notNull(),
		tournament_id: int('tournament_id').notNull()
	},
	(match) => ({
		team1Idx: index('team1_idx').on(match.team1),
		team2Idx: index('team2_idx').on(match.team2),
		tournamentIdx: index('tournament_idx').on(match.tournament_id)
	})
);

export const matchRelations = relations(match, ({ one }) => ({
	tournament: one(tournament, { fields: [match.tournament_id], references: [tournament.id] })
}));

export const game = mysqlTable(
	'game',
	{
		id: int('id').notNull().primaryKey(),
		created_at: datetime('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updated_at: datetime('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		match_id: int('match_id').notNull(),
		team1: int('team1').notNull(),
		team2: int('team2').notNull(),
		team1_score: tinyint('team1_score').notNull(),
		team2_score: tinyint('team2_score').notNull(),
		winner: int('winner').notNull()
	},
	(game) => ({
		matchIdx: index('match_idx').on(game.match_id),
		team1Idx: index('team1_idx').on(game.team1),
		team2Idx: index('team2_idx').on(game.team2)
	})
);

export const gameRelations = relations(game, ({ one }) => ({
	match: one(match, { fields: [game.match_id], references: [match.id] })
}));

export const statline = mysqlTable(
	'statline',
	{
		game_id: int('game_id').notNull(),
		player_id: int('player_id').notNull(),
		team_id: int('team_id').notNull(),
		kills: tinyint('kills').notNull(),
		deaths: tinyint('deaths').notNull(),
		assists: tinyint('assists').notNull(),
		kda: double('kda').notNull(),
		headshot_percentage: double('headshot_percentage').notNull(),
		created_at: datetime('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updated_at: datetime('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	},
	(statline) => ({
		compoundKey: primaryKey(statline.game_id, statline.player_id),
		gameIdx: index('game_idx').on(statline.game_id),
		playerIdx: index('player_idx').on(statline.player_id),
		teamIdx: index('team_idx').on(statline.team_id)
	})
);

export const statlineRelations = relations(statline, ({ one }) => ({
	game: one(game, { fields: [statline.game_id], references: [game.id] }),
	player: one(player, { fields: [statline.player_id], references: [player.id] }),
	team: one(team, { fields: [statline.team_id], references: [team.id] })
}));
