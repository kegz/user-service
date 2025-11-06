import * as RoleService from "../services/role.service.js";
export const list = async (_req, res) => {
    const roles = await RoleService.listRoles();
    res.json(roles);
};
export const create = async (req, res) => {
    try {
        const { name, description, permissions = [] } = req.body;
        const role = await RoleService.createRole(name, description, permissions);
        res.status(201).json(role);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const update = async (req, res) => {
    try {
        const recordId = req.params.id;
        if (!recordId) {
            return res.status(400).json({ message: "Missing user ID in request params" });
        }
        const role = await RoleService.updateRole(recordId, req.body);
        res.json(role);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const remove = async (req, res) => {
    try {
        const recordId = req.params.id;
        if (!recordId) {
            return res.status(400).json({ message: "Missing user ID in request params" });
        }
        await RoleService.deleteRole(recordId);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
