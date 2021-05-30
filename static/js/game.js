// данные юзера
var user_token
var game_id
var user_data
// константы
const ABC = "abcdefghjklmn"
// игровая логика
var have_enemy = false
var map_loaded = false
var game_started = false
var color_move = "black"
var can_atacovat
var my_lose_date = 0
var opponent_lose_date = 0
var seconds_left = 0
var last_move = [-2, -2]
var text_1 = ""
var text_2 = ""
var text_3 = ""
var text_4 = ""
get_tip_text()

// фишки для отрисовки
var temp_map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
var can_eat = []
var you_eat = []
var where_stairs = []
var can_eat_cells = []
var you_eat_cells = []
var where_stairs_cells = []
// допсказки
var tips = {}
// количество баллов потраченых на подсказки
var score = 0
// количество использованых подсказок
var countTips = 0
// даные canvas для отрисовки
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
size = document.querySelector('.cont__cont').offsetWidth
var startY = $(canvas).offset().top
var startX = $(canvas).offset().left
var offset = size * 0.095
var r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
var step = (size - 2 * offset) / 12.5
canvas.width = size
canvas.height = size
// буквы
var abc = "abcdefghjklmn"

// количество ходов
var count_moves = 0

// Количество камней
var count_white = 0
var count_black = 0
var delta_white = 0
var delta_black = 0

// спрайты
var img_red = new Image()
img_red.src = '/static/img/red.png'
var img_green = new Image()
img_green.src = '/static/img/green.png'
var img_orange = new Image()
img_orange.src = '/static/img/orange.png'

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
        draw()
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

function clear_list() {
    can_eat = []
    you_eat = []
    where_stairs = []
    can_eat_cells = []
    you_eat_cells = []
    where_stairs_cells = []
}

function clear_info() {
    clear_list()
    temp_map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

function draw() {
    console.log("DRAW")
    c.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < can_eat_cells.length; i++) {
        for (var j = 0; j < can_eat_cells[i].length; j++) {
            new SquareCell(offset + can_eat_cells[i][j][0] * step - step * 0.5, offset + can_eat_cells[i][j][1] * step - step * 0.5, "rgba(0, 255, 0, 0.5)").draw()
        }
    }
    for (var i = 0; i < you_eat_cells.length; i++) {
        for (var j = 0; j < you_eat_cells[i].length; j++) {
            if (j != you_eat_cells[i].length - 1 || you_eat_cells[i].length == 1) {
                new SquareCell(offset + you_eat_cells[i][j][0] * step - step * 0.5, offset + you_eat_cells[i][j][1] * step - step * 0.5, "rgba(255, 0, 0, 0.5)").draw()
            }
        }
    }
    for (var i = 0; i < where_stairs_cells.length; i++) {
        for (var j = 0; j < where_stairs_cells[i].length; j++) {
            if (j != where_stairs_cells[i].length - 1 || where_stairs_cells.length == 1) {
                new SquareCell(offset + where_stairs_cells[i][j][0] * step - step * 0.5, offset + where_stairs_cells[i][j][1] * step - step * 0.5, "rgba(255, 255, 0, 0.5)").draw()
            }
        }
    }
    // тепловая карта
    draw_temp(temp_map)
    // карта
    board.update()
    // кастомные подсказки
    for (var i = 0; i < can_eat.length; i++) {
        new CustomCell(offset + can_eat[i][0] * step, offset + can_eat[i][1] * step, "rgba(0, 255, 0, 0.5)").draw()
    }
    for (var i = 0; i < you_eat.length; i++) {
        new CustomCell(offset + you_eat[i][0] * step, offset + you_eat[i][1] * step, "rgba(255, 0, 0, 0.5)").draw()
    }
    for (var i = 0; i < where_stairs.length; i++) {
        new CustomCell(offset + where_stairs[i][0] * step, offset + where_stairs[i][1] * step, "rgba(255, 255, 0, 0.5)").draw()
    }
}

// немного классов и функций которые не надо редактировать
function convert_pos(pos) {
    pos = pos.toLowerCase()
    return [abc.indexOf(pos[0]), Number(pos.substring(1))]
}

class CustomCell {
    constructor (x, y, color) {
        this.color = color
        this.x = x
        this.y = y
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, r * 1.2, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class SquareCell {
    constructor (x, y, color) {
        this.color = color
        this.x = x
        this.y = y
    }

    draw() {
        c.beginPath()
        c.rect(this.x, this.y, step, step)
        c.fillStyle = this.color
        c.fill()
    }
}

class PngCell {
    constructor (x, y, image) {
        this.image = image
        this.x = x
        this.y = y
    }

    draw() {
        c.drawImage(this.image, this.x, this.y, step, step)
    }
}

class Cell {
    constructor (x, y, player){
        this.x = x
        this.y = y
        if (player == -1) {
            this.color = 'white'
        } else if (player == 1) {
            this.color = 'black'
        } else {
            this.color = player
        }
    }

    draw() {
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

function toString(x, y) {
    return ABC[x] + (13 - y).toString()
}

var board = new Board("black")
draw()

addEventListener('click', (event) => {
    // на какую клавишу ткнули
    x = Math.floor((event.clientX - offset + r - startX)/step)
    y = Math.floor((event.clientY - offset + r - startY)/step)
    console.log(board.my_color + "X" + color_move)
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

function get_count_moves() {
    console.log("START PARSE COUNT MOVES")
    $.post( "/get_count_moves/", {
         canvas_data: JSON.stringify({
            game_code: game_id
         })}, function(err, req, resp) {
            count_moves = $.parseJSON(resp.responseText).count
    });
}

function get_who_win() {
    console.log("GET WHO WIN")
    $.post( "/get_who_win/", {
         canvas_data: JSON.stringify({
            game_code: game_id
         })}, function(err, req, resp) {
            count_moves = $.parseJSON(resp.responseText).result
    });
}

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
        clear_info()
        color_move = (board.my_color=="white"?"black":"white")
        updateInfo("")
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
        get_count_moves()
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

function updateInfo(data) {
    if (data != "") {
        console.log("LOAD TURN: " + data.payload.turn)
        color_move = data.payload.turn
        console.log(color_move + " " + board.my_color)
        if (data.payload.type != "userConnected") {
            if (board.my_color == "black") {
                my_lose_date = data.payload.turnBlackEndedAt
                opponent_lose_date = data.payload.turnWhiteEndedAt
            } else {
                my_lose_date = data.payload.turnWhiteEndedAt
                opponent_lose_date = data.payload.turnBlackEndedAt
            }
            updateTimer()
        }
    } else {
        console.log("SET COLOR MOVE: " + color_move)
    }
    if (color_move == board.my_color) {
        var info = document.getElementById('info').textContent = "Ваш Ход";
    } else {
        var info = document.getElementById('info').textContent = "Ход оппонента";
    }
}

// события клиента
client.onmessage = function(event) {
    data = $.parseJSON(event.data)
    console.log("GET DATA")
    console.log(data)
    try {
        if (data.payload.type == "newTurn") {
            console.log(convert_pos(data.payload.move))
            last_move = convert_pos(data.payload.move)
        }
        if (data.payload.type == "currentMap" || data.payload.type == "userConnected" || data.payload.type == "newTurn" ) {
            console.log("update")
            updateInfo(data)
            console.log("end of update")
        }
        if (data.payload.type == 'currentMap' || data.payload.type == "newTurn") {
            if (data.payload.type == 'currentMap') {
                map_loaded = true
                board.set_color(data.payload.player=="b"?"black":"white")
                console.log(board.my_color + "ADSDASDASD" + data.payload.player)
                if (data.payload.opponent.avatar != "") {
                    have_enemy = true
                    game_started = true
                }
                // задаём аватарку и ник апоненту
                var img = document.querySelector('.player2_img')
                img.src = data.payload.opponent.avatar
                var nickname = document.querySelector('.player2_nik')
                nickname.textContent = data.payload.opponent.nickname
            }
            count_white = 0
            count_black = 0
            for (var y = 0; y < 13; y++) {
                for (var x = 0; x < 13; x++) {
                    if (data.payload.currentMap[y][x] == -1) {
                        count_white++
                    } else if (data.payload.currentMap[y][x] == 1) {
                        count_black++
                    }
                    board.board[12 - x][y] = data.payload.currentMap[y][x]
                }
            }
            count_moves++
            delta_black = Math.floor(count_moves / 2) - count_black
            delta_white = Math.floor(count_moves / 2) - count_white
            console.log(count_moves + " " + count_white + " " + count_black + " " + delta_white + " " + delta_black)
            draw()
        } else if (data.payload.type == "endGame") {
            var info = document.getElementById('header').textContent = "Игра завершена. Победил " + data.payload.winnerPlayer.nickname + "."
            game_started = false
        } else if (data.payload.type == "userConnected" && !have_enemy && map_loaded) {
            have_enemy = true
            game_started = true
            // задаём аватарку и ник апоненту
            var img = document.querySelector('.player2_img')
            img.src = data.payload.player.avatar
            var nickname = document.querySelector('.player2_nik')
            nickname.textContent = data.payload.player.nickname
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
    countTips++;
    var dragon_info = document.getElementById('dragon_info');
    dragon_info.textContent = "Удачной игры, юный последователь дракона. У тебя использовано очков: " + score + '.'
}

function get_tip_text() {
    var ans
    $.post( "/get_tip_text/", {
         canvas_data: JSON.stringify({params: ""})
    }, function(err, req, resp){
        ans = $.parseJSON(resp.responseText)
        set_tip_text(ans)
    });
}

function set_tip_text(ans) {
    text_1 = ans.a
    text_2 = ans.b
    text_3 = ans.c
    text_4 = ans.d
}

// изменение размера
document.addEventListener("DOMContentLoaded", function(event)
{
    window.onresize = function() {
        resize_info();
    };
});
function resize_info()
{
    console.log("RESIZE")
    size = document.querySelector('.cont__cont').offsetWidth
    startY = $(canvas).offset().top
    startX = $(canvas).offset().left
    offset = size * 0.095
    r = size * (1 - 2 * 0.09) * (1/(13 * 2.2))
    step = (size - 2 * offset) / 12.5
    canvas.width = size
    canvas.height = size
    draw()
}

// кнопки

// тепловая карта
var button_map = document.getElementById('temp_map');
button_map.onclick = function(e) {
    console.log("LOAD TEMP_MAP")
    heat_map()
    update_score(3)
}
function heat_map() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_heatmap",
                                      params: ""})
    }, function(err, req, resp){
        var data = $.parseJSON(resp.responseText)
        for (var y = 0; y < 13; y++) {
            for (var x = 0; x < 13; x++) {
                temp_map[y][12 - x] = data[y][x]
            }
        }
        draw()
    });
}
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
button_best_move.onclick = function() {
    console.log("GET BEST MOVE")
    get_best_move()
    update_score(3)
}
function get_best_move() {
    clear_list()
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        ans = $.parseJSON(resp.responseText)
        can_eat = [ans]
        console.log(ans)
        draw()
    });
}

// лучший ход противника
var button_best_move_enemy = document.getElementById('get_best_move_enemy');
button_best_move_enemy.onclick = function() {
    console.log("GET BEST MOVE ENEMY")
    get_best_move_enemy()
    update_score(3)
}
function get_best_move_enemy() {
    clear_list()
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move_enemy",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        ans = $.parseJSON(resp.responseText)
        best_enemy_x = ans[0]
        best_enemy_y = ans[1]
        you_eat = [ans]
        console.log(ans)
        draw()
    });
}

// лучшая зона для игры
var button_best_move_zone = document.getElementById('get_best_move_zone');
button_best_move_zone.onclick = function() {
    console.log("GET BEST ZONE FOR PLAY")
    get_best_move_zone()
    update_score(1)
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

// кто побеждает
var button_superiority = document.getElementById('get_superiority');
button_superiority.onclick = function() {
    console.log("WHO WIN")
    get_superiority()
    update_score(1)
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

// наша подсказка
var button_help = document.getElementById('help');
button_help.onclick = function help() {
    countTips++;
    clear_list()
    console.log("USE OUR TIPS")
    $.post( "/check_matrix/", {
        canvas_data: JSON.stringify({field: board.board,
                                      color: board.my_color})
        }, function(err, req, resp) {
        tips = $.parseJSON(resp.responseText)
        console.log(tips)
        var dragon_info = document.getElementById('dragon_info');
        if (tips.enemy.length > 0 || tips.you.length > 0 || tips.stairs.length > 0) {
            var text = ""
            you_eat = tips.enemy[0]
            you_eat_cells = tips.enemy[1]
            can_eat = tips.you[0]
            can_eat_cells = tips.you[1]
            where_stairs = tips.stairs[0]
            where_stairs_cells = tips.stairs[1]
            console.log(tips)
            if (you_eat.length > 0) {
                if (text != "") {text += "\n"}
                text += text_1
            }
            if (can_eat.length > 0) {
                if (text != "") {text += "\n"}
                text += text_2
            }
            if (where_stairs.length > 0) {
                if (text != "") {text += "\n"}
                text += text_3
            }
        } else {
            you_eat = []
            can_eat = []
            where_stairs = []
            you_eat_cells = []
            can_eat_cells = []
            where_stairs_cells = []
            var text = text_4
        }
        draw()
        if (text != "") {
            dragon_info.textContent = text
        }
    });
}

// наша вторая подсказка
var button_help = document.getElementById('help2');
button_help.onclick = function help() {
    countTips++;
    clear_list()
    console.log("USE OUR TIPS")
    $.post( "/scan_matrix/", {
        canvas_data: JSON.stringify({field: board.board,
                                      color: board.my_color})
        }, function(err, req, resp) {
        tips = $.parseJSON(resp.responseText)
        console.log(tips)
        var dragon_info = document.getElementById('dragon_info');
        if (tips.weak.length > 0 || tips.middle.length > 0 || tips.strong.length > 0) {
            var text = ""
            you_eat_cells = [tips.weak]
            can_eat_cells = [tips.strong]
            where_stairs_cells = [tips.middle]
            console.log(tips)
            text = text_5
        } else {
            var text = text_4
        }
        draw()
        if (text != "") {
            dragon_info.textContent = text
        }
    });
}

// наша третья подсказка
var button_help = document.getElementById('help3');
button_help.onclick = function help() {
    countTips++;
    clear_list()
    console.log("USE OUR TIPS")
    o_color = "white"
    if (board.my_color == "white") {o_color = "black"}
    $.post( "/scan_matrix/", {
        canvas_data: JSON.stringify({field: board.board,
                                      color: o_color})
        }, function(err, req, resp) {
        tips = $.parseJSON(resp.responseText)
        console.log(tips)
        var dragon_info = document.getElementById('dragon_info');
        if (tips.weak.length > 0 || tips.middle.length > 0 || tips.strong.length > 0) {
            var text = ""
            you_eat_cells = [tips.weak]
            can_eat_cells = [tips.strong]
            where_stairs_cells = [tips.middle]
            text = text_5
        } else {
            var text = text_4
        }
        draw()
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

// время до пройгррыша
var timer_my = document.getElementById("my_timer"); // получить элемент тега
var timer_opponent = document.getElementById("opponent_timer"); // получить элемент тега

getCountdown();

setInterval(function () { getCountdown(); }, 1000);

function updateTimer() {
    var current_date = new Date().getTime();
    seconds_left = (my_lose_date - current_date) / 1000;
    seconds_left = seconds_left % 86400;
    seconds_left = seconds_left % 3600;
    minutes = pad( parseInt( seconds_left / 60) );
    seconds = pad( parseInt( seconds_left % 60 ) );
    // строка обратного отсчета  + значение тега
    timer_my.innerHTML = "<span>" + minutes + "</span>:<span>" + seconds + "</span>";
    seconds_left = (opponent_lose_date - current_date) / 1000;
    seconds_left = seconds_left % 86400;
    seconds_left = seconds_left % 3600;
    minutes = pad( parseInt( seconds_left / 60) );
    seconds = pad( parseInt( seconds_left % 60 ) );
    // строка обратного отсчета  + значение тега
    timer_opponent.innerHTML = "<span>" + minutes + "</span>:<span>" + seconds + "</span>";
}

function getCountdown(){
    if (game_started) {
        var current_date = new Date().getTime();
        if (color_move == board.my_color) {
            seconds_left = (my_lose_date - current_date) / 1000;
            seconds_left = seconds_left % 86400;
            seconds_left = seconds_left % 3600;
            minutes = pad( parseInt( seconds_left / 60) );
            seconds = pad( parseInt( seconds_left % 60 ) );
            // строка обратного отсчета  + значение тега
            timer_my.innerHTML = "<span>" + minutes + "</span>:<span>" + seconds + "</span>";
        } else if (have_enemy) {
            seconds_left = (opponent_lose_date - current_date) / 1000;
            seconds_left = seconds_left % 86400;
            seconds_left = seconds_left % 3600;
            minutes = pad( parseInt( seconds_left / 60) );
            seconds = pad( parseInt( seconds_left % 60 ) );
            // строка обратного отсчета  + значение тега
            timer_opponent.innerHTML = "<span>" + minutes + "</span>:<span>" + seconds + "</span>";
        }
    }
}

function pad(n) {
    return (n < 10 ? '0' : '') + n;
}