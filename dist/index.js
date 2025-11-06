import express from "express";
import cors from "cors";
import { config, connectDb } from "./config/index.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use((_req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src *; img-src * data: blob:; frame-src *;");
    next();
});
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/tenants", tenantRoutes);
connectDb().then(() => {
    app.listen(config.port, () => console.log(`✅ User Service running on port ${config.port}`));
});
