Promise = require('bluebird') // make bluebird default Promise
import app from './config/express'
import {port} from './config/vars'
import mongoose from "./config/mongoose"
import http from 'http'
import io from './config/socketIo'
import {socketConnection} from "./api/routes/sockets";

// open mongoose connection
(async () => await mongoose.connect())()

const server = http.createServer(app)

io.listen(server)
io.on('connection', socketConnection)


server.listen(port, () => {
    console.log(`app is running at port: ${port}`)
})

/**
 * Exports express
 * @public
 */
export default app


