import {expect}     from 'chai'
import MessageModel from '../../src/api/models/message.model'


describe('MessageModel [Unit]', () => {
    let stub   = null
    const data = {
        message: 'text text text',
        sender:         'Yaniv',
        recipient:      'Shon',
    }

    beforeEach(() => {
        stub = new MessageModel(data)
    })

    describe('#Constractor', () => {
        it('should be an object', () => {
            expect(stub).to.be.an('object')
        })

        it('should contain keys', () => {
            expect(Object.keys(stub)).to.be.eql(['entityName', 'id', 'message', 'sender', 'recipient'])
            expect(stub.message).to.be.eql(data.message)
            expect(stub.sender).to.be.eql(data.sender)
            expect(stub.recipient).to.be.eql(data.recipient)
        })
    })

    describe('get message of specific receiver', () => {
        it('should return an array of messages', () => {

            new MessageModel({
                message: 'text2',
                sender:         'Yaniv',
                recipient:      'Shon',
            }).save()

            new MessageModel({
                message: 'text1',
                sender:         'Yaniv',
                recipient:      'Shon',
            }).save()

            new MessageModel({
                message: 'text1',
                sender:         'Yaniv',
                recipient:      'David',
            }).save()

            const stub = MessageModel.findAll((item) => item["recipient"] === 'Shon')
            expect(stub).to.be.an('array').with.lengthOf(2)
            expect(stub[1].message).to.be.eql('text1')
            expect(stub[0].message).to.be.eql('text2')
        })
    })
})
