import mongoose, { Schema, model } from 'mongoose';
import { UserSignatureSchema } from './jwtTokens'
import { UserDomainSchema } from './userDomains'

const MongoUserSchema = new Schema<any>({
    id: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    banner: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    globalName: {
        type: String,
        required: false
    },
    owner: {
        type: Boolean,
        required: false,
        default: false
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    moderator: {
        type: Boolean,
        required: false,
        default: false
    },
    support: {
        type: Boolean,
        required: false,
        default: false
    },
    banned: {
        type: Boolean,
        required: false,
        default: false
    },
    verified: {
        type: Boolean,
        required: false,
        default: false
    },
    beta: {
        type: Boolean,
        required: false,
        default: false
    },
    active_domain: {
        type: String,
        required: false,
        default: 'none'
    },
    domains: {
        type: [UserDomainSchema],
        required: false,
        default: []
    },
    signature: {
        type: UserSignatureSchema,
        required: false,
        default: null
    }
})

const MongoUsers = mongoose.models.cordxUsers || model('cordxUsers', MongoUserSchema)

export { MongoUsers, MongoUserSchema }