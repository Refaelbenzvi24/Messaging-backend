import UsersStatus from '../api/models/userStatus.model';

export const sendUsersStatus = async (socket, userId) => {
    const usersStatus            = await UsersStatus.list({page: 1})
    const transformedUsersStatus = []

    usersStatus.forEach(userStatus => {
        if (userStatus._id.toString() !== userId.toString()) {
            transformedUsersStatus.push(userStatus.transformList())
        }
    })

    socket.emit("usersList", transformedUsersStatus)
}


export const broadcastUsersList = async (socket) => {
    const usersStatus = await UsersStatus.list({page: 1})

    const transformedUsersStatus = usersStatus.map(userStatus => userStatus.transformList())

    transformedUsersStatus.forEach(user => {
        if (user.socketId !== socket.id) {
            const userTransformedUsersStatus = transformedUsersStatus.filter(userStatus => userStatus.publicId !== user.publicId)

            socket.broadcast.to(user.socketId).emit("usersList", userTransformedUsersStatus)
        }
    })
}
