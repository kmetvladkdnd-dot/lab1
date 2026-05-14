import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/user.routes";
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details }
    });
  }
  console.error(err);
  return res.status(500).json({
    error: { code: "SERVER_ERROR", message: "Internal server error", details: null }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API started on http://localhost:${PORT}`));