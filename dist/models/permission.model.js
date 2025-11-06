import mongoose, { Schema } from "mongoose";
const PermissionSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, required: true },
    category: { type: String }
}, { timestamps: true });
export const PermissionModel = mongoose.model("Permission", PermissionSchema);
