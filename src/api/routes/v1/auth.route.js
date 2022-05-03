import express from 'express'
import {validate} from 'express-validation'
import * as controller from '../../controllers/auth.controller'
import {authorize} from '../../middlewares/auth'
import {
    login,
    logout,
    register,
    refresh,
} from '../../validations/auth.validation'

const router = express.Router()

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission user
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 *
 * @apiSuccess (Created 201) {String}  token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
 * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in milliseconds
 * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
 *
 * @apiSuccess (Created 201) {String}  user.id         User's id
 * @apiSuccess (Created 201) {String}  user.name       User's name
 * @apiSuccess (Created 201) {String}  user.email      User's email
 * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/register')
    .post(validate(register), controller.register)



router.route('/login')
    /**
     * @api {post} v1/auth/login Login
     * @apiDescription Get an accessToken
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}         email     User's email
     * @apiParam  {String{..128}}  password  User's password
     *
     * @apiSuccess  {String}  token.tokenType     Access Token's type
     * @apiSuccess  {String}  token.accessToken   Authorization Token
     * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
     *                                                   after expiration time
     * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
     *                                                   in milliseconds
     *
     * @apiSuccess  {String}  user.id             User's id
     * @apiSuccess  {String}  user.name           User's name
     * @apiSuccess  {String}  user.email          User's email
     * @apiSuccess  {Date}    user.createdAt      Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
     */
    .post(validate(login), controller.login)


/**
 * @api {post} v1/auth/logout Logout
 * @apiDescription Logout a user
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup Auth
 * @apiPermission user
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/logout')
    .post(authorize(), validate(logout), controller.logout)

/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/refresh-token')
    .post(validate(refresh), controller.refresh)


export default router
