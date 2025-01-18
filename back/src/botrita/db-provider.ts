import { PostgreSQLAdapter } from '@builderbot/database-postgres';

export type IDatabase = typeof PostgreSQLAdapter;

export const adapterDB = new PostgreSQLAdapter({
  host: 'localhost',
  user: 'postgres',
  database: 'bot-rita',
  password: 'japanese',
  port: 5432,
});
