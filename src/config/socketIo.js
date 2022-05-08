import SocketIo from "socket.io"

const config = {}

config["cors"] = {
    origin:  "*",
    methods: ["GET", "POST"]
}

export default SocketIo(config)
