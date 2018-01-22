// Constants

var DEFAULT_MODE = 1;
var TIME_MODE = 2;

var PLAYER1 = 1;
var PLAYER2 = 2;

var PLAYER1_CHAR = 'x';
var PLAYER2_CHAR = 'o';
var EMPTY_CHAR = '.';
var CHAR_WORDS = {};
CHAR_WORDS[PLAYER1_CHAR] = 'крестики';
CHAR_WORDS[PLAYER2_CHAR] = 'нолики';

var ITEMS_IN_ROW_TO_WIN = 5;
var LIMITED_ITEMS_COUNT = 0; // to be counted after boardSize is set

var GAME_TIMEOUT = 20; // seconds

var BOARD_BLOCK_ID = 'boardBlock';
var BOARD_ID = 'gameBoard';
var STATUS_LABEL_ID = 'status';
var START_AGAIN_BUTTON_ID = 'startAgain';
var TIME_LABEL_ID = 'time'

var DEBUG = false;

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
    boardSize = prompt("Введите ширину доски в клетках, <= 20", 8);
  } while (boardSize == null || boardSize == '' || boardSize < 0 || boardSize > 20);
  boardSize = parseInt(boardSize);
  if (boardSize % 2 == 0) {
    boardSize += 1;
  }

  LIMITED_ITEMS_COUNT = Math.min(boardSize, ITEMS_IN_ROW_TO_WIN);
  if (DEBUG) {
    console.log("LIMITED_ITEMS_COUNT:", LIMITED_ITEMS_COUNT);
  }
  generateWinnerValue();

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

    if (DEBUG) {
      console.log("isVictory():", isVictory());
    }
    if (isVictory(row, column) == true) {
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
    addPointsIfNeeded();
    updateStatus();
    handleNoVictory();
  }
}

function addPointsIfNeeded() {
  if (shouldAddPoints == true && gameMode == TIME_MODE) {
    if (currentPlayer == PLAYER1) {
      p1_points += LIMITED_ITEMS_COUNT;
    } else {
      p2_points += LIMITED_ITEMS_COUNT;
    }
    shouldAddPoints = false;
  }
}

function handleNoVictory() {
  if (isGameFinished()) {
    finishGame()
  } else {
    nextStep();
  }
}

function formatPoints(points) {
  var result = points + " "
  var lastDigit = points % 10
  if (lastDigit == 1) {
    result += "очко"
  } else if (lastDigit >= 2 && lastDigit < 5) {
    result += "очка"
  } else {
    result += "очков"
  }
  return result
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
    status += ': ' + formatPoints(p1_points) + ' vs. ' + formatPoints(p2_points);
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
  generateWinnerValue();
  updateStatus();
}

function generateWinnerValue() {
  winnerValue = Array(LIMITED_ITEMS_COUNT).fill(currentChar);
}

function isVictory(row, column) {
  var result = false;

  if (DEBUG) {
    console.log(">>> isVictory <<<");
  }

  // checking diagonals from cell clicked
  if (checkDiagonalsFromCell(row, column)) {
    shouldAddPoints = victoryDiagonals.indexOf([row, column]) == -1;
    if (shouldAddPoints) {
      victoryDiagonals.push([row, column]);
    }
    addPointsIfNeeded();
    result = true
  }

  // checking rows and columns from cell clicked
  if (checkRowsAndColumnsFromCell(row, column)) {
    console.log("checkRowsAndColumnsFromCell==true", row, column);
    console.log("victoryRows:", victoryRows);
    shouldAddPoints = victoryRows.indexOf([row, column]) == -1;
    console.log("shouldAddPoints:", shouldAddPoints);
    if (shouldAddPoints) {
      victoryRows.push([row, column]);
    }
    addPointsIfNeeded();
    result = true;
  }
  return result;
}

// returns true if there is winning sequenсe which directs diagonally somewhere from cell given
function checkDiagonalsFromCell(i, j) {
  var diagonals = getDiagonalsFromCell(i, j);
  for (var i = 0; i < diagonals.length; i++) {
    if (equal(diagonals[i], winnerValue)) {
      return true;
    }
  }
  return false;
}

function checkRowsAndColumnsFromCell(i, j) {
  var rowsAndColumns = getRowsAndColumnsFromCell(i, j);
  for (var i = 0; i < rowsAndColumns.length; i++) {
    if (equal(rowsAndColumns[i], winnerValue)) {
      return true;
    }
  }
  return false;
}

function getRowsAndColumnsFromCell(i, j) {
  var result = []; var part = [];
  // top direction:
  var a = i; var b = j;
  while (a >= 0) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    a--;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    if (DEBUG) {
      console.log("top")
    }
    result.push(part);
  }
  part = [];
  // right direction:
  a = i; b = j;
  while (b < boardSize) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    b++;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    if (DEBUG) {
      console.log("right")
    }
    result.push(part);
  }
  part = [];
  // bottom direction:
  a = i; b = j;
  while (a < boardSize) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    a++;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    result.push(part);
    if (DEBUG) {
      console.log("bottom");
    }
  }
  part = [];
  // left direction:
  a = i; b = j;
  while (b >= 0) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    b--;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    result.push(part);
    if (DEBUG) {
      console.log("left");
    }
  }
  if (DEBUG) {
    console.log(result);
  }
  return result;
}

// returns 4 possible diagonales from cell, two-dimensional array
function getDiagonalsFromCell(i, j) {
  var result = []; var part = [];
  // top-left direction:
  var a = i; var b = j;
  while (a >= 0 && b >= 0) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    a--; b--;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    if (DEBUG) {
      console.log("top-left")
    }
    result.push(part);
  }
  part = [];
  // top-right direction:
  a = i; b = j;
  while (a >= 0 && b < boardSize) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    a--; b++;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    if (DEBUG) {
      console.log("top-right")
    }
    result.push(part);
  }
  part = [];
  // bottom-left direction:
  a = i; b = j;
  while (a < boardSize && b >= 0) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    a++; b--;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    result.push(part);
    if (DEBUG) {
      console.log("bottom-left");
    }
  }
  part = [];
  // bottom-right direction:
  a = i; b = j;
  while (a < boardSize && b < boardSize) {
    part.push(board[a][b]);
    if (part.length == LIMITED_ITEMS_COUNT) break;
    a++; b++;
  }
  if (part.length == LIMITED_ITEMS_COUNT) {
    result.push(part);
    if (DEBUG) {
      console.log("bottom-right");
    }
  }
  if (DEBUG) {
    console.log("getDiagonalsFromCell result:", result);
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
    status = 'Очередь игрока #' + currentPlayer + ' (' + CHAR_WORDS[currentChar] + ')';
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

function arrayContainsWinnerValue(array) {
  // [1, 2, 2, 2, 2, 3, 4, 5], [2, 2, 2, 2] -> true
  // [0, 1, 2, 3, 4, 5, 6, 7]
  if (DEBUG) {
    console.log("arrayContainsWinnerValue:");
    console.log(array, winnerValue);
  }
  var result = false;
  if (array.length > winnerValue.length) {
    for (var i = 0; i < array.length - winnerValue.length; i++) {
      var subSequence = array.slice(i, i + winnerValue.length);
      if (DEBUG) {
        console.log(subSequence);
      }
      if (equal(subSequence, winnerValue)) {
        result = true;
        break;
      }
    }
  }
  if (DEBUG) {
    console.log("result", '-->', result);
  }
  return result;
}

function equal(array1, array2) {
  if (array1.length != array2.length) {
    return false
  }
  return JSON.stringify(array1) === JSON.stringify(array2)
}
