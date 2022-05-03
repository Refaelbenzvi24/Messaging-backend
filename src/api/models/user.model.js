import mongoose from 'mongoose'
import httpStatus from 'http-status'
import {omitBy, isNil} from 'lodash'
import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'
import jwt from 'jwt-simple'
import APIError from '../utils/APIError'
import {env, jwtSecret, jwtExpirationInterval} from '../../config/vars'


/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
    isDeleted:     {
        type:     Boolean,
        required: true,
        default:  false,
    },
    email:         {
        type:      String,
        match:     /^\S+@\S+\.\S+$/,
        required:  true,
        unique:    true,
        trim:      true,
        lowercase: true,
    },
    password:      {
        type:      String,
        required:  true,
        minlength: 6,
        maxlength: 128,
    },
    publicId:      {
        type:     String,
        required: true
    },
    name:          {
        type:      String,
        maxlength: 128,
        index:     true,
        trim:      true,
    },
    services:      {
        facebook: String,
        google:   String,
    },
    createdBy:     {
        type: String,
    },
    updatedBy:     {
        type: String,
    },
    updateHistory: {
        type:    Object,
        default: [],
    }
}, {
    timestamps: true,
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) {
            return next()
        }

        const rounds = env === 'test' ? 1 : 10

        const hash    = await bcrypt.hash(this.password, rounds)
        this.password = hash

        return next()
    } catch (error) {
        return next(error)
    }
})

/**
 * Methods
 */
userSchema.method({
    transform() {
        const transformed = {}
        const fields      = ['isDeleted', 'id', 'publicId', 'name', 'email', 'createdAt']

        fields.forEach((field) => {
            transformed[field] = this[field]
        })

        return transformed
    },

    token() {
        const playload = {
            exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this._id,
        }
        return jwt.encode(playload, jwtSecret)
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password)
    },
})

/**
 * Statics
 */
userSchema.statics = {
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec()
            }
            if (user) {
                return user
            }

            throw new APIError({
                message: 'User does not exist',
                status:  httpStatus.NOT_FOUND,
            })
        } catch (error) {
            throw error
        }
    },

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const {email, password, refreshObject} = options
        if (!email) {
            throw new APIError({message: 'An email is required to generate a token'})
        }

        const user = await this.findOne({email}).exec()
        const err  = {
            status:   httpStatus.UNAUTHORIZED,
            isPublic: true,
        }

        if (user.isDeleted) {
            throw new APIError({
                status:  httpStatus.FORBIDDEN,
                message: 'Account is disabled.'
            })
        }
        if (password) {
            if (user && await user.passwordMatches(password)) {
                return {user, accessToken: user.token()}
            }
            err.message = 'Incorrect email or password'
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.'
            } else {
                return {user, accessToken: user.token()}
            }
        } else {
            err.message = 'Incorrect email or refreshToken'
        }
        throw new APIError(err)
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({page = 1, perPage = 30, name, email, isDeleted = false}) {
        name !== '' && name ? name = {"$regex": name, "$options": "i"} : ''
        const options = omitBy({name, email, isDeleted}, isNil)

        return this.find(options)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec()
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return new APIError({
                message:  'Validation Error',
                errors:   [
                    {
                        field:    'email',
                        location: 'body',
                        messages: ['"email" already exists'],
                    },
                ],
                status:   httpStatus.CONFLICT,
                isPublic: true,
                stack:    error.stack,
            })
        }
        return error
    },
}

/**
 * @typedef User
 */
export default mongoose.model('User', userSchema)
