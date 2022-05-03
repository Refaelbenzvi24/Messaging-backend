import User from "../../models/user.model";
import UserStatus from "../../models/userStatus.model";
import {broadcastUsersList, sendUsersList} from "./userStatus.socket";
import {getMessage} from "./message.socket";

export const socketConnection = (socket) => {
    let user
    let userStatus

    socket.on('', async (userId) => {
        user       = await User.findById(userId).exec()
        userStatus = await UserStatus.findById(userId).exec()

        userStatus["online"]   = true
        userStatus["socketId"] = socket.id
        await userStatus.save()
        await broadcastUsersList(socket)
    })

    getMessage(socket)

    socket.on("disconnect", async () => {
        if (userStatus) {
            userStatus["online"]     = false
            userStatus["socketId"]   = null
            userStatus["lastOnline"] = Date.now()
            userStatus.save()
        }

        setTimeout(async () => {
            await broadcastUsersList(socket)
        }, 1000)
    })
}
