import bcrypt from "bcryptjs";
import { UserModel, type IUser } from "../models/user.model.js";
import { ensureUniqueEmail, validateRoleAssignment } from "../rules/user.rules.js";

export const listUsers = () => UserModel.find().select("-passwordHash");
export const getUser = (id: string) => UserModel.findById(id).select("-passwordHash");

export const createUser = async (data: {
    email: string;
    password: string;
    roleId: string;
    tenantId?: string;
    actorRole: string;
    }): Promise<IUser> => {
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

export const updateUser = async (userId: string, payload: Partial<IUser>) => {
    if ((payload as any).password) {
        (payload as any).passwordHash = await bcrypt.hash((payload as any).password, 10);
        delete (payload as any).password;
    }
    const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
    if (!user) throw new Error("User not found");
    return user;
};

export const deactivateUser = async (userId: string) => {
    const user = await UserModel.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!user) throw new Error("User not found");
    return user;
};
