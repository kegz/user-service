import { RoleModel } from "../models/role.model.js";
import { UserModel } from "../models/user.model.js";

export const ensureRoleNameUnique = async (name: string) => {
    const existing = await RoleModel.findOne({ name });
    if (existing) throw new Error("Role name must be unique");
};

export const ensureRoleDeletable = async (roleId: string) => {
    const count = await UserModel.countDocuments({ role: roleId });
    if (count > 0) throw new Error("Cannot delete role in use by users");
};
