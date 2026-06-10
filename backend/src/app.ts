import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import { ApiError } from "./utils/ApiError";

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});

const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    "http://localhost:5174" 
];

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS: origin is not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"] 
}));

app.options("*", cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

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
    const isDev = process.env.NODE_ENV !== "production"; 
    
    return res.status(500).json({
        error: { 
            code: "SERVER_ERROR", 
            message: "Internal server error",
            details: isDev ? String(err.message ?? err) : undefined 
        }
    });
});

export { app };