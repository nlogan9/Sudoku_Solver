const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('POST request to /api/solve with valid puzzle string', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
            done();
        })
    });

    test('POST request to /api/solve with missing puzzle string', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            puzzle: ''
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field missing')
            done();
        })
    });

    test('POST request to /api/solve with invalid characters in puzzle string', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            puzzle: '13576298494638125772845961369451783a812936745357824196473298561581673429269145378'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle')
            done();
        })
    });

    test('POST request to /api/solve with wrong length of puzzle string', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            puzzle: '1357629849463812577284596136945178399812936745357824196473298561581673429269145378'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
            done();
        })
    });

    test('POST request to /api/solve with puzzle string that cant be solved', function(done) {
        chai.request(server)
        .post('/api/solve')
        .send({
            puzzle: '.................................................................................'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved')
            done();
        })
    });

    test('POST request to /api/check with all fields', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'a1',
            value: '1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true)
            done();
        })
    });

    test('POST request to /api/check with a single placement conflict', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'a2',
            value: '8'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false)
            assert.lengthOf(res.body.conflict, 1);
            done();
        })
    });

    test('POST request to /api/check with multiple placement conflicts', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'a2',
            value: '1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false)
            assert.lengthOf(res.body.conflict, 2);
            done();
        })
    });

    test('POST request to /api/check with all placement conflicts', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'b1',
            value: '1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false)
            assert.lengthOf(res.body.conflict, 3);
            done();
        })
    });

    test('POST request to /api/check with missing fields', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'b1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field(s) missing");
            done();
        })
    });

    test('POST request to /api/check with invalid characters in puzzle string', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5..a..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'b1',
            value: '1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
        })
    });

    test('POST request to /api/check with puzzle string without the correct number of characters', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'b1',
            value: '1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            done();
        })
    });

    test('POST request to /api/check with puzzle string without the correct number of characters', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'b0',
            value: '1'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
            done();
        })
    });

    test('POST request to /api/check with puzzle string without the correct number of characters', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'b1',
            value: '0'
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
        })
    });





});

