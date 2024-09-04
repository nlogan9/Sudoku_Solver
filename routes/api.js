'use strict';

const bodyParser  = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      console.log(puzzleString, coordinate, value);
      if (!puzzleString || !coordinate || !value) {return res.json({error: "Required field(s) missing"});}
      const puzzleValid = solver.validate(puzzleString);
      if (puzzleValid) { return res.json({ error: puzzleValid })};
      const coordRegex = /^[a-i][1-9]$/i;
      if (!coordRegex.test(coordinate)) {return res.json({error: "Invalid coordinate"});}
      const valueRegex = /^[1-9]$/;
      if (!valueRegex.test(value)) {return res.json({ error: 'Invalid value' });}
      const rowValid = solver.checkRowPlacement(puzzleString, coordinate[0], coordinate[1], value);
      const colValid = solver.checkColPlacement(puzzleString, coordinate[0], coordinate[1], value);
      const regionValid = solver.checkRegionPlacement(puzzleString, coordinate[0], coordinate[1], value);
      console.log(coordinate[0], coordinate[1]);
      if (rowValid && colValid && regionValid) {
        return res.json({ valid: true });
      } else {
        let conflict = [];
        if (!rowValid) {conflict.push("row");}
        if (!colValid) {conflict.push("column");}
        if (!regionValid) {conflict.push("region");}
        return res.json({ valid: false, conflict: conflict})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      console.log(puzzleString);
      if (!puzzleString) {return res.json({ error: "Required field missing" })}
      const puzzleValid = solver.validate(puzzleString);
      if (puzzleValid) { return res.json({ error: puzzleValid })};
      const result = solver.solve(puzzleString);
      /*const pattern = /\./;
      if (pattern.test(result)) {
        res.json({error: "Puzzle cannot be solved"});
      } else {
        res.json({ solution: result });
      }*/
      console.log(result);
      res.json(result);
    });
};
