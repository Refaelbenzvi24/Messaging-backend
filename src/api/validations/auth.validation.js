const Joi = require('joi')

export const register = {
    body: Joi.object({
        name:     Joi.string().required(),
        email:    Joi.string().email().required(),
        password: Joi.string().required().min(6).max(128)
    })
}

// POST /v1/auth/login
export const login = {
    body: Joi.object({
        email:    Joi.string().email().required(),
        password: Joi.string().required().max(128)
    })
}

export const logout = {
    body: Joi.object({
        email:        Joi.string().email().required(),
        refreshToken: Joi.string().required()
    })
}

// POST /v1/auth/refresh
export const refresh = {
    body: Joi.object({
        email:        Joi.string().email().required(),
        refreshToken: Joi.string().required()
    })
}
