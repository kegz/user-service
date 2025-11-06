import mongoose, { Schema } from "mongoose";
const RefreshTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });
export const RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);
