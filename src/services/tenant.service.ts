import { TenantModel } from "../models/tenant.model.js";
import { ensureTenantNameUnique, ensureTenantDeletable } from "../rules/tenant.rules.js";

export const listTenants = () => TenantModel.find();

export const createTenant = async (name: string, domain?: string) => {
    await ensureTenantNameUnique(name);
    return TenantModel.create({ name, domain });
};

export const updateTenant = async (id: string, payload: any) => {
    const t = await TenantModel.findByIdAndUpdate(id, payload, { new: true });
    if (!t) throw new Error("Tenant not found");
    return t;
};

export const deleteTenant = async (id: string) => {
    await ensureTenantDeletable(id);
    await TenantModel.findByIdAndDelete(id);
};
