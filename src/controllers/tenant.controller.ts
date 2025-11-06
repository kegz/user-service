import type { Request, Response } from "express";
import * as TenantService from "../services/tenant.service.js";

export const list = async (_req: Request, res: Response) => {
  const items = await TenantService.listTenants();
  res.json(items);
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, domain } = req.body;
    const t = await TenantService.createTenant(name, domain);
    res.status(201).json(t);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    if (!recordId) {
      return res.status(400).json({ message: "Missing user ID in request params" });
    }

    const t = await TenantService.updateTenant(recordId, req.body);
    res.json(t);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    if (!recordId) {
      return res.status(400).json({ message: "Missing user ID in request params" });
    }

    await TenantService.deleteTenant(recordId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
