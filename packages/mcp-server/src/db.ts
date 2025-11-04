import { Pool } from 'pg';

export const pool = new Pool({
  user: 'demo',
  host: 'localhost',
  database: 'demo',
  password: 'demo',
  port: 5435,
});
