console.log("Hello world")
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

size = document.querySelector('.cont__cont').offsetWidth
const offset = size * 0.095
const r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
const step = (size - 2 * offset) / 12.5
canvas.width = size
canvas.height = size

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


for (let i = 0; i < 13; i++) { // выведет 0, затем 1, затем 2
    for (let j = 0; j < 13; j++) { // выведет 0, затем 1, затем 2
        if ((i + j) % 2 == 0) {
            var cell = new Cell(offset + i * step, offset + j * step, 1)
            cell.draw()
        } else {
            var cell = new Cell(offset + i * step, offset + j * step, -1)
            cell.draw()
        }
    }
}