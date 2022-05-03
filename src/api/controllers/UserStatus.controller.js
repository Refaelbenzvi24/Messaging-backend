import UserStatus from '../models/userStatus.model'


/**
 * Load userStatus and append to req.
 * @public
 */
export const load = async (req, res, next, id) => {
    try {
        const userStatus = await UserStatus.get(id, req)
        req.locals       = {userStatus}
        return next()
    } catch (error) {
        return next(error)
    }
}

/**
 * Get UserStatus
 * @public
 */
export const get = async (req, res, next) => {
    let userStatus = UserStatus.findOne({
        username: req.body.username,
        socketId: req.body.socketId
    })

    res.json(transformedUsersStatus)
}

export const list = async (req, res, next) => {
    try {
        const usersStatus            = await UserStatus.list(req.query)
        const transformedUsersStatus = usersStatus.map(userStatus => userStatus.transformList())

        res.json(transformedUsersStatus)
    } catch (error) {
        next(error)
    }
}




