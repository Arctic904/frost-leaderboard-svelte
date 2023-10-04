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
	smallint,
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

export const games = mysqlTable(
	'games',
	{
		playerId: varchar('playerId', { length: 255 }).notNull(),
		matchId: varchar('matchId', { length: 255 }).notNull(),
		teamId: varchar('teamId', { length: 255 }).notNull(),
		tournamentId: varchar('tournamentId', { length: 255 }).notNull(),
		kills: tinyint('kills').notNull(),
		assists: tinyint('assists').notNull(),
		deaths: tinyint('deaths').notNull(),
		damage: smallint('damage').notNull(),
		headshots: double('headshots', { precision: 2 }).notNull(),
		matchTime: datetime('matchTime').notNull()
	},
	(games) => ({
		compoundKey: primaryKey(games.playerId, games.matchId)
	})
);

export const matches = mysqlTable(
	'matches',
	{
		matchId: varchar('matchId', { length: 255 }).notNull(),
		topTeamId: varchar('teamId', { length: 255 }).notNull(),
		bottomTeamId: varchar('teamId', { length: 255 }).notNull(),
		tournamentId: varchar('tournamentId', { length: 255 }).notNull(),
		matchTime: datetime('matchTime').notNull()
	},
	(matches) => ({
		compoundKey: primaryKey(matches.matchId, matches.tournamentId)
	})
);
