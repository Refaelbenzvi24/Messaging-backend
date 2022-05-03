const request               = require('supertest')
const httpStatus            = require('http-status')
const {expect}              = require('chai')
const {some, omitBy, isNil} = require('lodash')
const app                   = require('../../src/index')
const User                  = require('../../src/api/models/message.model')

describe('MessageModel [API]', async () => {


    describe('POST /v1/message', () => {
        it('should create a new message when request is ok', () => {
            return request(app)
                .post('/v1/message')
                .send({
                    message: 'text text text text text',
                    sender:         'Yaniv',
                    recipient:      'Shon',
                })
                .expect(httpStatus.CREATED)
        })

        it('should report error when message is not provided', () => {

            return request(app)
                .post('/v1/message')
                .send({
                    sender:         'Yaniv',
                    recipient:      'Shon',
                })
                .expect(httpStatus.BAD_REQUEST)
        })

        it('should report error when message length is less than 10', () => {

            return request(app)
                .post('/v1/message')
                .send({
                    messageContent: '',
                    sender:         'Yaniv',
                    recipient:      'Shon',
                })
                .expect(httpStatus.BAD_REQUEST)
        })
    })

    describe('GET /v1/message', () => {
        it('should retrieve BAD_REQUEST when recipient param is not attached to the parameter', () => {
            return request(app)
                .get('/v1/message')
                .expect(httpStatus.BAD_REQUEST)
        })

        it('should get all users', () => {
            return request(app)
                .get('/v1/message')
                .query({
                    recipient: 'Shon'
                })
                .expect(httpStatus.OK)
        })
    })

})
