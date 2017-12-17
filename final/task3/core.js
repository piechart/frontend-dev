// Constants

var DEFAULT_MODE = 1;
var TIME_MODE = 2;

var PLAYER1 = 1;
var PLAYER2 = 2;

var LEFT_TO_RIGHT = 0;
var RIGHT_TO_LEFT = 1;

var PLAYER1_CHAR = 'x';
var PLAYER2_CHAR = 'o';
var EMPTY_CHAR = '.';
var CHAR_WORDS = {};
CHAR_WORDS[PLAYER1_CHAR] = 'крестики';
CHAR_WORDS[PLAYER2_CHAR] = 'нолики';

var GAME_TIMEOUT = 20; // seconds

var BOARD_BLOCK_ID = 'boardBlock';
var BOARD_ID = 'gameBoard';
var STATUS_LABEL_ID = 'status';
var START_AGAIN_BUTTON_ID = 'startAgain';
var TIME_LABEL_ID = 'time'

// Game variables

var gameMode = null; // input. 1 - usual mode, 2 - points per time
var boardSize = null; // input
var board = null; // cell: . - empty, o - 0, x - X

var currentPlayer = 2; // switches between 1 and 2
var currentChar = null; // player 1: x, player 2: o
var gameFinished = false;
var currentTime = 0;

var p1_points = 0;
var p2_points = 0;

var tickTimerId = null;

var winnerValue = null;
var victoryRows = [];
var victoryColumns = [];
var victoryDiagonals = [];
var shouldAddPoints = false;

////////////////////////////////

window.onload = function() {
  beginGame();
};

////////////////////////////////

function setInitialValues() {
  currentPlayer = PLAYER2;
  gameMode = null;
  boardSize = null;
  board = null;
  nextStep(); // to set player 1 as a beginner
  setStartAgainButtonVisibility(false);
  gameFinished = false;
  p1_points = 0;
  p2_points = 0;
  currentTime = GAME_TIMEOUT;
  setTimeLabelVisibility(false);
  clearInterval(tickTimerId);
  winnerValue = null;
  victoryRows = [];
  victoryColumns = [];
  victoryDiagonals = [];
}

function beginGame() {
  setInitialValues();

  // gameMode = TIME_MODE;
  do {
    gameMode = prompt("Выберите режим игры: 1 - до первой линии, 2 - на очки (на время)", 1);
  } while (gameMode == null || gameMode == '');
  gameMode = parseInt(gameMode);
  if ([DEFAULT_MODE, TIME_MODE].indexOf(gameMode) == -1) {
    gameMode = DEFAULT_MODE
  }
  // boardSize = 3;
  do {
    boardSize = prompt("Введите ширину доски в клетках", 3);
  } while (boardSize == null || boardSize == '');
  boardSize = parseInt(boardSize);
  if (boardSize % 2 == 0) {
    boardSize += 1;
  }
  board = generateBoard();
  drawBoard();
  updateStatus();
  if (gameMode == TIME_MODE) {
    handleTimeModeSetup();
  }
}

function handleTimeModeSetup() {
  setTimeLabelVisibility(true);
  tickTimerId = setInterval(function() {
    document.getElementById(TIME_LABEL_ID).innerHTML = '00:' + (currentTime < 10 ? '0' : '') + currentTime;
    currentTime -= 1;
    if (currentTime == -1) {
      finishGame();
    }
  }, 1000);
}

function generateBoard() {
  var board = [];
  for (var i = 0; i < boardSize; i++) {
    var row = [];
    for (var j = 0; j < boardSize; j++) {
      row[j] = EMPTY_CHAR;
    }
    board[i] = row;
  }
  return board
}

function cellClicked(row, column) {
  // put char if allowed
  if (board[row][column] == EMPTY_CHAR && !gameFinished) {

    board[row][column] = currentChar;
    drawBoard();

    if (isVictory() == true) {
      handleVictory();
    } else {
      handleNoVictory();
    }
  }
}

// Game logic

function handleVictory() {
  if (gameMode == DEFAULT_MODE) {
    updateStatus('Победил игрок #' + currentPlayer + ' (' + CHAR_WORDS[currentChar] + ')');
    setStartAgainButtonVisibility(true);
    gameFinished = true;
  } else {
    if (shouldAddPoints == true) {
      if (currentPlayer == PLAYER1) {
        p1_points += boardSize;
      } else {
        p2_points += boardSize;
      }
    }
    updateStatus();
    handleNoVictory();
  }
}

function handleNoVictory() {
  if (isGameFinished()) {
    finishGame()
  } else {
    nextStep();
  }
}

function finishGame() {
  var status = 'Игра завершена. ';
  if (gameMode == TIME_MODE) {
    if (p1_points == p2_points) {
      status += 'Ничья';
    } else if (p1_points > p2_points) {
      status += 'Победил игрок ' + PLAYER1 + ' (' + CHAR_WORDS[PLAYER1_CHAR] + ')';
    } else {
      status += 'Победил игрок ' + PLAYER2 + ' (' + CHAR_WORDS[PLAYER2_CHAR] + ')';
    }
    status += ': ' + p1_points + ' очков vs. ' + p2_points + ' очков';
  }
  updateStatus(status);
  setStartAgainButtonVisibility(true);
  gameFinished = true;
  if (gameMode == TIME_MODE) {
    setTimeLabelVisibility(false);
    clearInterval(tickTimerId);
  }
}

function nextStep() {
  currentPlayer = (currentPlayer == PLAYER2) ? PLAYER1 : PLAYER2;
  currentChar = (currentPlayer == PLAYER2) ? PLAYER2_CHAR : PLAYER1_CHAR;
  winnerValue = Array(boardSize).fill(currentChar);
  updateStatus();
}

function isVictory() {
  var result = false;

  var diagonals = [LEFT_TO_RIGHT, RIGHT_TO_LEFT];
  for (var i = 0; i < diagonals.length; i++) {
    if (equal(getDiagonal(i), winnerValue)) {
      shouldAddPoints = victoryDiagonals.indexOf(i) == -1;
      if (shouldAddPoints) {
        victoryDiagonals.push(i);
      }
      result = true
    }
  }
  for (var i = 0; i < boardSize; i++) {
    if (equal(getRow(i), winnerValue)) {
      console.log(i, victoryRows, victoryRows.indexOf(i));
      shouldAddPoints = victoryRows.indexOf(i) == -1;
      if (shouldAddPoints) {
        victoryRows.push(i);
      }
      result = true;
    }
    if (equal(getColumn(i), winnerValue)) {
      shouldAddPoints = victoryColumns.indexOf(i) == -1;
      if (shouldAddPoints) {
        victoryColumns.push(i);
      }
      result = true;
    }
  }
  return result;
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
  if (i == LEFT_TO_RIGHT) {
    for (var j = 0; j < boardSize; j++) {
      result.push(board[j][j]);
    }
  } else {
    var k = 0;
    for (var j = boardSize - 1; j >= 0; j--) {
      result.push(board[k][j]); k++;
    }
  }
  return result;
}

function isGameFinished() {
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      if (board[i][j] == EMPTY_CHAR) {
        return false;
      }
    }
  }
  return true;
}

// UI

function drawBoard() {
  var table = '<table id="' + BOARD_ID + '" style="border-collapse: collapse;">';
  for (var i = 0; i < boardSize; i++) {
    table += '<tr>';
    for (var j = 0; j < boardSize; j++) {
      table += '<td style="td" onclick="cellClicked(' + i + ', ' + j + ')">' + board[i][j] + '</td>'
    }
    table += '</tr>';
  }
  table += '</table>';
  document.getElementById(BOARD_BLOCK_ID).innerHTML = table;
}

function updateStatus(status = '') {
  if (status == '') {
    status = 'Очередь игрока #' + currentPlayer + ' (' + (currentChar == PLAYER2_CHAR ? CHAR_WORDS[PLAYER2_CHAR] : CHAR_WORDS[PLAYER1_CHAR]) + ')';
    if (gameMode == TIME_MODE) {
      status += '. Очки игрока 1: ' + p1_points + ', очки игрока 2: ' + p2_points;
    }
  }
  document.getElementById(STATUS_LABEL_ID).innerHTML = status
}

function setStartAgainButtonVisibility(visible=false) {
  var display = (visible == true) ? 'block' : 'none';
  document.getElementById(START_AGAIN_BUTTON_ID).style.display = display;
}

function setTimeLabelVisibility(visible=false) {
  var display = (visible == true) ? 'block' : 'none';
  document.getElementById(TIME_LABEL_ID).style.display = display;
}

// Helpers

function equal(array1, array2) {
  return JSON.stringify(array1) === JSON.stringify(array2)
}
