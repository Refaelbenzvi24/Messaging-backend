export const getMessage = (socket) => socket.on('message', data => {
    const {message, username, publicId, socketId} = data
    const newMessage = {message, username, socketId, publicId}
    socket.broadcast.to(socketId).emit('message', newMessage)
})
