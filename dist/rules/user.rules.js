import { RoleModel } from "../models/role.model.js";
export const ensureUniqueEmail = async (email) => {
    const existing = await import("../models/user.model.js").then(m => m.UserModel.findOne({ email }));
    if (existing)
        throw new Error("Email already in use");
};
export const validateRoleAssignment = async (roleId, actorRole) => {
    const role = await RoleModel.findById(roleId);
    if (!role)
        throw new Error("Invalid role selected");
    // Example: only admins can assign non-viewer roles
    if (actorRole !== "admin" && role.name !== "viewer")
        throw new Error("Insufficient permissions to assign that role");
};
export const canModifyUser = (actor, target) => {
    if (actor.role.toString() !== "admin" && actor.id !== target.id) {
        throw new Error("You can only edit your own profile");
    }
};
