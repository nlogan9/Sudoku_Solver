class SudokuSolver {

  validate(puzzleString) {
    const pattern = /[^0-9\.]/;
    let result = '';
    if (pattern.test(puzzleString)) {result = "Invalid characters in puzzle";}
    if (puzzleString.length !== 81) {result = "Expected puzzle to be 81 characters long"}
    return result;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let valid = true;
    const index = this.convertLocationToIndex(row, column);
    const rowValues = this.getValuesInSameRow(puzzleString, index);
    if (rowValues.includes(value)) {valid = false;}
    return valid;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let valid = true;
    const index = this.convertLocationToIndex(row, column);
    const colValues = this.getValuesInSameCol(puzzleString, index);
    if (colValues.includes(value)) {valid = false;}
    return valid;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let valid = true;
    const index = this.convertLocationToIndex(row, column);
    const regionValues = this.getValuesInSameRegion(puzzleString, index);
    if (regionValues.includes(value)) {valid = false;}
    return valid;
  }

  solve(puzzleString) {
    let testString = puzzleString;
    let solved = 1;
    let result = {};
    while (solved > 0) {
      solved = 0;
      for (let i = 0; i < 81; i++) {
        if (testString[i] === '.') {
          let excluded = this.getValuesInSameRow(testString, i);
          const colExcluded = this.getValuesInSameCol(testString, i);
          const regExcluded = this.getValuesInSameRegion(testString, i);
          for (let j = 0; j < colExcluded.length; j++) {
            if (!excluded.includes(colExcluded[j])) {excluded.push(colExcluded[j]);}
          }
          for (let j = 0; j < regExcluded.length; j++) {
            if (!excluded.includes(regExcluded[j])) {excluded.push(regExcluded[j]);}
          }
          //console.log(excluded);
          if (excluded.length == 8) {
            for (let k = 1; k < 10; k++) {
              k = String(k);
              if (!excluded.includes(k)) {
                const row = this.convertIndexToLocation(i)[0];
                //console.log(row);
                const col = this.convertIndexToLocation(i)[1];
                if (this.checkRowPlacement(testString, row, col, k) && this.checkColPlacement(testString, row, col, k) && this.checkRegionPlacement(testString, row, col, k)) {
                  testString = testString.slice(0, i) + k + testString.slice(i + 1);
                  //console.log(`insert ${k} into ${row}${col}. result: ${testString}`);
                  solved++;
                }
              }
            }
          }
        }
      }
    }
    const pattern = /\./;
    if (pattern.test(testString)) {
      result = {error: "Puzzle cannot be solved"};
    } else {
      result = {solution: testString};
    }
    return result;
  }

  convertLocationToIndex(row, column) {
    const rowTranslator = {a: 0, b: 9, c: 18, d: 27, e: 36, f: 45, g: 54, h: 63, i: 72}
    const lowercaseRow = row.toLowerCase();
    const rowStartsAt = rowTranslator[lowercaseRow];
    const index = parseInt(rowStartsAt) + parseInt(column) -1;
    //console.log(index);
    return index;
  }

  convertIndexToLocation(index) {
    const rowTranslator = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i'};
    const colnum = parseInt(index / 9);
    const row = rowTranslator[colnum];
    const col = index % 9 + 1;
    const result = [row, col];
    return result;
  }

  getValuesInSameRow(puzzleString, index) {
    const rowPlacement = index % 9;
    let result = [];
    for (let i = index - rowPlacement; i < (index - rowPlacement + 9); i++) {
      if (i !== index && puzzleString[i] !== '.') {
        result.push(puzzleString[i]);
      }
    }
    return result;
  }

  getValuesInSameCol(puzzleString, index) {
    const rowPlacement = index % 9;
    let result = [];
    for (let i = rowPlacement; i < 81; i += 9) {
      if (i !== index && puzzleString[i] !== '.') {
        result.push(puzzleString[i]);
      }
    }
    return result;
  }

  getValuesInSameRegion(puzzleString, index) {
    const areaRowPlacement = (index % 9) % 3;
    const areaColPlacement = ((index - (index % 9)) / 9) % 3;
    const regionHome = (index - areaRowPlacement) - (9 * areaColPlacement);

    let result = [];
    for (let i = regionHome; i <= regionHome + 18; i += 9) {
      for (let j = i; j < i + 3; j++) {
        if (j !== index && puzzleString[j] !== '.') {
          result.push(puzzleString[j]);
        }
      }
    }
    return result;
  }



}

module.exports = SudokuSolver;

