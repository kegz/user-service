import mongoose, { Schema, Document } from "mongoose";
import type { IPermission } from "./permission.model.js";

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: mongoose.Types.ObjectId[] | IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: { type: String },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }]
  },
  { timestamps: true }
);

export const RoleModel = mongoose.model<IRole>("Role", RoleSchema);
