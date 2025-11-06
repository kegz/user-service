import type { Request, Response } from "express";
import * as UserService from "../services/user.service.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const actorRole = (req as any).user?.role || "viewer";
    const user = await UserService.createUser({ ...req.body, actorRole });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing user ID in request params" });
    }

    const updated = await UserService.updateUser(userId, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
