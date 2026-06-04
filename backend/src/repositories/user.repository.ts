import { all, get, run } from "../db/dbClient";

export async function getAllUsers() {
    return await all("SELECT id, email, name, createdAt FROM Users ORDER BY id DESC;");
}

export async function getUserById(id: number) {
    return await get(`SELECT * FROM Users WHERE id = ?;`, [id]);
}

export async function createUser(email: string, name: string) {
    const now = new Date().toISOString();
    const result = await run(`
        INSERT INTO Users (email, name, createdAt) 
        VALUES (?, ?, ?);
    `, [email, name, now]);
    return await getUserById(result.lastID);
}