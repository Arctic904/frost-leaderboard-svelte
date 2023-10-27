import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { DATABASE_URL } from '$env/static/private';
import * as schema from '$lib/server/schema';

// create the connection
const connection = connect({
	url: DATABASE_URL
});

export const db = drizzle(connection, { schema });
