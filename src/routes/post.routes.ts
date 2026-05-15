import { Router } from "express";
import * as postRepo from "../repositories/postRepo";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        if (req.query.q) return res.json({ data: await postRepo.searchPosts(String(req.query.q)) });
        res.json({ data: await postRepo.getPosts() });
    } catch (e) { next(e); }
});

router.get("/with-authors", async (req, res, next) => {
    try { res.json({ data: await postRepo.getPostsWithAuthors() }); } catch (e) { next(e); }
});

router.get("/stats", async (req, res, next) => {
    try { res.json({ data: await postRepo.getPostStats() }); } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await postRepo.getPostById(Number(req.params.id));
        if (!post) return res.status(404).json({ error: "Not found" });
        res.json({ data: post });
    } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
    try {
        const { userId, title, body } = req.body;
        if (!userId || !title || !body) return res.status(400).json({ error: "Missing fields" });
        const created = await postRepo.createPost(Number(userId), title, body);
        res.status(201).json({ data: created });
    } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const ok = await postRepo.deletePost(Number(req.params.id));
        if (!ok) return res.status(404).json({ error: "Not found" });
        res.status(204).send();
    } catch (e) { next(e); }
});

export default router;