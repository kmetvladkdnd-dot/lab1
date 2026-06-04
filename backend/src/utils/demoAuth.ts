import { Request, Response, NextFunction } from "express";

export function demoAuth(req: Request, res: Response, next: NextFunction) {
    const userId = req.header("X-Demo-UserId");
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    (req as any).user = { id: Number(userId) };
    next();
}