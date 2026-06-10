import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const name = req.query.name as string | undefined;
      res.status(200).json(await userService.getAll(page, limit, name));
    } catch (e) { next(e); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.status(200).json(await userService.getById(req.params.id)); } catch (e) { next(e); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json(await userService.create(req.body)); } catch (e) { next(e); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try { res.status(200).json(await userService.update(req.params.id, req.body)); } catch (e) { next(e); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try { await userService.delete(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  }
}
export const userController = new UserController();