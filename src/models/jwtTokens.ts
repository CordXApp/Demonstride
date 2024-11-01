import { Schema } from 'mongoose'
import { CordXSignatures } from '@/types/database/users';

export const UserSignatureSchema: Schema = new Schema<CordXSignatures>(
    {
        key: { type: String, required: true }
    },
    {
        timestamps: true
    }
)