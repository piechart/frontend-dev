var gameMode = null; // input
var boardSize = null; // input
var board = null; // . - Unknown state, o - 0, x - X
var gameTime = 15; // seconds

var boardBlockId = 'boardBlock';
var boardId = 'gameBoard';

var statusLabelId = 'status';

var currentPlayer = 2; // switchs between 1 and 2

window.onload = function() {
  gameMode = 1;//prompt("Выберите режим игры: 1 - до первой линии, 2 - на очки (на время)", 1);
  boardSize = 3;//prompt("Введите ширину доски в клетках", 3);
  board = generateBoard();
  drawBoard();
  updateStatus();
};

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
  nextStep();
}

function nextStep() {
  currentPlayer = (currentPlayer == 2 ? 1 : 2);
  updateStatus();
}

function updateStatus() {
  document.getElementById(statusLabelId).innerHTML = 'Очередь игрока #' + currentPlayer;
}
