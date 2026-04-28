import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

pool.connect((err) => {
  if (err) {
    console.error("DB Connection Error: ", err);
  } else {
    console.log("DB Connected to NavSumaro!");
  }
});

export const query = (text: string, params: unknown[] = []) => {
  return pool.query(text, params);
};

export default pool;
