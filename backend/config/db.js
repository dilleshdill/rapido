import Pool from "pg-pool";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_ta6nHSZOPEl0@ep-curly-frost-a131cvr6-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false },
});

export default pool;
