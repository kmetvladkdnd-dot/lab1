import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import { ApiError } from "./utils/ApiError";

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Централізований обробник помилок [cite: 870-887]
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }
    
    const msg = String(err && err.message ? err.message : err);
    
    if (msg.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Unique constraint violation" });
    }
    if (msg.includes("NOT NULL constraint failed") || msg.includes("CHECK constraint failed")) {
        return res.status(400).json({ error: "Invalid data" });
    }

    console.error(err);
    return res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Internal server error" }
    });
});

export { app };