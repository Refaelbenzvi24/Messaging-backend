import SocketIo from "socket.io"
import { env, clientUrl } from "./vars"

const config = {}

if (env === "development") {
    config["cors"] = {
        origin: clientUrl,
        methods: ["GET", "POST"]
    }
}

export default SocketIo(config)
