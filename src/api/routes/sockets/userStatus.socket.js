import UsersStatus from '../../models/userStatus.model';

export const sendUsersList = async (socket, userId) => {
    const usersStatus            = await UsersStatus.list({page: 1})
    const transformedUsersStatus = []

    usersStatus.forEach(userStatus => {
        if (userStatus._id.toString() !== userId.toString()) {
            transformedUsersStatus.push(userStatus.transformList())
        }
    })

    socket.emit('usersList', transformedUsersStatus)
}


export const broadcastUsersList = async (socket) => {
    const usersStatus = await UsersStatus.list({page: 1})

    const transformedUsersStatus = usersStatus.map(userStatus => userStatus.transformList())

    socket.broadcast.emit("usersListBroadcast", transformedUsersStatus)
}
