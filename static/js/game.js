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
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
                      [1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1]]
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

addEventListener('click', (event) => {
    x = event.clientX - offset + r
    y = event.clientY - offset + r
    x = x/step
    y = y/step
    board.add(Math.floor(x), Math.floor(y))
    console.log('tab At: ' + x + ':' + y)
})

const board = new Board()
board.update()

/*
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
*/
