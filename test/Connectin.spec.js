describe('Connection Tests', function () {
    'use strict';

    var mockgoose = require('../Mockgoose');
    var Mongoose = require('mongoose').Mongoose;
    var mongoose;

    beforeEach(function (done) {
        mongoose = new Mongoose();
        mockgoose(mongoose);
        done();
    });

    afterEach(function (done) {
        done();
    });

    describe('Connect', function () {
        var connection;
        var SimpleModel;
        beforeEach(function(done){
            connection = mongoose.connect('mongodb://localhost:27017/TestingDB');
            expect(mongoose.connections.length).toBe(1);
            SimpleModel = require('./models/SimpleModel')(mongoose);
            SimpleModel.create(
                {name: 'one', value: 'one'},
                function (err) {
                    done(err);
                }
            );
        });

        it('Connection should always be the same instance', function (done) {
            expect(mongoose.connect('mongodb://localhost:27017/TestingDB2')).toEqual(connection);
            done();
        });

        it('Be able to connect with just a host and database and port and options and callback', function (done) {
            mongoose.connect('mongodb://localhost/', 'TestingDB', '8080', {db: 'something'}, function (err, result) {
                expect(err).toBeNull();
                expect(result).toBeTruthy();
                done();
            });
        });

        it('Should NOT return an error when connecting to Mockgoose through connect', function (done) {
            mongoose.connect('mongodb://localhost:27017/TestingDB', function (err, result) {
                expect(err).toBeNull();
                expect(result).toBeTruthy();
                done();
            });
        });

        it('Be able to connect with just a host', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/TestingDB');
                done();
            }).not.toThrow();
        });

        it('Be able to connect with just a host and callback', function (done) {
            mongoose.connect('mongodb://localhost:27017/TestingDB', function (err, result) {
                expect(err).toBeNull();
                expect(result).toBeTruthy();
                done();
            });
        });

        it('Be able to connect with just a host and database', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/', 'TestingDB');
                done();
            }).not.toThrow();
        });

        it('Be able to connect with just a host and database and callback', function (done) {
            mongoose.connect('mongodb://localhost:27017/', 'TestingDB', function (err, result) {
                expect(err).toBeNull();
                expect(result).toBeTruthy();
                done();
            });
        });

        it('Be able to connect with just a host and database and port', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/', 'TestingDB', 8080);
                done();
            }).not.toThrow();
        });

        it('Be able to connect with just a host and database and port and callback', function (done) {
            mongoose.connect('mongodb://localhost:27017/', 'TestingDB', '8080', function (err, result) {
                expect(err).toBeNull();
                expect(result).toBeTruthy();
                done();
            });
        });

        it('Be able to connect with just a host and database and port and options', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/', 'TestingDB', 8080, {db: 'something'});
                done();
            }).not.toThrow();
        });

        it('Be able to return the same model instance lowercase', function (done) {
            var model = mongoose.model('simple');
            expect(model).toEqual(SimpleModel);
            done();
        });

    });

    describe('CreateConnection', function () {
        var connection;
        var SimpleModel;
        beforeEach(function(done){
            connection = mongoose.createConnection('mongodb://localhost:27017/TestingDB');
            expect(mongoose.connections.length).toBe(2);
            SimpleModel = require('./models/SimpleModel')(connection);
            SimpleModel.create(
                {name: 'one', value: 'one'},
                function (err) {
                    done(err);
                }
            );
        });

        it('Should NOT return an error when connecting to Mockgoose through createConnection', function (done) {
            mongoose.createConnection('mongodb://localhost:27017/TestingDB', function (err, result) {
                expect(err).toBeNull();
                expect(result).toBeTruthy();
                done();
            });
        });

        it('Return a new instance when creating a connection', function (done) {
            var model = mongoose.model('simple');
            var model2 = connection.model('simple');
            expect(model).toEqual(model2);
            done();
        });

    });

});