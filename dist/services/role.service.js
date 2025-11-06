import { RoleModel } from "../models/role.model.js";
import { PermissionModel } from "../models/permission.model.js";
import { ensureRoleNameUnique, ensureRoleDeletable } from "../rules/role.rules.js";
export const listRoles = () => RoleModel.find().populate("permissions");
export const createRole = async (name, description, permissionCodes) => {
    await ensureRoleNameUnique(name);
    const perms = await PermissionModel.find({ code: { $in: permissionCodes } });
    const role = await RoleModel.create({ name, description, permissions: perms.map(p => p._id) });
    return role;
};
export const updateRole = async (id, payload) => {
    let update = { ...payload };
    if (payload.permissions) {
        const perms = await PermissionModel.find({ code: { $in: payload.permissions } });
        update.permissions = perms.map(p => p._id);
    }
    const role = await RoleModel.findByIdAndUpdate(id, update, { new: true });
    if (!role)
        throw new Error("Role not found");
    return role;
};
export const deleteRole = async (id) => {
    await ensureRoleDeletable(id);
    await RoleModel.findByIdAndDelete(id);
};
