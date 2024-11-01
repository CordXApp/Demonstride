import { Schema } from 'mongoose'
import { UserDomains } from '@/types/database/users';

export const UserDomainSchema: Schema = new Schema<UserDomains>(
    {
        name: { type: String, required: true },
        txtContent: { type: String, required: true },
        verified: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
)