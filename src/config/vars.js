import path from 'path'
import env from 'dotenv-safe'

if (process.env.NODE_ENV === 'development') {
    env.load({
        path:   path.join(__dirname, '../../.env'),
        sample: path.join(__dirname, '../../.env.example'),
    })
}

env.config()

module.exports = {
    env:                               process.env.NODE_ENV || 'development',
    port:                              process.env.PORT || 8080,
    jwtSecret:                         process.env.JWT_SECRET,
    jwtExpirationInterval:             parseInt(process.env.JWT_EXPIRATION_MINUTES) || 45,
    jwtRefreshTokenExpirationInterval: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS) || 60,
    mongo:                             {
        uri: process.env.MONGO_URI,
    },
}
