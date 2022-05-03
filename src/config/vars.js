import path from 'path'
import env from 'dotenv-safe'

if (process.env.NODE_ENV === 'development') {
    env.load({
        path:   path.join(__dirname, '../../.env'),
        sample: path.join(__dirname, '../../.env.example'),
    })
}

module.exports = {
    env:  process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',
    jwtSecret:                         process.env.JWT_SECRET,
    jwtExpirationInterval:             process.env.JWT_EXPIRATION_MINUTES,
    jwtRefreshTokenExpirationInterval: process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS,
    mongo:                             {
        uri: process.env.MONGO_URI,
    },
}
