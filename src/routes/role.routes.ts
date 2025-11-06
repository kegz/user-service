import { Router } from "express";
import * as RoleController from "../controllers/role.controller.js";
import { authenticate } from "prime-qa-commons";

const router = Router();

router.get("/", authenticate, RoleController.list);
router.post("/", authenticate, RoleController.create);
router.put("/:id", authenticate, RoleController.update);
router.delete("/:id", authenticate, RoleController.remove);

export default router;
