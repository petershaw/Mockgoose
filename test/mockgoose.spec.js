describe('Mockgoose Tests', function () {
    'use strict';

    var mockgoose = require('../Mockgoose');
    var Mongoose = require('mongoose').Mongoose;
    var mongoose = new Mongoose();
    mockgoose(mongoose);
    mongoose.connect('mongodb://localhost:27017/TestingDB');
    var AccountModel = require('./models/AccountModel')(mongoose);
    var SimpleModel = require('./models/SimpleModel')(mongoose);

    beforeEach(function (done) {
        mockgoose.reset();
        AccountModel.create(
            {email: 'valid@valid.com', password: 'password'},
            {email: 'invalid@invalid.com', password: 'password'},
            function (err, models) {
                expect(err).toBeFalsy();
                expect(models).toBeTruthy();
                SimpleModel.create(
                    {name: 'one', value: 'one'},
                    {name: 'one', value: 'two'},
                    {name: 'one', value: 'two'},
                    {name: 'two', value: 'one'},
                    {name: 'two', value: 'two'},
                    function (err, models) {
                        expect(err).toBeFalsy();
                        expect(models).toBeTruthy();
                        done(err);
                    }
                );
            });

    });

    afterEach(function (done) {
        //Reset the database after every test.
        mockgoose.reset();
        done();
    });

    describe('SHOULD', function () {

        it('should be able to require mockgoose', function () {
            expect(mockgoose).toBeTruthy();
        });

        it('should be able to create and save test model', function (done) {
            AccountModel.create({email: 'email@email.com', password: 'supersecret'}, function (err, model) {
                expect(err).toBeFalsy();
                expect(model).toBeTruthy();
                done(err);
            });
        });

        it('should be able to call custom save pre', function (done) {
            AccountModel.create({email: 'newemail@valid.com', password: 'password'}, function (err, model) {
                //Custom pre save should encrypt the users password.
                expect(model.password).not.toBe('password');
                model.validPassword('password', function (err, success) {
                    expect(success).toBeTruthy();
                    expect(err).toBeFalsy();
                    done(err);
                });

            });
        });

        it('should be able to create multiple items in one go', function (done) {
            AccountModel.create({email: 'one@one.com', password: 'password'},
                {email: 'two@two.com', password: 'password'}, function (err, one, two) {
                    expect(err).toBeFalsy();
                    expect(one).toBeTruthy();
                    expect(two).toBeTruthy();
                    done(err);
                });
        });

        it('Count the number of items in a {} query', function (done) {
            SimpleModel.count({}, function (err, count) {
                expect(err).toBeNull();
                expect(count).toBe(5);
                done(err);
            });
        });

        it('Count the number of items in {query:query}', function (done) {
            SimpleModel.count({name: 'one'}, function (err, count) {
                expect(err).toBeNull();
                expect(count).toBe(3);
                done(err);
            });
        });

        it('Count the number of items if no object passed', function (done) {
            SimpleModel.count(function (err, count) {
                expect(err).toBeNull();
                expect(count).toBe(5);
                done(err);
            });
        });

        it('Be able to retrieve a model by string', function (done) {
            var Model = mongoose.model('simple');
            expect(Model).toBeDefined();
            done();
        });

        it('Be able to retrieve a model case sensitive', function (done) {
            var Model = mongoose.model('simple');
            expect(Model).toBeDefined();
            expect(function(){
                mongoose.model('Simple');
            }).toThrow();
            done();
        });

        it('Fail gracefully if null passed as model type', function (done) {
            expect(function () {
                mongoose.model(null);
            }).toThrow();
            done();
        });
    });
});