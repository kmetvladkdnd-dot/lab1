import { Router, Request, Response, NextFunction } from "express";
import * as postRepo from "../repositories/postRepo";
import { demoAuth } from "../utils/demoAuth";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.q) {
            res.json({ data: await postRepo.searchPosts(String(req.query.q)) });
            return;
        }
        res.json({ data: await postRepo.getPosts() });
    } catch (e) { next(e); }
});

router.get("/with-authors", async (req: Request, res: Response, next: NextFunction) => {
    try { res.json({ data: await postRepo.getPostsWithAuthors() }); } catch (e) { next(e); }
});

router.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
    try { res.json({ data: await postRepo.getPostStats() }); } catch (e) { next(e); }
});

router.get("/top3", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = req.query.status as string;
        const validStatuses = ["New", "In Progress", "Closed"];
        
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ error: "Невірний статус. Дозволені: New, In Progress, Closed" });
            return;
        }
        
        res.json({ data: await postRepo.getTop3ByStatus(status) });
    } catch (e) { next(e); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await postRepo.getPostById(Number(req.params.id));
        if (!post) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json({ data: post });
    } catch (e) { next(e); }
});

router.post("/", demoAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, body } = req.body;
        const userId = (req as any).user.id;
        
        if (!title || !body) {
            res.status(400).json({ error: "Missing fields" });
            return;
        }
        
        const created = await postRepo.createPost(Number(userId), String(title), String(body));
        res.status(201).json({ data: created });
    } catch (e) { next(e); }
});

router.delete("/:id", demoAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const ok = await postRepo.deletePost(Number(req.params.id), Number(userId));
        
        if (!ok) {
            res.status(404).json({ error: "Not found or forbidden" });
            return;
        }
        res.status(204).send();
    } catch (e) { next(e); }
});

export default router;