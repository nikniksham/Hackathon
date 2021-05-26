// данные юзера
var user_token
var game_id
var user_data
// константы
const ABC = "abcdefghjklmn"
// игровая логика
var color_move = "black"
var can_atacovat
// допсказки
var tips = {}
// количество баллов потраченых на подсказки
var score = 0
// количество использованых подсказок
var countTips = 0
// даные canvas для отрисовки
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const startY = $(canvas).offset().top
const startX = $(canvas).offset().left
size = document.querySelector('.cont__cont').offsetWidth
const offset = size * 0.095
const r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
const step = (size - 2 * offset) / 12.5
canvas.width = size
canvas.height = size
// буквы
var abc = "abcdefghjklmn"

// доска
class Board {
    constructor (color) {
        this.my_color = color
        this.my_num = (this.my_color=="black"?-1:1)
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
    }

    set_color(color) {
        this.my_color = color
        this.my_num = (this.my_color=="black"?-1:1)
    }

    add(x, y) {
        this.board[y][x] = -this.my_num
        c.clearRect(0, 0, canvas.width, canvas.height);
        this.update()
    }

    update() {
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                if (this.board[i][j] == -1) {
                    var cell = new Cell(offset + j * step, offset + i * step, -1)
                    cell.draw()
                } else if (this.board[i][j] == 1) {
                    var cell = new Cell(offset + j * step, offset + i * step, 1)
                    cell.draw()
                }
            }
        }
    }
}

// немного классов и функций которые не надо редактировать
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
function toString(x, y) {
    return ABC[x] + (13 - y).toString()
}

var board = new Board("black")
board.update()

addEventListener('click', (event) => {
    // на какую клавишу ткнули
    x = Math.floor((event.clientX - offset + r - startX)/step)
    y = Math.floor((event.clientY - offset + r - startY)/step)
    if (board.my_color == color_move) {
        if ((x > -1) && (x < 13) && (y > -1) && (y < 13)) {
            if (board.board[y][x] == 0) {
                console.log("TAB AT:"+toString(x, y))
                board.board[y][x] = -1
                can_atacovat = false
                can_move(x, y)
                setTimeout(set_cell, 850)
            }
        }
    }
})

function can_move(x, y) {
    $.post( "/check_cell/", {
         canvas_data: JSON.stringify({
            map: board.board,
            x: x,
            y: y,
            color: board.my_color
         })}, function(err, req, resp) {
            can_atacovat = $.parseJSON(resp.responseText).answer
    });
}

function set_cell() {
    if (can_atacovat) {
        move_color = (board.my_color=="white"?"black":"white")
        board.add(x, y)
        console.log(toString(x, y))
        client.send(JSON.stringify([
            7,// 7 - статус: отправка сообщения
            "go/game", // в какой топик отправляется сообщение
            {
                command: "move", // команда на отправку хода
                token: user_data.token,  // токен игрока
                place: toString(x, y),  // место куда сделать ход, формат: d13
                game_id: game_id // номер игры
            }
        ]));
    } else {
        console.log("ILLEGAL MOVE")
        board.board[y][x] = 0
    }
}

// авторизация по очереди
document.addEventListener("DOMContentLoaded", login_user);

function login_user() {
    console.log("LOGIN USER")
    $.get("/getLoginData", function(data) {
        user_data = $.parseJSON(data)
        // устонавливаем ник и аватарку
        var img = document.querySelector('.player1_img')
        img.src = user_data.img_profile
        var nickname = document.querySelector('.player1_nik')
        nickname.textContent = user_data.nickname
        // данные юзера и игры
        user_token = user_data.token
        game_id = user_data.game_code
    })
}

let client = new WebSocket("ws://172.104.137.176:41239");

client.onopen = function(e) {
  client.send(JSON.stringify([5, 'go/game']))
  setTimeout(auth_client, 3000);
};

function auth_client() {
    console.log("AUTH PLAYER")
    console.log(user_data)
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

// события клиента
client.onmessage = function(event) {
    data = $.parseJSON(event.data)
    console.log("GET DATA")
    console.log(data)
    try {
        if (data.payload.type == 'currentMap' || data.payload.type == "newTurn") {
            if (data.payload.type == 'currentMap') {
                board.set_color(data.payload.player=="b"?"black":"white")
                console.log(board.my_color)
                color_move = data.payload.turn
                // задаём аватарку и ник апоненту
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
            for (var y = 0; y < 13; y++) {
                for (var x = 0; x < 13; x++) {
                    board.board[12 - x][y] = data.payload.currentMap[y][x]
                }
            }
            c.clearRect(0, 0, canvas.width, canvas.height);
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

// сколько потратил очков
function update_score(delta) {
    score += delta
    var dragon_info = document.getElementById('dragon_info');
    dragon_info.textContent = "Удачной игры, юный последователь дракона. У тебя использовано очков: " + score + '.'
}

// кнопки

// тепловая карта
var button_map = document.getElementById('temp_map');
function draw_temp(map) {
    for (var i = 0; i < 13; i++) {
        for (var j = 12; j > -1; j--) {
            var cell = new TempCell(offset + i * step, offset + j * step, map[i][j])
            cell.draw()
        }
    }
}

// лучший ход
var button_best_move = document.getElementById('get_best_move');
function get_best_move_b() {
    console.log("Получение лучшего хода")
}

// лучший ход противника
var button_best_move_enemy = document.getElementById('get_best_move_enemy');
function get_best_move_enemy_b() {
    console.log("Получение лучшего хода противника")
}

// лучшая зона для игры
var button_best_move_zone = document.getElementById('get_best_move_zone');
function get_best_move_zone_b() {
    console.log("Лучшая зона для игры")
}

// кто побеждает
var button_superiority = document.getElementById('get_superiority');
function get_superiority_b() {
    console.log("Кто побеждает")
}
class TempCell {
    constructor (x, y, temp) {
        this.x = x
        this.y = y
        this.temp = temp
    }

    draw () {
        c.beginPath()
        c.arc(this.x, this.y, 1.5 * r * Math.cbrt(this.temp), 0, Math.PI * 2, false)
        c.fillStyle = "rgba(255, 0, 0, 0.5)"
        c.fill()
    }
}

function get_best_move() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        ans = $.parseJSON(resp.responseText)
        best_x = ans[0]
        best_y = ans[1]
        console.log(ans)
    });
}

function get_best_move_enemy() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move_enemy",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        ans = $.parseJSON(resp.responseText)
        best_enemy_x = ans[0]
        best_enemy_y = ans[1]
        console.log(ans)
    });
}

function get_best_move_zone() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move_zone",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        best_move_zone = $.parseJSON(resp.responseText)
        console.log(best_move_zone)
    });
}

function get_superiority() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_superiority",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        superiority = $.parseJSON(resp.responseText)
        console.log(superiority)
    });
}

function heat_map() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_heatmap",
                                      params: ""})
    }, function(err, req, resp){
        var data = $.parseJSON(resp.responseText)
        var res = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        for (var y = 0; y < 13; y++) {
            for (var x = 0; x < 13; x++) {
                res[y][12 - x] = data[y][x]
            }
        }
        draw_temp(res)
    });
}
button_map.onclick = function(e) {
    console.log("LOAD TEMP_MAP")
    c.clearRect(0, 0, canvas.width, canvas.height);
    heat_map()
    board.update()
    update_score(3)
}

button_best_move.onclick = function() {
    console.log("GET BEST MOVE")
    get_best_move()
    update_score(3)
}

button_best_move_enemy.onclick = function() {
    console.log("GET BEST MOVE ENEMY")
    get_best_move_enemy()
    update_score(3)
}

button_best_move_zone.onclick = function() {
    console.log("GET BEST ZONE FOR PLAY")
    get_best_move_zone()
    update_score(3)
}

button_superiority.onclick = function() {
    console.log("WHO WIN")
    get_superiority()
    update_score(3)
}

// наша подсказка
var button_help = document.getElementById('help');
button_help.onclick = function help() {
     outputData = []
     console.log("USE OUR TIPS")
     for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 13; j++) {
            outputData.push(board.board[i][j]);
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
                for (var i = 0; i < tips.enemy.length; ++i) {text += abc[tips.enemy[i][0]] + (13 - tips.enemy[i][1]).toString()}
            }
            if (tips.you.length > 0) {
                if (text != " ") {text += "\n"}
                text += "Ты можешь захватить вражеские камни, обрати внимание на клетки -> "
                for (var i = 0; i < tips.you.length; ++i) {text += abc[tips.you[i][0]] + (13 - tips.you[i][1]).toString()}
            }
            if (tips.stairs.length > 0) {
                if (text != " ") {text += "\n"}
                text += "Ты попал в ситуацию 'лестница', не стоит ходить на клетки -> "
                for (var i = 0; i < tips.stairs.length; ++i) {text += abc[tips.stairs[i][0]] + (13 - tips.stairs[i][1]).toString()}
            }
        } else {
            var text = "В данный момент тебе подскзка не нужна"
        }
        if (text != "") {
            dragon_info.textContent = text
        }
    });
}

// пропуск хода
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


// сдатьсяg
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