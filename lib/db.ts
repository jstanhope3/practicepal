import Database from "better-sqlite3";
import path from "path";
const dbPath = process.env.DB_PATH || "practice.db";

const db = new Database(dbPath);

export default db;
