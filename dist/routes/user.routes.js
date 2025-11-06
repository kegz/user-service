import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { authenticate } from "prime-qa-commons";
const router = Router();
router.get("/", authenticate, async (req, res) => {
    const service = await import("../services/user.service.js");
    const users = await service.listUsers();
    res.json(users);
});
router.get("/:id", authenticate, async (req, res) => {
    const service = await import("../services/user.service.js");
    const recordId = req.params.id;
    if (!recordId) {
        return res.status(400).json({ message: "Missing user ID in request params" });
    }
    const user = await service.getUser(recordId);
    if (!user)
        return res.status(404).json({ message: "Not found" });
    res.json(user);
});
router.post("/", authenticate, UserController.createUser);
router.put("/:id", authenticate, UserController.updateUser);
router.delete("/:id", authenticate, async (req, res) => {
    const service = await import("../services/user.service.js");
    const recordId = req.params.id;
    if (!recordId) {
        return res.status(400).json({ message: "Missing user ID in request params" });
    }
    const u = await service.deactivateUser(recordId);
    res.json(u);
});
export default router;
