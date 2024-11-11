import { Schema } from 'mongoose'

export const UserSignatureSchema: Schema = new Schema<any>(
    {
        key: { type: String, required: true }
    },
    {
        timestamps: true
    }
)