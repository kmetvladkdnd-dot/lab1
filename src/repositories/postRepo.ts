import { all, get, run } from "../db/dbClient";

export async function getPosts(limit = 10) {
    return await all(`SELECT * FROM Posts WHERE id > 0 ORDER BY id DESC LIMIT ${limit};`);
}

export async function getPostById(id: number) {
    return await get(`SELECT * FROM Posts WHERE id = ${id};`);
}

export async function createPost(userId: number, title: string, body: string) {
    const now = new Date().toISOString();
    const result = await run(`
        INSERT INTO Posts (userId, title, body, createdAt)
        VALUES (${userId}, '${title}', '${body}', '${now}');
    `);
    return await getPostById(result.lastID);
}

export async function deletePost(id: number) {
    const result = await run(`DELETE FROM Posts WHERE id = ${id};`);
    return result.changes > 0;
}

export async function getPostsWithAuthors() {
    return await all(`
        SELECT p.id, p.title, p.body, u.name as authorName 
        FROM Posts p 
        JOIN Users u ON u.id = p.userId 
        ORDER BY p.id DESC;
    `);
}

export async function getPostStats() {
    return await all(`SELECT userId, COUNT(*) as postCount FROM Posts GROUP BY userId;`);
}

export async function searchPosts(q: string) {
    return await all(`SELECT * FROM Posts WHERE title LIKE '%${q}%' ORDER BY id DESC;`);
}