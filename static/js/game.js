/* console.log("start")

console.log("import websocket")
export const client = new WebSocket('ws://172.104.137.176:41239');

console.log("connect with server")
client.send(JSON.stringify([5, 'go/game']))
console.log("follow on the topic")
*/

console.log("Hello world")
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

user_data = ""
size = document.querySelector('.cont__cont').offsetWidth
const offset = size * 0.095
const r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
const step = (size - 2 * offset) / 12.5
canvas.width = size
canvas.height = size

function login_user() {
    console.log("1")
    $.get("/getlogindata", function(data) {
        user_data = $.parseJSON(data)
        console.log(user_data)
    })
}


function auth_client() {
    client.send(JSON.stringify([
    7,
    "go/game",
    {
        command: "auth",
        token: user_data.token,
        game_id: user_data.game_code
    }
    ]));
}


function move_to(coord) {
    client.send(JSON.stringify([
          7,
          "go/game",
          {
            command: "move",
            token: user_data.token,
            place: coord.toString().toLowerCase(),
            game_id: game_id
          }
          ]));
}

function send_pass() {
    client.send(JSON.stringify([
          7,
          "go/game",
          {
            command: "pass",
            token: user_data.token,
            game_id: user_data.game_code
          }
          ]));
}

function send_resign() {
    client.send(JSON.stringify([
          7,
          "go/game",
          {
            command: "resign",
            token: user_data.token,
            game_id: user_data.game_code
          }
          ]));
}

document.addEventListener("DOMContentLoaded", login_user);

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
        this.checkedMap = []
        for(var i=0; i<13; i++) {
            this.checkedMap[i] = [];
            for(var j=0; j<13; j++) {
                this.checkedMap[i][j] = 0;
            }
        }
    }

    add(x, y) {
        this.board[x][y] = -1
        this.update()
    }

    update() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        console.log('make update')
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                // console.log(this.board[i][j])
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
        console.log("AT:"+x+":"+y)
        console.log(this.board[x][y - 1])
        var myColor = -1
        // проверяем дыхания
        if ((x < 12) && (this.board[x + 1][y] == 0)) {
            return true
        }
        if ((x > 0) && (this.board[x - 1][y] == 0)) {
            return true
        }
        if ((y < 12) && (this.board[x][y + 1] == 0)) {
            return true
        }
        if ((y > 0) && (this.board[x][y - 1] == 0)) {
            return true
        }



        if ((x < 12) && (this.board[x + 1][y] == myColor) && (this.checkedMap[x + 1][y] == 0)) {
            this.checked(x + 1, y)
            if (this.checkCell(x + 1, y)) {
                return true
            }
        }
        if ((x > 0)  && (this.board[x - 1][y] == myColor) && (this.checkedMap[x - 1][y] == 0)) {
            this.checked(x - 1, y)
            if (this.checkCell(x - 1, y)) {
                return true
            }
        }
        if ((y < 12) && (this.board[x][y + 1] == myColor) && (this.checkedMap[x][y + 1] == 0)) {
            this.checked(x, y + 1)
            if (this.checkCell(x, y + 1)) {
                return true
            }
        }
        if ((y > 0)  && (this.board[x][y - 1] == myColor) && (this.checkedMap[x][y - 1] == 0)) {
            this.checked(x, y - 1)
            if (this.checkCell(x, y - 1)) {
                return true
            }
        }
        return false
    }

    check(x, y) {
        if (this.board[x][y] == 2) {
            return true
        }
        if (this.board[x][y] == -1) {
            console.log(this.clearBoard)
            this.checkedMap = []
            for(var i=0; i<13; i++) {
                this.checkedMap[i] = [];
                for(var j=0; j<13; j++) {
                    this.checkedMap[i][j] = 0;
                }
            }
            this.checked(x, y)
            return this.checkCell(x, y)
        }
        return false
    }

    checked(x, y) {
        this.checkedMap[x][y] = 1
    }

    loadBoard(board) {
        // console.log("PRINAL")
        board = board.split(';')
        var res = []
        for (var i = 0; i < 169; i++) {
            res.push(parseInt(board[i]))
        }
        // console.log("OBRABOTAL")
        // console.log("NE OTDAL")
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                this.board[j][i] = res[i * 13 + j]
            }
        }
        this.update()
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
        // console.log("fill: " + this.color)
    }
}


const board = new Board()
board.update()

addEventListener('click', (event) => {
    x = event.clientX - offset + r
    y = event.clientY - offset + r
    x = Math.floor(x/step)
    y = Math.floor(y/step)
    console.log('tab At: ' + x + ':' + y)
    board.board[x][y] = -1
    if (board.check(x, y)) {
        board.add(x, y)
        console.log('add')
        const selection = true;
        // $.get( "/getmethod/<javascript_data>" );
         var outputData = []
         for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                outputData.push(board.board[j][i]);
            }
         }
         $.post( "/a/", {
            canvas_data: JSON.stringify(outputData)
         }, function(err, req, resp){
            board.loadBoard(resp.responseText)
            console.log('Loaded');
         });

        $.get("/getpythondata", function(data) {
            console.log($.parseJSON(data))
        })
    } else {
        board.board[x][y] = 0
        console.log('cant')
    }
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

if ((x + 1 < 13) && (this.board[x + 1][y] == 0) || (x - 1 > -1) && (this.board[x - 1][y] == 0) || (y + 1 < 13) && (this.board[x][y + 1] == 0) || (y - 1 > -1) && (this.board[x][y - 1] == 0)) {
    return true
}

// проверяем союзные соседние клетки
if (x + 1 < 13 && this.board[x + 1][y] == -1) {
    if (this.checkedMap[x + 1][y] == 0) {
        this.checked(x + 1, y)
        if (this.checkCell(x + 1, y)) {
            return true
        }
    }
}
if (x - 1 > -1 && this.board[x - 1][y] == -1) {
    if (this.checkedMap[x - 1][y] == 0) {
        this.checked(x - 1, y)
        if (this.checkCell(x - 1, y)) {
            return true
        }
    }
}
if (y + 1 < 13 && this.board[x][y + 1] == -1) {
    if (this.checkedMap[x][y + 1] == 0) {
        this.checked(x, y + 1)
        if (this.checkCell(x, y + 1)) {
            return true
        }
    }
}
if (y - 1 > -1 && this.board[x][y - 1] == -1) {
    if (this.checkedMap[x][y - 1] == 0) {
        this.checked(x, y - 1)
        if (this.checkCell(x, y - 1)) {
            return true
        }
    }
}
return false
*/
