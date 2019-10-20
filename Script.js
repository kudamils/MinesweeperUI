var boardElm = document.querySelector(".board")
var boardCheatElm = document.querySelector(".boardCheat")
var textCoord = document.querySelector(".inputCoord")
var submitCoord = document.querySelector(".submitCoord")
var boardInputElm = document.querySelector(".boardInput")
var submitBoardElm = document.querySelector(".submitBoard")
var bombInputElm = document.querySelector(".bombInput")
boardElm.style.whiteSpace = 'pre'

let board = []
let openCount = 0;
let bomb = 0;
const NEIGHBOR = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
]

submitBoardElm.addEventListener('click', init)

function init() {
  console.log ("apapun")
  var boardRaw = boardInputElm.value.split(",")
  if (isValidBoard(Number(boardRaw[0]), Number(boardRaw[1]))) {
    initBoard(Number(boardRaw[0]), Number(boardRaw[1]))
  } else {
    return
  }

  var manyBomb = Number(bombInputElm.value)

  if (isValidBomb(manyBomb)) {
    initBomb(manyBomb)
  } else {
    return
  }

  printBoard()
}

submitCoord.addEventListener('click', submitCoordAction)

function initBoard(length, width) {
  board = []
  for (let i = 0; i < length; i++) {
    board[i] = []
    for (let j = 0; j < width; j++) {
      board[i].push({
        isBomb: false,
        isOpen: false,
        showBoard: "-",
        showCheat: "-"
      })
    }
  }
}

function submitCoordAction() {
  let coordRaw = textCoord.value.split(",")
  checkTile(Number(coordRaw[0]) - 1, Number(coordRaw[1]) - 1)
  printBoard()
  if (board.length * board[0].length - openCount === bomb) {
    return gameOver(true)
  }
}

function initBomb(bombs) {
  let col = Math.floor(Math.random() * board[0].length)
  let row = Math.floor(Math.random() * board.length)
  bomb = bombs
  while (bombs > 0) {
    if (board[row][col].isBomb === false) {
      board[row][col].isBomb = true
      board[row][col].showCheat = "*"
      bombs--
    } else {
      col = Math.floor(Math.random() * board[0].length)
      row = Math.floor(Math.random() * board.length)
    }
  }
}

function isValidBoard(length, width) {
  if (length <= 0 || width <= 0) {
    return false
  }

  return true
}

function isValidBomb(bombs) {
  if (bombs > (board.length * board[0].length) - 2) {
    return false
  }

  if (bombs <= 0) {
    return false
  }

  return true
}

function checkTile(row, col) {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return
  }
  if (board[row][col].isOpen === true) {
    return
  }
  let count = 0

  if (board[row][col].isBomb === true) {
    board[row][col].isOpen = true
    return gameOver()
  }

  NEIGHBOR.forEach(elm => {
    let newRow = row + elm.row;
    let newCol = col + elm.col;
    if (newRow < board.length && newRow >= 0 && newCol < board[0].length && newCol >= 0) {
      if (board[newRow][newCol].isBomb === true) {
        count++
      }
    }
  })

  if (count !== 0) {
    board[row][col].showBoard = count
    board[row][col].isOpen = true
    board[row][col].showCheat = count
    openCount++
    return
  } else {
    board[row][col].isOpen = true
    board[row][col].showBoard = count
    board[row][col].showCheat = count
    openCount++
    NEIGHBOR.forEach(elm => {
      checkTile(row + elm.row, col + elm.col)
    })
  }
}

function gameOver(win = false) {
  if (win) {
    console.log("menang")
  } else {
    console.log("kalah")
  }

  submitCoord.disabled = true
}

function printBoard(cheat = false) {
  let stringToPrint = " ".padEnd(3, " ")
  for (let col = 0; col < board[0].length; col++) {
    stringToPrint += `${col + 1}`.padEnd(3, " ")
  }
  stringToPrint += "\n"
  for (let i = 0; i < board.length; i++) {
    stringToPrint += `${i+ 1}`.padEnd(3, " ")
    for (let j = 0; j < board[0].length; j++) {
      stringToPrint += cheat === false ? `${board[i][j].showBoard}`.padEnd(3, " ") : `${board[i][j].showCheat}`.padEnd(3, " ")
    }
    stringToPrint += "\n"
  }

   return cheat === false ? boardElm.textContent = stringToPrint : boardCheatElm.textContent = stringToPrint
}
