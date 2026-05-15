import { db } from "./db";

// Функція для отримання списку (SELECT) [cite: 78-83]
export const all = <T>(sql: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, (err: Error | null, rows: any[]) => (err ? reject(err) : resolve(rows as T[])));
    });
};

// Функція для отримання одного рядка [cite: 84-89]
export const get = <T>(sql: string): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(sql, (err: Error | null, row: any) => (err ? reject(err) : resolve(row as T)));
    });
};

// Функція для INSERT/UPDATE/DELETE [cite: 90-97]
export const run = (sql: string): Promise<{ lastID: number; changes: number }> => {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err: Error | null) {
            if (err) return reject(err);
            // Використовуємо (this as any), щоб TS бачив lastID та changes [cite: 94]
            resolve({ 
                lastID: (this as any).lastID, 
                changes: (this as any).changes 
            });
        });
    });
};