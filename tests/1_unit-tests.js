const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Valid puzzle string', function() {
        assert.equal('', solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'soduko-solver correctly validates a valid puzzle string');
    });
    test('Invalid character in puzzle string', function() {
        assert.equal('Invalid characters in puzzle', solver.validate('1.5..2.84..63.12.7.2..5..a..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'soduko-solver correctly handles a puzzle string with invalid characters');
    });
    test('Invalid puzzle string length', function() {
        assert.equal('Expected puzzle to be 81 characters long', solver.validate('1.5..2.84..63.12.7.2..5....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'soduko-solver correctly handles a puzzle string not 81 characters in length');
    });
    test('Valid row placement', function() {
        assert.isTrue(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', '1', '1'), 'soduko-solver correctly handles valid row placement');
    });
    test('Invalid row placement', function() {
        assert.isFalse(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', '2', '1'), 'soduko-solver correctly handles invalid row placement');
    });
    test('Valid column placement', function() {
        assert.isTrue(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', '1', '1'), 'soduko-solver correctly handles valid column placement');
    });
    test('Invalid column placement', function() {
        assert.isFalse(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'b', '1', '1'), 'soduko-solver correctly handles invalid column placement');
    });
    test('Valid region placement', function() {
        assert.isTrue(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', '1', '1'), 'soduko-solver correctly handles valid region placement');
    });
    test('Invalid region placement', function() {
        assert.isFalse(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', '2', '1'), 'soduko-solver correctly handles invalid region placement');
    });
    test('Valid strings fail solver', function() {
        assert.property(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 'solution', 'soduko-solver correctly solves valid puzzle strings');
    });
    test('Invalid strings pass solver', function() {
        assert.property(solver.solve('.................................................................................'), 'error', 'soduko-solver puzzle strings that cant be solved are correctly handled');
    });
    test('Valid strings fail solver', function() {
        assert.equal(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.').solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378', 'soduko-solver correctly solves valid puzzle strings');
    });
});
