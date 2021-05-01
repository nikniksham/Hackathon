console.log("Hello world")
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

size = document.querySelector('.cont__cont').offsetWidth
const offset = size * 0.095
const r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
const step = (size - 2 * offset) / 12.5
canvas.width = size
canvas.height = size

class Board {
    constructor () {
        this.board = [[1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1],
                      [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 1, 0, -1, 1, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
                      [1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1]]
        this.clearBoard = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        this.checkedMap = this.clearBoard
    }

    add(x, y) {
        this.board[x][y] = -1
        this.update()
    }

    update() {
        console.log('make update')
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                if (this.board[i][j] == -1) {
                    var cell = new Cell(offset + i * step, offset + j * step, -1)
                    cell.draw()
                } else if (this.board[i][j] == 1) {
                    var cell = new Cell(offset + i * step, offset + j * step, 1)
                    cell.draw()
                }
            }
        }
        console.log('end of update')
    }

    checkCell(x, y) {
        // проверяем дыхания
        if (this.board[x + 1][y] == 0 || this.board[x - 1][y] == 0 || this.board[x][y + 1] == 0 || this.board[x][y - 1] == 0) {
            return true
        }

        // проверяем союзные соседние клетки
        if (this.board[x + 1][y] == -1) {
            if (this.checkedMap[x + 1][y] == 0) {
                this.checked(x + 1, y)
                return checkCell(x + 1, y)
            }
        }
        if (this.board[x - 1][y] == -1) {
            if (this.checkedMap[x - 1][y] == 0) {
                this.checked(x - 1, y)
                return checkCell(x - 1, y)
            }
        }
        if (this.board[x][y + 1] == -1) {
            if (this.checkedMap[x][y + 1] == 0) {
                this.checked(x, y + 1)
                return checkCell(x, y + 1)
            }
        }
        if (this.board[x][y - 1] == -1) {
            if (this.checkedMap[x][y - 1] == 0) {
                this.checked(x, y - 1)
                return checkCell(x, y - 1)
            }
        }
        return false
    }

    check(x, y) {
        if (this.board[x][y] == 2) {
            return true
        }
        if (this.board[x][y] == 0) {
            this.checkedMap = this.clearBoard
            this.checked(x, y)
            return this.checkCell(x, y)
        }
        return false
    }

    checked(x, y) {
        this.checkedMap[x][y] = 1
    }
}

class Cell {
    constructor (x, y, player){
        this.x = x
        this.y = y
        if (player == -1) {
            this.color = 'white'
        } else {
            this.color = 'black'
        }
    }

    draw () {
        c.beginPath()
        c.arc(this.x, this.y, r, 0, Math.PI * 2, false)
        c.fillStyle = 'black'
        c.fill()
        c.beginPath()
        c.arc(this.x, this.y, r*0.95, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        console.log("fill: " + this.color)
    }
}


const board = new Board()
board.update()

var socket = io.connect('http://127.0.0.1:8000');

socket.on('connect', () => {
    addEventListener('click', (event) => {
        x = event.clientX - offset + r
        y = event.clientY - offset + r
        x = Math.floor(x/step)
        y = Math.floor(y/step)
        console.log('tab At: ' + x + ':' + y)
        if (board.check(x, y)) {
            console.log('add')
            board.add(x, y)
            const selection = true;
            socket.emit('i speak', {'selection': selection});
        } else {
            console.log('cant')
        }
    });
});
/*
socket.on('я живой', data => {
    const li = document.createElement('li');
    li.innerHTML = `Vote recorded: ${data.selection}`;
    document.querySelector('#votes').append(li);
});

for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 13; j++) {
        if ()


        if ((i * j) % 12 == 0) {
            var cell = new Cell(offset + i * step, offset + j * step, 1)
            cell.draw()
        } else if ((i + j) % 4 == 4) {
            var cell = new Cell(offset + i * step, offset + j * step, -1)
            cell.draw()
        } else {
            var cell = new Cell(offset + i * step, offset + j * step, -1)
            cell.draw()
        }
    }
}
return false
*/
