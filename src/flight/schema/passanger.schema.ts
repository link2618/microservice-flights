import * as mongoose from 'mongoose';

export const PassangerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
})

PassangerSchema.index({ email: 1 }, { unique: true })