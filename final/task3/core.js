var DEFAULT_MODE = 1;
var TIME_MODE = 2;

var PLAYER1 = 1;
var PLAYER2 = 2;

var LEFT_TO_RIGHT = 0;

var gameMode = null; // input. 1 - usual mode, 2 - points per time
var boardSize = null; // input
var board = null; // cell: . - empty, o - 0, x - X
var gameTime = 15; // seconds

var boardBlockId = 'boardBlock';
var boardId = 'gameBoard';
var statusLabelId = 'status';
var startAgainButtonId = 'startAgain';
var timeLabelId = 'time'

var currentPlayer = 2; // switches between 1 and 2
var currentChar = null; // player 1: x, player 2: o
var gameFinished = false;
var currentTime = 0;

var p1_points = 0;
var p2_points = 0;

var tickTimerId = null;

var emptyChar = '.';

var winnerValue = null;

window.onload = function() {
  beginGame();
};

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
  currentTime = gameTime;
  setTimeLabelVisibility(false);
  clearInterval(tickTimerId);
  winnerValue = null
}

function beginGame() {
  setInitialValues();

  gameMode = TIME_MODE;
  // do {
  //   gameMode = prompt("Выберите режим игры: 1 - до первой линии, 2 - на очки (на время)", 1);
  // } while (gameMode == null || gameMode == '');
  // gameMode = parseInt(gameMode);
  boardSize = 3;
  // do {
  //   boardSize = prompt("Введите ширину доски в клетках", 3);
  // } while (boardSize == null || boardSize == '');
  // boardSize = parseInt(boardSize);
  // if (boardSize % 2 == 0) {
  //   boardSize += 1;
  // }
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
    document.getElementById(timeLabelId).innerHTML = '00:' + (currentTime < 10 ? '0' : '') + currentTime;
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
      row[j] = emptyChar;
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
  // put char if allowed
  if (board[row][column] == emptyChar && !gameFinished) {

    board[row][column] = currentChar;
    drawBoard();

    if (isVictory() == true) {
      handleVictory();
    } else {
      handleNoVictory();
    }
  }
}

function handleVictory() {
  if (gameMode == DEFAULT_MODE) {
    updateStatus('Победил игрок #' + currentPlayer + '!');
    setStartAgainButtonVisibility(true);
    gameFinished = true;
  } else {
    if (currentPlayer == PLAYER1) {
      p1_points += boardSize;
    } else {
      p2_points += boardSize;
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
      status += 'Победителя нет';
    } else if (p1_points > p2_points) {
      status += 'Победил игрок ' + PLAYER1 + ' (крестики)';
    } else {
      status += 'Победил игрок ' + PLAYER2 + ' (нолики)';
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
  currentChar = (currentPlayer == PLAYER2) ? 'o' : 'x';
  winnerValue = Array(boardSize).fill(currentChar);
  updateStatus();
}

function updateStatus(status = '') {
  if (status == '') {
    status = 'Очередь игрока #' + currentPlayer + ' (' + (currentChar == 'o' ? 'нолики' : 'крестики') + ')';
    if (gameMode == TIME_MODE) {
      status += '. Очки игрока 1: ' + p1_points + ', очки игрока 2: ' + p2_points;
    }
  }
  document.getElementById(statusLabelId).innerHTML = status
}

function isVictory() {
  if (equal(getDiagonal(LEFT_TO_RIGHT), winnerValue) || equal(getDiagonal(boardSize - 1), winnerValue)) {
    return true;
  }
  for (var i = 0; i < boardSize; i++) {
    if (equal(getRow(i), winnerValue) || equal(getColumn(i), winnerValue)) {
      return true;
    }
  }
  return false;
}

function equal(array1, array2) {
  return JSON.stringify(array1) === JSON.stringify(array2)
}

function getRow(i) {
  var result = [];
  for (var j = 0; j < boardSize; j++) {
    result.push(board[i][j]);
  }
  // if (gameMode == TIME_MODE && equal(result, winnerValue)) {
  //   for (var j = 0; j < boardSize; j++) {
  //     board[i][j] = '*';
  //   }
  //   drawBoard();
  // }
  return result;
}

function getColumn(i) {
  var result = [];
  for (var j = 0; j < boardSize; j++) {
    result.push(board[j][i]);
  }
  // if (gameMode == TIME_MODE && equal(result, winnerValue)) {
  //   for (var j = 0; j < boardSize; j++) {
  //     board[j][i] = '*';
  //   }
  //   drawBoard();
  // }
  return result;
}

function getDiagonal(i) {
  var result = [];
  if (i == LEFT_TO_RIGHT) {
    for (var j = 0; j < boardSize; j++) {
      result.push(board[j][j]);
    }
    // if (gameMode == TIME_MODE && equal(result, winnerValue)) {
    //   for (var j = 0; j < boardSize; j++) {
    //     board[j][i] = '*';
    //   }
    //   drawBoard();
    // }
  } else {
    var k = 0;
    for (var j = boardSize - 1; j >= 0; j--) {
      result.push(board[k][j]); k++;
    }
    // if (gameMode == TIME_MODE && equal(result, winnerValue)) {
    //   k = 0;
    //   for (var j = boardSize - 1; j >= 0; j--) {
    //     board[k][j] = '*'; k++;
    //   }
    //   drawBoard();
    // }
  }
  return result;
}

function isGameFinished() {
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      if (board[i][j] == emptyChar) {
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

function setTimeLabelVisibility(visible=false) {
  var display = (visible == true) ? 'block' : 'none';
  document.getElementById(timeLabelId).style.display = display;
}
