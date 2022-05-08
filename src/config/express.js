import express    from 'express'
import bodyParser from 'body-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'
import routes     from '../api/routes/v1'
import strategies from './passport'
import * as error from '../api/middlewares/error'

// Create express app
const app = express()

// parse body params and attache them to req.body
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// gzip compression
app.use(compress())

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// enable authentication
app.use(passport.initialize())
passport.use('jwt', strategies.jwt)

// mount api v1 routes
app.use("/v1", routes)

// if error is not an instanceOf APIError, convert it.
app.use(error.converter)

// catch 404 and forward to error handler
app.use(error.notFound)

// error handler, send stacktrace only during development
app.use(error.handler)



export default app
