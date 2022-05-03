import httpStatus from 'http-status'
import User from '../models/user.model'
import UserStatus from "../models/userStatus.model"
import RefreshToken from '../models/refreshToken.model'
import moment from 'moment-timezone'
import {jwtExpirationInterval} from '../../config/vars'
import {v4 as uuidv4} from 'uuid'

/**
 * Returns a formatted object with tokens.
 * @param {Object} user
 * @param {String} accessToken
 * @private
 */
function generateTokenResponse(user, accessToken) {
    const tokenType    = 'Bearer'
    const refreshToken = RefreshToken.generate(user).token
    const expiresIn    = moment().add(jwtExpirationInterval, 'minutes')
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    }
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
    try {
        req.body.createdBy    = "userRegistered"
        req.body.updatedBy    = ''
        const publicId        = uuidv4()
        const user            = await new User({publicId, ...req.body}).save()
        const userTransformed = user.transform()
        const token           = generateTokenResponse(user, user.token())
        await new UserStatus({_id: user._id, username: user.name, publicId}).save()
        res.status(httpStatus.CREATED)
        return res.json({token, user: userTransformed})
    } catch (error) {
        return next(User.checkDuplicateEmail(error))
    }
}
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
    try {
        const {user, accessToken} = await User.findAndGenerateToken(req.body)
        const token               = generateTokenResponse(user, accessToken)
        const userTransformed     = user.transform()

        return res.json({token, user: userTransformed})
    } catch (error) {
        return next(error)
    }
}

/**
 * logout a user for given email and refresh token
 * @public
 */
exports.logout = async (req, res, next) => {
    try {
        const {email, refreshToken} = req.body
        const refreshObject         = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token:     refreshToken
        })
        return res.json(refreshObject).message('logout performed successfully')
    } catch (error) {
        return next(error)
    }
}

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
    try {
        const {email, refreshToken} = req.body
        const refreshObject         = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token:     refreshToken,
        })
        const {user, accessToken}   = await User.findAndGenerateToken({email, refreshObject})
        const response              = generateTokenResponse(user, accessToken)
        return res.json(response)
    } catch (error) {
        return next(error)
    }
}
