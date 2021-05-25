score = 0
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
var user_token
var game_id
var outputData
var abc = "abcdefghjklmn"
var my_color = "black"
var color_move = "black"
var can_atacovat
tips = {}
user_data = ""
const startY = $(canvas).offset().top
const startX = $(canvas).offset().left
size = document.querySelector('.cont__cont').offsetWidth
const offset = size * 0.095
const r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
const step = (size - 2 * offset) / 12.5
canvas.width = size
canvas.height = size

function can_move(x, y) {
    $.post( "/check_cell/", {
         canvas_data: JSON.stringify({
            map: board.board,
            x: y,
            y: x,
            color: my_color
         })}, function(err, req, resp){
            can_atacovat = $.parseJSON(resp.responseText).answer
    });
}

function heat_map() {
    console.log("GET HEAT MAP")
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_heatmap",
                                      params: ""})
    }, function(err, req, resp){
        tmp_map = $.parseJSON(resp.responseText)
        var tmp = new TempMap(tmp_map)
    });
}

function login_user() {
    console.log("LOGIN USER")
    $.get("/getLoginData", function(data) {
        user_data = $.parseJSON(data)
        console.log(user_data)
        var img = document.querySelector('.player1_img')
        img.src = user_data.img_profile
        var nickname = document.querySelector('.player1_nik')
        nickname.textContent = user_data.nickname
        user_token = user_data.token
        game_id = user_data.game_code
    })
}


function auth_client() {
    console.log("AUTH PLAYER")
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
    console.log("MOVE " + coord.toString().toLowerCase())
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

var button_help = document.getElementById('help');
button_help.onclick = function help() {
    console.log("USE OUR TIPS")
     outputData = []
     for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 13; j++) {
            outputData.push(board.board[j][i]);
        }
     }
    $.post( "/check_matrix/", {
        canvas_data: JSON.stringify(outputData)
    }, function(err, req, resp) {
        tips = $.parseJSON(resp.responseText)
        var dragon_info = document.getElementById('dragon_info');
        if (tips.enemy.length > 0 || tips.you.length > 0 || tips.stairs.length > 0) {
            var text = ""
            if (tips.enemy.length > 0) {
                if (text != " ") {text += "\n"}
                text += "Твои камни под угрозой, обрати внимание на клетки -> "
                for (var i = 0; i < tips.enemy.length; ++i) {text += abc[tips.enemy[i][0]] + (tips.enemy[i][1]).toString()}
            }
            if (tips.you.length > 0) {
                if (text != " ") {text += "\n"}
                text += "Ты можешь захватить вражеские камни, обрати внимание на клетки -> "
                for (var i = 0; i < tips.you.length; ++i) {text += abc[tips.you[i][0]] + (tips.you[i][1]).toString()}
            }
            if (tips.stairs.length > 0) {
                if (text != " ") {text += "\n"}
                text += "Ты попал в ситуацию 'лестница', не стоит ходить на клетки -> "
                for (var i = 0; i < tips.stairs.length; ++i) {text += abc[tips.stairs[i][0]] + (tips.stairs[i][1]).toString()}
            }
        } else {
            var text = "В данный момент тебе подскзка не нужна"
        }
        if (text != "") {
            dragon_info.textContent = text
        } else {
        }
    });
}

var button_pass = document.getElementById('pass');
button_pass.onclick = function send_pass() {
    console.log("PASS")
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

var button_resign = document.getElementById('resign');
button_resign.onclick = function send_resign() {
    console.log("RESIGN")
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

let client = new WebSocket("ws://172.104.137.176:41239");
console.log("connect with server")

client.onopen = function(e) {
  client.send(JSON.stringify([5, 'go/game']))
  console.log("follow on the topic")
  setTimeout(auth_client, 3000);
};

client.onmessage = function(event) {
  data = $.parseJSON(event.data)
  console.log("GET DATA")
  console.log(data)
  try {
      if (data.payload.type == 'currentMap' || data.payload.type == "newTurn") {
            if (data.payload.type == 'currentMap') {
                my_color = (data.payload.player=="b"?"black":"white")
                board.my_color = (data.payload.player=="b"?"black":"white")
                color_move = data.payload.turn
                var img = document.querySelector('.player2_img')
                img.src = data.payload.opponent.avatar
                var nickname = document.querySelector('.player2_nik')
                nickname.textContent = data.payload.opponent.nickname
            }
            if (data.payload.turn == 'black') {
                var info = document.getElementById('info').textContent = "Ход чёрного";
                color_move = "black"
            } else {
                var info = document.getElementById('info').textContent = "Ход белого";
                color_move = "white"
            }
          c.clearRect(0, 0, canvas.width, canvas.height);
          board.board = data.payload.currentMap
          board.update()
      } else if (data.payload.type == "endGame") {
            var info = document.getElementById('info').textContent = "Игра завершениа";
      }
  }
  catch {console.log("ERROR ON READ MESSAGE")}
};

client.onclose = function(e) {
  console.log("CONNECTION LOST", e)
};

client.onerror = function(error) {
  console.log("CONNECTION ERROR", error)
};


document.addEventListener("DOMContentLoaded", login_user);

class TempMap {
    constructor(map) {
        this.map = map
        for (var i = 13; i > -1; i--) {
            for (var j = 0; j < 13; j++) {
                var cell = new TempCell(offset + i * step, offset + j * step, this.map[i][j])
                cell.draw()
            }
        }
    }
}

var button_map = document.getElementById('temp_map');
button_map.onclick = function(e) {
    score -= 3
    console.log("LOAD TEMP_MAP")
    c.clearRect(0, 0, canvas.width, canvas.height);
    heat_map()
    board.update()
    var dragon_info = document.getElementById('dragon_info');
    dragon_info.textContent = "Удачной игры, юный последователь дракона. У тебя использовано очков: " + score + '.'
}

class Board {
    constructor (color) {
        this.my_color = color
        this.my_num = (color=="black"?-1:1)
        this.board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        this.checkedMap = []
        for(var i=0; i<13; i++) {
            this.checkedMap[i] = [];
            for(var j=0; j<13; j++) {
                this.checkedMap[i][j] = 0;
            }
        }
    }

    set_color(color) {
        this.my_color = color
        this.my_num = (color=="black"?-1:1)
    }

    add(x, y) {
        this.board[x][y] = my_num
        c.clearRect(0, 0, canvas.width, canvas.height);
        this.update()
    }

    update() {
        for (let i = 12; i > -1; i--) {
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
    }
}

class TempCell {
    constructor (x, y, temp) {
        this.x = x
        this.y = y
        this.temp = temp
    }

    draw () {
        c.beginPath()
        c.arc(this.x, this.y, 1.7 * r * this.temp, 0, Math.PI * 2, false)
        c.fillStyle = "rgba(255, 0, 0, 0.5)"
        c.fill()
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
    }
}


var board = new Board("black")
board.update()

function set_cell() {
    if (can_atacovat) {
        move_color = (my_color=="white"?"black":"white")
        board.add(x, y)
        const selection = true;
        outputData = []
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                outputData.push(board.board[j][i]);
            }
        }
        client.send(JSON.stringify([
            7,// 7 - статус: отправка сообщения
            "go/game", // в какой топик отправляется сообщение
            {
                command: "move", // команда на отправку хода
                token: user_data.token,  // токен игрока
                place: (abc[x] + (y + 1).toString()).toString().toLowerCase(),  // место куда сделать ход, формат: d13
                game_id: game_id // номер игры
            }
        ]));
    } else {
        console.log("CANT MAKE THIS MOVE")
    }
}

addEventListener('click', (event) => {
    x = event.clientX - offset + r - startX
    y = event.clientY - offset + r - startY
    x = Math.floor(x/step)
    y = Math.floor(y/step)
    if (my_color == color_move) {
        if ((x > -1) && (x < 13) && (y > -1) && (y < 13)) {
            if (board.board[x][y] == 0) {
                board.board[x][y] = -1
                can_atacovat = false
                can_move(x, y)
                setTimeout(amm, 750)
            }
        }
    }
});
