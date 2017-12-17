var gameMode = null; // input. 1 - usual mode, 2 - points per time
var boardSize = null; // input
var board = null; // . - Unknown state, o - 0, x - X
var gameTime = 15; // seconds

var boardBlockId = 'boardBlock';
var boardId = 'gameBoard';
var statusLabelId = 'status';
var startAgainButtonId = 'startAgain';

var currentPlayer = 2; // switchs between 1 and 2
var currentSign = null; // player 1: x, player 2: o

window.onload = function() {
  beginGame();
};

function beginGame() {
  currentPlayer = 2;
  gameMode = null;
  boardSize = null;
  board = null;
  nextStep(); // to set player 1 as a beginner
  setStartAgainButtonVisibility(false);
  //
  gameMode = 1;
  // do {
  //   gameMode = prompt("Выберите режим игры: 1 - до первой линии, 2 - на очки (на время)", 1);
  // } while (gameMode == null || gameMode == '');
  // gameMode = parseInt(gameMode);
  // if (gameMode % 2 == 0) {
  //   gameMode += 1;
  // }
  boardSize = 3;
  // do {
  //   boardSize = prompt("Введите ширину доски в клетках", 3);
  // } while (boardSize == null || boardSize == '');
  // boardSize = parseInt(boardSize);
  board = generateBoard();
  drawBoard();
  updateStatus();
}

function generateBoard() {
  var board = [];
  for (var i = 0; i < boardSize; i++) {
    var row = [];
    for (var j = 0; j < boardSize; j++) {
      row[j] = '.';
    }
    board[i] = row;
  }
  return board
}

function drawBoard() {
  var table = '<table id="' + boardId + '" style="border-collapse: collapse;">';
  for (var i = 0; i < boardSize; i++) {
    table += '<tr>';
    for (var j = 0; j < boardSize; j++) {
      table += '<td style="td" onclick="cellClicked(' + i + ', ' + j + ')">' + board[i][j] + '</td>'
    }
    table += '</tr>';
  }
  table += '</table>';
  document.getElementById(boardBlockId).innerHTML = table;
}

function cellClicked(row, column) {
  // put sign if allowed
  if (board[row][column] == '.') {
    board[row][column] = currentSign;
    drawBoard();
    if (isVictory() == false) {
      if (gameEnded()) {
        updateStatus('Игра окончена');
        setStartAgainButtonVisibility(true);
      } else {
        nextStep();
      }
    } else {
      console.log("Victory");
      // print something and start from the beginning
    }
  }
}

function nextStep() {
  currentPlayer = (currentPlayer == 2) ? 1 : 2;
  currentSign = (currentPlayer == 2) ? 'o' : 'x';
  updateStatus();
}

function updateStatus(status = '') {
  if (status == '') {
    status = 'Очередь игрока #' + currentPlayer + ' (' + (currentSign == 'o' ? 'нолики' : 'крестики') + ')';
  }
  document.getElementById(statusLabelId).innerHTML = status
}

function isVictory() {
  console.log("Checking Victory...")
  [
    [0,0,.],
    [0,.,1],
    [0,1,1]
  ]
}

function getRow(i) {
  var result = [];
  for (var j = 0; j < boardSize; j++) {
    result.push(board[i][j]);
  }
  return result;
}

function getColumn(i) {
  var result = [];
  for (var j = 0; j < boardSize; j++) {
    result.push(board[j][i]);
  }
  return result;
}

function getDiagonal(i) {
  var result = [];
  if (i == 0) {
    for (var j = 0; j < boardSize; j++) {
      result.push(board[j][j]);
    }
  } else {
    for (var j = i; j > 0; j--) {
      result.push(board[j][j]);
    }
  }
}

function gameEnded() {
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      if (board[i][j] == ".") {
        return false;
      }
    }
  }
  return true;
}

function setStartAgainButtonVisibility(visible=false) {
  var display = (visible == true) ? 'block' : 'none';
  document.getElementById(startAgainButtonId).style.display = display;
}
