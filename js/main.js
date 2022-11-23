'use strict'
const FLAG = '🚩'
const EMPTY = ''
const MINE = '💣'
// const ONE = 1
// const TWO = 2
// const THREE = 3

var start = Date.now();
var gBoard
var gMineCount
var gTimer

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: gLevel.MINES,
    secsPassed: 0
}

function initGame() {
    clearInterval(gTimer)
    var elSmileyFace = document.querySelector('.smileyFace')
    elSmileyFace.innerText = '🙂'
    var elTime = document.querySelector('.timer')
    elTime.innerText = '00:00'
    gBoard = buildBoard()
    console.log('buildBoard(gBoard):', buildBoard(gBoard))
    renderBoard(gBoard)
    // setMinesNegsCount(gBoard, 1, 1)
    // gTimer = setInterval(function() {
    //     createTime(Date.now() - start);
    // }, 1000)
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }

    board[1][1].isMine = true
    board[3][1].isMine = true
    gMineCount = 2

    return board

}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.isMine) cellClass += ' mine'
            else if (currCell.isShown) cellClass += ' show'
            else if (currCell.isMarked) cellClass += ' mark'

            strHTML += `\t<td class="cell ${cellClass}" onmousedown="cellClicked(event, this, ${i}, ${j})" >\n`
            // strHTML += `\t<td class="cell ${cellClass}" onmousedown="cellMarked(MouseEvent.button, this)" onclick="cellClicked(this, ${i}, ${j})" >\n`

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML


    const noRightClick = document.querySelector('table');
    noRightClick.addEventListener("contextmenu", e => e.preventDefault());
    // var minesNegsCount = getMinesNegsCount(gBoard, 2, 1)
    // console.log('minesNegsCount:', minesNegsCount)

    var res = getMinesNegsCount(board, i, j)
    console.log('res:', res)

    var set = setMinesNegsCount(board)
    console.log('set:', set)

    // var res = setMinesNegsCount(gBoard)
    // console.log('res:', res)

    addMines()

}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

// var res = setMinesNegsCount(gBoard)
// console.log('res:', res)

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = getMinesNegsCount(board, i, j)
        }
    }
}


function getMinesNegsCount(board, rowIdx, colIdx) {
    var minesNegsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                minesNegsCount++
            }

        }
    }
    return minesNegsCount
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

function cellClicked(event, elCell, i, j) {
    console.log(event)
    const cell = gBoard[i][j]
    console.log('cell.minesAroundCount:', cell.minesAroundCount)
    // ignore none seats and booked
    // if (cell.isShown) {
    

    if (event.button === 0) {
        if (elCell === FLAG) return
        cell.isShown = true
        if (cell.isMine) {
            gameOver()
        } else if (cell.minesAroundCount > 0) {
            console.log('neighbors')
            cell === cell.minesAroundCount
            console.log('cell:', cell)
        }
    }
    if (event.button === 2) {
        gBoard.isMarked = true
        cellMarked(elCell, i, j)
        console.log('elCell:', elCell)
        elCell.innerHTML = FLAG
        gBoard.markedCount++
    }


    var elCount = document.querySelector('.minesCount')
    console.log('elCount:', elCount)
    console.log('gBoard.markedCount:', gBoard.markedCount)
    // elCount.innerHTML = gBoard.markedCount
    // else if (cell.minesAroundCount === 0) {
    //     cell.isShown = true
    //     cell === EMPTY
    //     console.log('empty')
    // }

    if (gGame.shownCount === 1) {
        gTimer = setInterval(function () {
            createTime(Date.now() - start);
        }, 1000)
    }
    console.log('Cell clicked: ', elCell, i, j)

    var res = getMinesNegsCount(gBoard, i, j)
    console.log('mineNeighbors:', res)


}

function checkGameOver() {

}

function gameOver() {
    gGame.isOn = false
    clearInterval(gTimer)
    console.log('Game Over')
    var elSmileyFace = document.querySelector('.smileyFace')
    elSmileyFace.innerText = '😭'
}

function restart() {
    initGame()
}

function cellMarked(elCell, i, j) {

    if (elCell.innerHTML === FLAG) {
        elCell.innerHTML = EMPTY
        gBoard[i][j].isMarked = false
        gGame.markedCount++
    } else {
        elCell.innerHTML = FLAG
        gBoard[i][j].isMarked = true
        gGame.markedCount--
    }
    // checkFlagsCount();
    // checkGameOver();
}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {

            }

        }
    }
    return minesNegsCount
}



function setLevel(btnlevel) {
    gLevel.SIZE = parseInt(btnlevel.classList[0])
    gLevel.MINES = parseInt(btnlevel.classList[0])
    // clearInterval(stopwch);
    initGame()
}

function randCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            emptyCells.push({ i, j })
        }
    }

    const randomIdx = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[randomIdx]

}

function addMines() {
    var randomCell = randCell(gBoard)

    // MODEL
    gBoard[randomCell.i][randomCell.j] = MINE
    gBoard.isMine = true

    // DOM
    renderCell(randomCell, MINE)
}

