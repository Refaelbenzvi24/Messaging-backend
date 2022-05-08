import UserStatus from "../api/models/userStatus.model";

export const getMessage = (socket) => socket.on('message', async data => {
    const {message, socketId} = data

    const userStatus = await UserStatus.findOne({socketId: socket.id}).exec()

    const newMessage = {message, socketId: userStatus.socketId, publicId: userStatus.publicId}
    socket.broadcast.to(socketId).emit('message', newMessage)
})
