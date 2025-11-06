import mongoose, { Schema, Document } from "mongoose";

export interface IPermission extends Document {
  code: string;        // e.g., "PROJECT_CREATE"
  description: string; // e.g., "Can create projects"
  category?: string;   // e.g., "Project"
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, required: true },
    category: { type: String }
  },
  { timestamps: true }
);

export const PermissionModel = mongoose.model<IPermission>("Permission", PermissionSchema);
