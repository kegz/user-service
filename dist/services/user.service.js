import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { ensureUniqueEmail, validateRoleAssignment } from "../rules/user.rules.js";
export const listUsers = () => UserModel.find().select("-passwordHash");
export const getUser = (id) => UserModel.findById(id).select("-passwordHash");
export const createUser = async (data) => {
    await ensureUniqueEmail(data.email);
    await validateRoleAssignment(data.roleId, data.actorRole);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await UserModel.create({
        email: data.email,
        passwordHash,
        role: data.roleId,
        tenant: data.tenantId
    });
    return user;
};
export const updateUser = async (userId, payload) => {
    if (payload.password) {
        payload.passwordHash = await bcrypt.hash(payload.password, 10);
        delete payload.password;
    }
    const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
    if (!user)
        throw new Error("User not found");
    return user;
};
export const deactivateUser = async (userId) => {
    const user = await UserModel.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!user)
        throw new Error("User not found");
    return user;
};
