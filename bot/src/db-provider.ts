import dotenv from "dotenv";
import { PostgreSQLAdapter } from "@builderbot/database-postgres";

dotenv.config();

export const adapterDB = new PostgreSQLAdapter({
  host: process.env.POSTGRES_DB_HOST,
  user: process.env.POSTGRES_DB_USER,
  database: process.env.POSTGRES_DB_NAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  port: +process.env.POSTGRES_DB_PORT,
});
