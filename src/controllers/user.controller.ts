import type { Request, Response } from "express";
import * as UserService from "../services/user.service.js";
import { UserModel } from "../models/user.model.js";


export const getById = async (req: Request, res: Response) => {
  try {
    const record = await UserModel.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Record", error });
  }
};

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

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || "";

    if (!query.trim()) {
      return res.status(400).json({ message: "Search query is required (q)" });
    }

    // delegate actual DB logic to the service layer
    const results = await UserService.searchUsers(query);
    res.status(200).json(results);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};