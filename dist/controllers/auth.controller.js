import * as AuthService from "../services/auth.service.js";
export const register = async (req, res) => {
    try {
        const { email, password, roleId, tenantId } = req.body;
        const user = await AuthService.register(email, password, roleId, tenantId);
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await AuthService.login(email, password);
        res.json(data);
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const data = await AuthService.refresh(refreshToken);
        res.json(data);
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await AuthService.logout(refreshToken);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
