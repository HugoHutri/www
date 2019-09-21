import "../css/styles.css";

let player = 1;
const x = "x"; //"🗙";
const o = "o"; //"🞇";
let pause = false;
let winline = [];
var downloadTimer;

let grid = document.getElementById("grid");

function createGrid(grid) {
  let n = 5;
  for (let i = 0; i < n; i++) {
    let row = document.createElement("div");
    grid.appendChild(row);
    row.className = "row grid-row center-align";
    for (let j = 0; j < n; j++) {
      let col = document.createElement("div");
      col.className = "col card-panel grid-col center-align";
      row.appendChild(col);
      createCol(col);
    }
  }
}
createGrid(grid);

function createCol(col) {
  col.onclick = function() {
    move(this);
  };
}

function start_countdown() {
  var reverse_counter = 100;
  downloadTimer = setInterval(function() {
    if (pause) return;
    document.getElementById("innerbar").style.width =
      parseInt(100 - --reverse_counter, 10) + "%";
    if (reverse_counter <= 0) {
      reverse_counter = 100;
      console.log("100");
      clearInterval(downloadTimer);
      start_countdown();
      endTurn();
    }
  }, 100);
}

function reset_countdown() {
  clearInterval(downloadTimer);
  start_countdown();
}

start_countdown();

function move(tableCell) {
  if (pause === true) return;
  if (tableCell.innerHTML !== "") return;
  //expandTheGrid(tableCell);
  if (player === 2) {
    // Player O or Player 2
    tableCell.classList += " red lighten-3";
    tableCell.innerHTML = o;
  } else if (player === 1) {
    // Player X or Player 1
    tableCell.classList += " green lighten-3";
    tableCell.innerHTML = x;
  }
  //tableCell.setAttribute("class", player === 1 ? "x" : "o");
  calculateWinCondition(tableCell);
  reset_countdown();
  endTurn();
}

function endTurn() {
  if (pause) return;
  player = player === 1 ? 2 : 1;
  let turn_text = document.getElementById("turn");
  turn_text.innerHTML = "Player " + player + "'s turn";
}

/*
function expandTheGrid(tableCell) {
  let rowIndex = tableCell.parentNode.rowIndex;
  let cellIndex = tableCell.cellIndex;
  let rowSize = table.rows.length;
  let cellSize = table.rows[0].cells.length;
  var top = rowIndex;
  var bottom = rowSize - rowIndex - 1;
  var left = cellIndex;
  var right = cellSize - cellIndex - 1;
  if (top < 3) {
    // Expand top grid
    for (let i = 0; i < 3 - top; i++) {
      let row = table.insertRow(0);
      for (let j = 0; j < cellSize; j++) {
        let cell = row.insertCell();
        createCell(cell);
      }
    }
  }
  if (bottom < 3) {
    // Expand bottom grid
    for (let i = 0; i < 3 - bottom; i++) {
      let row = table.insertRow();
      for (let j = 0; j < cellSize; j++) {
        let cell = row.insertCell();
        createCell(cell);
      }
    }
  }
  if (left < 3) {
    // Expand left grid
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      for (let j = 0; j < 3 - left; j++) {
        let cell = row.insertCell(0);
        createCell(cell);
      }
    }
  }
  if (right < 3) {
    // Expand right grid
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      for (let j = 0; j < 3 - right; j++) {
        let cell = row.insertCell();
        createCell(cell);
      }
    }
  }
}
*/

/*
function createCell(cell) {
  cell.onclick = function() {
    move(this);
  };
} */

function calculateWinCondition(tableCell) {
  let cellIndex = getChildIndex(tableCell);
  let rowIndex = getChildIndex(tableCell.parentNode);
  //let cellIndex = tableCell.cellIndex;
  //let cell = table.rows[rowIndex].cells[cellIndex];
  let cell = grid.children[rowIndex].children[cellIndex];
  let mark = cell.innerHTML;
  var vertical_length = 0;
  var horizontal_length = 0;
  var diagonal1_length = 0;
  var diagonal2_length = 0;

  for (let i = -4; i <= 4; i++) {
    if (rowIndex + i < 0 || rowIndex + i >= grid.children.length) {
      continue;
    }
    let vertical = grid.children[rowIndex + i].children[cellIndex];
    if (vertical.innerHTML === mark) {
      vertical_length++;
      winline.push([rowIndex + i, cellIndex]);
      if (vertical_length === 5) {
        win();
      }
    } else {
      winline = [];
      vertical_length = 0;
    }
  }

  for (let i = -4; i <= 4; i++) {
    if (
      cellIndex + i < 0 ||
      cellIndex + i >= grid.children[0].children.length
    ) {
      continue;
    }
    let horizontal = grid.children[rowIndex].children[cellIndex + i];
    if (horizontal.innerHTML === mark) {
      horizontal_length++;
      winline.push([rowIndex, cellIndex + i]);
      if (horizontal_length === 5) {
        win();
      }
    } else {
      winline = [];
      horizontal_length = 0;
    }
  }

  for (let i = -4; i <= 4; i++) {
    if (
      cellIndex + i < 0 ||
      rowIndex + i < 0 ||
      cellIndex + i >= grid.children[0].children.length ||
      rowIndex + i >= grid.children.length
    ) {
      continue;
    }
    let diagonal1 = grid.children[rowIndex + i].children[cellIndex + i];
    if (diagonal1.innerHTML === mark) {
      diagonal1_length++;
      winline.push([rowIndex + i, cellIndex + i]);
      if (diagonal1_length === 5) {
        win();
      }
    } else {
      winline = [];
      diagonal1_length = 0;
    }
  }

  for (let i = -4; i <= 4; i++) {
    if (
      cellIndex - i < 0 ||
      rowIndex + i < 0 ||
      cellIndex - i >= grid.children[0].children.length ||
      rowIndex + i >= grid.children.length
    ) {
      continue;
    }
    let diagonal2 = grid.children[rowIndex + i].children[cellIndex - i];
    if (diagonal2.innerHTML === mark) {
      diagonal2_length++;
      winline.push([rowIndex + i, cellIndex - i]);
      if (diagonal2_length === 5) {
        win();
      }
    } else {
      winline = [];
      diagonal2_length = 0;
    }
  }
}

function getChildIndex(child) {
  var parent = child.parentNode;
  var children = parent.children;
  var i = children.length - 1;
  for (; i >= 0; i--) {
    if (child === children[i]) {
      break;
    }
  }
  return i;
}

function win() {
  pause = true;
  setTimeout(function() {
    alert("Player " + player + " won!");
  }, 50);
}

//generateTable(table);
