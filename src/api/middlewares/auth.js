import httpStatus from 'http-status'
import passport from 'passport'
import APIError from '../utils/APIError'


const handleJWT = (req, res, next) => async (err, user, info) => {
    const error = err || info
    const logIn = Promise.promisify(req.logIn)
    const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    })

    try {
        if (error || !user) {
            throw error
        }
        await logIn(user, {session: false})
    } catch (e) {
        return next(apiError)
    }

    if (err || !user) {
        return next(apiError)
    }

    req.user = user

    return next()
}


export const authorize = () => {
    return (req, res, next) =>
        passport.authenticate('jwt',
            {session: false},
            handleJWT(req, res, next))(req, res, next)
}

