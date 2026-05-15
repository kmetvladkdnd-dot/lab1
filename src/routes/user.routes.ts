import { Router } from "express";
import * as userRepo from "../repositories/user.repository";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const users = await userRepo.getAllUsers();
        res.json({ data: users });
    } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) return res.status(400).json({ error: "Missing fields" });
        const newUser = await userRepo.createUser(email, name);
        res.status(201).json({ data: newUser }); 
    } catch (err) { next(err); }
});

export default router;