import { Router } from "express";
import * as TenantController from "../controllers/tenant.controller.js";
import { authenticate } from "prime-qa-commons";
const router = Router();
router.get("/", authenticate, TenantController.list);
router.post("/", authenticate, TenantController.create);
router.put("/:id", authenticate, TenantController.update);
router.delete("/:id", authenticate, TenantController.remove);
export default router;
