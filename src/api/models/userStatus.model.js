import mongoose from 'mongoose'
import httpStatus from 'http-status'
import {omitBy, isNil, get} from 'lodash'
import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'
import jwt from 'jwt-simple'
import APIError from '../utils/APIError'
import {env, jwtSecret, jwtExpirationInterval} from '../../config/vars'


/**
 * User Schema
 * @private
 */
const userStatusSchema = new mongoose.Schema({
    username: {
        type:     String,
        required: true
    },
    publicId: {
        type:     String,
        required: true
    },
    socketId: {
        type: String,
    },
    online:   {
        type:    Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
    },
}, {
    timestamps: true,
})

/**
 * Methods
 */
userStatusSchema.method({
    transform() {
        const transformed = {}
        const fields      = ['publicId', 'socketId', 'username', 'online', 'lastOnline']
        fields.forEach((field) => {
            transformed[field] = get(this, field)
        })

        return transformed
    },

    transformList() {
        const transformed = {}
        const fields      = ['publicId', 'socketId', 'username', 'online', 'lastOnline']
        fields.forEach((field) => {
            transformed[field] = get(this, field)
        })

        return transformed
    },
})

/**
 * Statics
 */
userStatusSchema.statics = {

    async get(id) {
        try {
            let userStatus

            if (mongoose.Types.ObjectId.isValid(id)) {
                userStatus = await this.findById(id).exec()
            }

            if (userStatus) {
                return userStatus
            }

            throw new APIError({
                message: 'Tag does not exist',
                status:  httpStatus.NOT_FOUND,
            })
        } catch (error) {
            throw error
        }
    },
    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({page = 1, perPage = 30, online = true}) {
        const options = omitBy({online}, isNil)

        return this.find(options)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec()
    },
}

/**
 * @typedef UserStatus
 */
export default mongoose.model('UserStatus', userStatusSchema)
