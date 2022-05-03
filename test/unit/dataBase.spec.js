import {expect} from 'chai'
import DataBase from '../../src/utility/dataBase'


    describe('DataBase [Unit]', () => {
    let stub   = null
    const data = Array(10).fill({id: 1, name: 'test'})

    beforeEach(() => {
        DataBase.destroy()
        stub = DataBase.getInstance()
    })

    describe('#getInstance', () => {
        it('should be a singleton', () => {
            expect(stub).to.be.an.instanceof(DataBase)
        })

        it('should retrieve the same instance every time getInstance is called', () => {
            const stub2 = DataBase.getInstance()
            const data  = Array(1).fill({id: 1, name: 'test'})
            stub2.setEntity('test', data)

            expect(stub).to.be.equal(stub2)
            expect(stub.getEntity('test')).to.be.deep.equal(data)
            expect(stub2.getEntity('test')).to.be.deep.equal(data)
        })

        it('should be an empty data base', function () {
            expect(Object.keys(stub.entities).length).to.be.equal(0)
        })

        it('should retrieve Exception if the constructor is called again', () => {
            expect(() => new DataBase()).to.throw(Error)
        })
    })

    describe('#setEntity', () => {
        it('should set the entity', () => {
            const data = Array(1).fill({id: 1, name: 'test'})
            stub.setEntity('test', data)
            expect(stub.getEntity('test')).to.be.deep.equal(data)
        })

        it('should throw an exception if the entity is not an array', () => {
            expect(() => stub.setEntity('test', {})).to.throw(Error)
        })

        it('should throw an exception if the entity is not an array of objects', () => {
            expect(() => stub.setEntity('test', [1, 2, 3])).to.throw(Error)
        })
    })

    describe('#getEntity', () => {
        it('should retrieve the entity', () => {
            const data = Array(10).fill({id: 1, name: 'test'})

            stub.setEntity('test', data)
            expect(stub.getEntity('test')).to.be.deep.equal(data)
        })

        it('should throw an exception if the entity does not exist', () => {
            expect(() => stub.getEntity('test')).to.throw(Error)
        })
    })

    describe('#addEntityObject', () => {
        it('should add an object to the entity', () => {
            stub.setEntity('test', data)

            expect(stub.getEntity('test')).to.be.instanceof(Array).and.to.have.lengthOf(10)
            stub.addEntityObject('test', {id: 2, name: 'test2'})

            expect(stub.getEntity('test')).to.be.instanceof(Array).and.to.have.lengthOf(11)
            expect(stub.getEntity('test')).to.be.deep.equal([...data, {id: 2, name: 'test2'}])
        })

        it('should deep copy the every new item', () => {
            const data = Array(10).fill({id: 1, name: 'test'})
            stub.setEntity('test', data)

            expect(stub.getEntity('test')).to.be.instanceof(Array).and.to.have.lengthOf(10)
            stub.addEntityObject('test', {id: 2, name: 'test2'})

            expect(stub.getEntity('test')).to.be.instanceof(Array).and.to.have.lengthOf(11)
            expect(stub.getEntity('test')).to.be.deep.equal([...data, {id: 2, name: 'test2'}])

            data[0].id = 2
            expect(stub.getEntity('test')[0].id).to.be.deep.equal(1)
        })

        it('should not throw an exception if the entity does not exist', () => {
            expect(() => stub.addEntityObject('test', {id: 2, name: 'test2'})).to.not.throw(Error)
        })
    })

})
