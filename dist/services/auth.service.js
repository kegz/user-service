import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { RefreshTokenModel } from "../models/refreshToken.model.js";
import { config } from "../config/index.js";
export const register = async (email, password, roleId, tenantId) => {
    const exists = await UserModel.findOne({ email });
    if (exists)
        throw new Error("User already exists");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, passwordHash, role: roleId, tenant: tenantId });
    return { id: user._id, email: user.email, role: user.role };
};
export const login = async (email, password) => {
    const user = await UserModel.findOne({ email }).populate("role");
    if (!user || !user.isActive)
        throw new Error("Invalid credentials");
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
        throw new Error("Invalid credentials");
    const accessToken = jwt.sign({ sub: user._id, role: user.role.name, tenant: user.tenant?.toString() }, config.jwtSecret, { expiresIn: "1h" });
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshTokenModel.create({ user: user._id, token: refreshToken, expiresAt });
    await UserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    return { accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role.name } };
};
export const refresh = async (token) => {
    const record = await RefreshTokenModel.findOne({ token });
    if (!record || record.expiresAt < new Date())
        throw new Error("Invalid refresh token");
    const user = await UserModel.findById(record.user).populate("role");
    if (!user)
        throw new Error("User not found");
    const accessToken = jwt.sign({ sub: user._id, role: user.role.name, tenant: user.tenant?.toString() }, config.jwtSecret, { expiresIn: "1h" });
    return { accessToken };
};
export const logout = async (token) => {
    await RefreshTokenModel.deleteOne({ token });
};
