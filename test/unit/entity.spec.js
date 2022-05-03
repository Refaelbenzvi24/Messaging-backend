import {expect}    from 'chai'
import EntityModel from '../../src/api/models/entity.model'
import DataBase    from '../../src/utility/dataBase'


describe('EntityModel [Unit]', () => {
    let stub   = null
    const data = {
        id:          '1',
        name:        'test',
        description: 'test',
        createdAt:   '2017-01-01T00:00:00.000Z',
        updatedAt:   '2017-01-01T00:00:00.000Z',
    }

    class mockClass extends EntityModel {
        static ENTITY_TYPE = 'mockClass';

        constructor(data) {
            super(mockClass.ENTITY_TYPE)
            this.data = data
        }
    }

    beforeEach(() => {
        DataBase.destroy()
        stub = new mockClass(data)
    })

    describe('#constractor', () => {
        it('should be an object', () => {
            expect(stub).to.be.an('object')
        })

        it('should contain keys', () => {
            expect(Object.keys(stub)).to.be.eql(['entityName', 'data'])
            expect(stub.data).to.be.deep.equal(data)
        })
    })

    describe('#toJson', () => {
        it('should return a json object', () => {
            expect(stub.toJson()).to.be.deep.equal({data: data})
        })
    })

    describe('#save', () => {
        it('should return a promise', () => {
            stub.save()
            expect(mockClass.findAll()).to.be.a('Array').with.length(1)
        })
    })

    describe('#findAll', () => {
        it('should throw error when there is no entity data', () => {
            expect(() => mockClass.findAll()).to.throw(Error)
        })

        it('should retrieve list of object when there is a data on the db', () => {
            stub.save()
            expect(mockClass.findAll()).to.be.a('Array').with.length(1)
            expect(mockClass.findAll()[0]).to.be.an('object').and.deep.equal(stub.toJson())
        })
    })
})
