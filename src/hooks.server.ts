import { SvelteKitAuth } from '@auth/sveltekit';
import Discord from '@auth/core/providers/discord';
import { AUTH_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server';
import { mysqlTable } from '$lib/server/schema';

export const handle = SvelteKitAuth({
	adapter: DrizzleAdapter(db, mysqlTable),
	providers: [
		Discord({
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET,
			authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds'
		})
	],
	secret: AUTH_SECRET
});
