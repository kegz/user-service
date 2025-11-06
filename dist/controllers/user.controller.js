import * as UserService from "../services/user.service.js";
export const createUser = async (req, res) => {
    try {
        const actorRole = req.user?.role || "viewer";
        const user = await UserService.createUser({ ...req.body, actorRole });
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "Missing user ID in request params" });
        }
        const updated = await UserService.updateUser(userId, req.body);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
