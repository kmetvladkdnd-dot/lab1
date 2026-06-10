import path from "path";
import fs from "fs";
import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();
const dataDir = path.resolve("data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to open SQLite DB:", err.message);
        process.exit(1);
    }
    console.log("SQLite DB opened at:", dbPath);
});