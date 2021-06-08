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
var last_move = [-100, -1000]
var text_dragon_info = ""

var dragon_info = document.getElementById('dragon_info');
var dragon_info_2 = document.getElementById('dragon_info_2');

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

// подсказки
var tip_one = false
var tip_two = false

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

function clear_info() {
    clear_list()
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < can_eat_cells.length; i++) {
        for (var j = 0; j < can_eat_cells[i].length; j++) {
            new SquareCell(offset + can_eat_cells[i][j][0] * step - step * 0.5, offset + can_eat_cells[i][j][1] * step - step * 0.5, "rgba(0, 255, 0, 0.5)").draw()
        }
    }
    for (var i = 0; i < you_eat_cells.length; i++) {
        for (var j = 0; j < you_eat_cells[i].length; j++) {
            new SquareCell(offset + you_eat_cells[i][j][0] * step - step * 0.5, offset + you_eat_cells[i][j][1] * step - step * 0.5, "rgba(255, 0, 0, 0.5)").draw()
        }
    }
    for (var i = 0; i < where_stairs_cells.length; i++) {
        for (var j = 0; j < where_stairs_cells[i].length; j++) {
            new SquareCell(offset + where_stairs_cells[i][j][0] * step - step * 0.5, offset + where_stairs_cells[i][j][1] * step - step * 0.5, "rgba(255, 255, 0, 0.5)").draw()
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
    if (color_move == "black") {
        c.beginPath()
        c.arc(last_move[0] * step + offset, last_move[1] * step + offset, r*0.5, 0, Math.PI * 2, false)
        c.fillStyle = 'black'
        c.fill()
        c.beginPath()
        c.arc(last_move[0] * step + offset, last_move[1] * step + offset, r*0.3, 0, Math.PI * 2, false)
        c.fillStyle = 'white'
        c.fill()
    } else {
        c.beginPath()
        c.arc(last_move[0] * step + offset, last_move[1] * step + offset, r*0.5, 0, Math.PI * 2, false)
        c.fillStyle = 'white'
        c.fill()
        c.beginPath()
        c.arc(last_move[0] * step + offset, last_move[1] * step + offset, r*0.3, 0, Math.PI * 2, false)
        c.fillStyle = 'black'
        c.fill()
    }
}

// немного классов и функций которые не надо редактировать
function convert_pos(pos) {
    pos = pos.toLowerCase()
    if (pos == "pass") {
        return [-100, -1000]
    }
     return [abc.indexOf(pos[0]), 13 - Number(pos.substring(1))]
}

function open_window(num) {
    if (num == 1) {
        document.getElementById("block-1").className = "visible-block";
    } else {
        document.getElementById("block-1").className = "hidden-block";
    }
    if (num == 2) {
        document.getElementById("block-2").className = "visible-block";
    } else {
        document.getElementById("block-2").className = "hidden-block";
    }
    if (num == 3) {
        document.getElementById("block-3").className = "visible-block";
    } else {
        document.getElementById("block-3").className = "hidden-block";
    }
    if (num == 4) {
        document.getElementById("block-4").className = "visible-block";
    } else {
        document.getElementById("block-4").className = "hidden-block";
    }
}

function set_active_tips(num) {
    button_best_move_enemy.className = "game_button fw_game_button"
    button_best_move.className = "game_button fw_game_button"
    button_help3.className = "game_button fw_game_button"
    button_help2.className = "game_button fw_game_button"
    button_help.className = "game_button fw_game_button"
    button_map.className = "game_button fw_game_button"
    if (num == 1) {
        button_best_move_enemy.className = "game_button good_tip fw_game_button"
        button_map.className = "game_button good_tip fw_game_button"
    }
    if (num == 2) {
        button_best_move_enemy.className = "game_button good_tip fw_game_button"
        button_best_move.className = "game_button good_tip fw_game_button"
        help2.className = "game_button good_tip fw_game_button"
        help3.className = "game_button good_tip fw_game_button"
    }
    if (num == 3) {
        button_best_move.className = "game_button good_tip fw_game_button"
        button_help.className = "game_button good_tip fw_game_button"
        button_help2.className = "game_button good_tip fw_game_button"
        button_help3.className = "game_button good_tip fw_game_button"
    }
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
                if (!(tip_one || tip_two)) {
                    board.board[y][x] = board.my_color=="white"?-1:1
                }
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
        if (tip_one) {
            can_eat.push([x, y])
            if (can_eat.length > 2) {
                console.log(can_eat)
                tip_one = false
                show_best_move()
            }
        } else if (tip_two) {
            if (can_eat.length < 1) {
                can_eat.push([x, y])
            } else {
                you_eat.push([x, y])
            }
            console.log(you_eat)
            if (you_eat.length > 2) {
                show_best_move_enemy()
                tip_two = false
            }
        } else {
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
        }
    } else {
        console.log("ILLEGAL MOVE")
        board.board[y][x] = 0
    }
    draw()
}

// авторизация по очереди
document.addEventListener("DOMContentLoaded", login_user);

function login_user() {
    console.log("LOGIN USER")
    $.get("/getLoginData", function(data) {
        user_data = $.parseJSON(data)
        // устонавливаем ник и аватарку
        var img = document.querySelectorAll('.player1_img'), i
        for (i in img) {
            img[i].src = user_data.img_profile
        }
        var nickname = document.querySelectorAll('.player1_nik'), i
        for (i in nickname) {
            nickname[i].textContent = user_data.nickname
        }
        // данные юзера и игры
        user_token = user_data.token
        game_id = user_data.game_code
        get_count_moves()
    })
}

let client = new WebSocket("ws://185.22.62.66:41239");

client.onopen = function(e) {
  client.send(JSON.stringify([5, 'go/game']))
  setTimeout(auth_client, 7000);
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
        console.log("TYPE: " + (data.payload.type == "newTurn"))
        if (data.payload.type == "newTurn") {
            // fpnt
            console.log("SET TEXT")
            dragon_info.innerHTML  = text_dragon_info.you_s + (board.my_color == "black"?delta_white:delta_black)+"<br/>"
            dragon_info.innerHTML += text_dragon_info.enemy_s + (board.my_color == "black"?delta_black:delta_white)+"<br/>"
            dragon_info.innerHTML += text_dragon_info.spend_points + score+"<br/>"
            dragon_info.innerHTML += text_dragon_info.move + count_moves
            console.log("END TEXT")
        }
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
        var info = document.getElementById('info').textContent = text_dragon_info.you_turn;
    } else {
        var info = document.getElementById('info').textContent = text_dragon_info.enemy_turn;
    }
}

// события клиента
client.onmessage = function(event) {
    data = $.parseJSON(event.data)
    console.log(data)
    try {
        console.log("DED INS" + data.payload.type == "userConnected" && !have_enemy && map_loaded)
        if (data.payload.type == "newTurn") {
            // console.log(convert_pos(data.payload.place) + " " + data.payload.place)
            if (data.payload.moveType != "pass") {
                last_move = convert_pos(data.payload.place)
            } else {
                last_move = [-100, -1000]
            }
            console.log("SAJDFALFHAB<LDFAK")
        }
        if (data.payload.type == 'currentMap' || data.payload.type == "newTurn") {
            if (data.payload.type == 'currentMap') {
                map_loaded = true
                board.set_color(data.payload.player=="b"?"black":"white")
                if (data.payload.opponent.avatar != "") {
                    have_enemy = true
                    game_started = true
                }
                // задаём аватарку и ник апоненту
                var img = document.querySelectorAll('.player2_img'), i
                for (i in img) {
                    img[i].src = data.payload.opponent.avatar
                }
                var nickname = document.querySelectorAll('.player2_nik'), i
                for (i in nickname) {
                    nickname[i].textContent = data.payload.opponent.nickname
                }
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
            var n = 0
            if (count_moves < 26) {
                n = 1
            } else if (count_moves > 25 && count_moves < 60) {
                n = 2
            } else {
                n = 3
            }
            set_active_tips(n)
            // fpnt
            delta_black = Math.floor(count_moves / 2) - count_black
            delta_white = Math.floor(count_moves / 2) - count_white
            if (count_moves % 2 == 0) {
                delta_white--
            }
            console.log(count_moves + " " + count_white + " " + count_black + " " + delta_white + " " + delta_black)
            draw()
        } else if (data.payload.type == "endGame") {
            if (data.payload.winnerPlayer.nickname == user_data.nickname) {
                open_window(3)
                document.getElementById("win-text").innerHTML += "<br/>" + text_dragon_info.score + score + ".<br/>" + text_dragon_info.count_tips + countTips +"."
            } else {
                open_window(4)
                document.getElementById("lose-text").innerHTML += "<br/>" + text_dragon_info.score + score + ".<br/>" + text_dragon_info.count_tips + countTips +"."
            }
            var info = document.getElementById('header').textContent = text_dragon_info.end_game + data.payload.winnerPlayer.nickname + "."
            game_started = false
        } else if (data.payload.type == "userConnected" && !have_enemy && map_loaded) {
            have_enemy = true
            game_started = true
            // задаём аватарку и ник апоненту
            var img = document.querySelectorAll('.player2_img'), i
            for (i in img) {
                img[i].src = data.payload.player.avatar
            }
            var nickname = document.querySelectorAll('.player2_nik')
            for (i in nickname) {
                nickname[i].textContent = data.payload.player.nickname
            }
        }
        if (data.payload.type == "currentMap" || data.payload.type == "userConnected" || data.payload.type == "newTurn" ) {
            updateInfo(data)
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
    text_dragon_info = ans
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

// Подсказки
var button_best_move = document.getElementById('tip');
button_best_move.onclick = function() {
    console.log("TIPS")
    open_window(2)
}

// Закрыть подсказки
var button_best_move = document.getElementById('back');
button_best_move.onclick = function() {
    console.log("back")
    open_window(1)
}

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
    clear_list()
    console.log("GET BEST MOVE")
    get_best_move()
    update_score(3)
}
function get_best_move() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move",
                                      params: ""})
    }, function(err, req, resp){
        ans = convert_pos($.parseJSON(resp.responseText))
        can_eat = [ans]
        console.log(ans)
        draw()
    });
}

// лучший ход противника
var button_best_move_enemy = document.getElementById('get_best_move_enemy');
button_best_move_enemy.onclick = function() {
    clear_list()
    console.log("GET BEST MOVE ENEMY")
    get_best_move_enemy()
    update_score(3)
}
function get_best_move_enemy() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move_enemy",
                                      params: ""})
    }, function(err, req, resp){
        ans = convert_pos($.parseJSON(resp.responseText))
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
    clear_list()
    console.log("GET BEST ZONE FOR PLAY")
    get_best_move_zone()
    update_score(1)
}
function get_best_move_zone() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_best_move_zone",
                                      params: ""})
    }, function(err, req, resp) {
        best_move_zone = Number($.parseJSON(resp.responseText))
        sx = 0
        sy = 0
        if (best_move_zone > 2) {
            sy = 6
        } if (best_move_zone % 2 == 1) {
            sx = 6
        }
        for (var i = sy; i < sy + 7; i++) {
            for (var j = sx; j < sx + 7; j++) {
                can_eat_cells.push([[j, i]])
            }
        }
        draw()
        console.log(can_eat_cells)
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
    }, function(err, req, resp) {
        superiority = $.parseJSON(resp.responseText)
        //asd
        dragon_info_2.textContent = (superiority.winner=="b"?text_dragon_info.black_win:text_dragon_info.white_win)+superiority.score
        console.log(superiority)
    });
}

// лучшие n ходов на будущее
var button_future_moves = document.getElementById('get_future_moves');
button_future_moves.onclick = function() {
    console.log("GET FUTURE MOVES")
    get_future_moves(3)
    clear_list()
    update_score(2)
}
function get_future_moves(n) {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_future_moves",
                                      count: n})
    }, function(err, req, resp){
        future_moves = $.parseJSON(resp.responseText)
        for (var i = 0; i < future_moves.length; i++) {
            can_eat.push(convert_pos(future_moves[i]))
        }
        console.log(future_moves)
        draw()
        console.log(future_moves)
    });
}

// лучшие ходы из заданных
var button_show_best_move = document.getElementById('show_best_move');
button_show_best_move.onclick = function() {
    clear_list()
    dragon_info_2.textContent = text_dragon_info.tip3
    console.log("SHOW BEST MOVES")
    tip_one = true
}
function show_best_move() {
    update_score(2)
    var may_moves = []
    for (var i = 0; i < can_eat.length; ++i) {
        may_moves.push(toString(can_eat[i][0], can_eat[i][1]))
    }
    console.log(may_moves)
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "show_best_move",
                                      moves: may_moves})
    }, function(err, req, resp){
        best_move = $.parseJSON(resp.responseText)
        console.log(best_move)
        clear_list()
        can_eat = [convert_pos(best_move)]
        draw()
    });
}

// лучший ход противника из заданных, с учётом собственного
var button_superiority = document.getElementById('show_best_move_enemy');
button_superiority.onclick = function() {
    clear_list()
    dragon_info_2.textContent = text_dragon_info.tip4
    console.log("SHOW BEST MOVE ENEMY")
    tip_two = true
}
function show_best_move_enemy() {
    update_score(2)
    m = []
    my_m = []
    for (var i = 0; i < can_eat.length; i++) {
        my_m.push(toString(can_eat[i][0], can_eat[i][1]))
    }
    for (var i = 0; i < you_eat.length; i++) {
        m.push(toString(you_eat[i][0], you_eat[i][1]))
    }
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "show_best_move_enemy",
                                      moves: m,
                                      move: my_m})
    }, function(err, req, resp){
        clear_list()
        best_move_enemy = $.parseJSON(resp.responseText)
        you_eat = [convert_pos(best_move_enemy)]
        draw()
    });
}

// наша первая подсказка
var button_help = document.getElementById('help');
button_help.onclick = function help() {
    update_score(2)
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
        if (tips.enemy[0].length > 0 || tips.you[0].length > 0 || tips.stairs[0].length > 0) {
            you_eat = tips.enemy[0]
            you_eat_cells = tips.enemy[1]
            can_eat = tips.you[0]
            can_eat_cells = tips.you[1]
            where_stairs = tips.stairs[0]
            where_stairs_cells = tips.stairs[1]
            console.log(tips)
        }
        draw()
        dragon_info_2.textContent = text_dragon_info.tip1
    });
}

// наша вторая подсказка
var button_help2 = document.getElementById('help2');
button_help2.onclick = function help() {
    update_score(2)
    countTips++;
    clear_list()
    console.log("USE OUR TIPS")
    $.post( "/scan_matrix/", {
        canvas_data: JSON.stringify({field: board.board,
                                      color: board.my_color})
        }, function(err, req, resp) {
        tips = $.parseJSON(resp.responseText)
        var dragon_info = document.getElementById('dragon_info');
        if (tips != null) {
            if (tips.weak.length > 0 || tips.middle.length > 0 || tips.strong.length > 0) {
                console.log(tips)
                you_eat_cells = [tips.weak]
                can_eat_cells = [tips.strong]
                where_stairs_cells = [tips.middle]
                console.log(tips)
            }
        }
        draw()
        dragon_info_2.textContent = text_dragon_info.tip2
    });
}

// наша третья подсказка
var button_help3 = document.getElementById('help3');
button_help3.onclick = function help() {
    update_score(2)
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
        if (tips != null) {
            if (tips.weak.length > 0 || tips.middle.length > 0 || tips.strong.length > 0) {
                you_eat_cells = [tips.weak]
                can_eat_cells = [tips.strong]
                where_stairs_cells = [tips.middle]
            }
        }
        draw()
        dragon_info_2.textContent = text_dragon_info.tip2
    });
}

// пропуск хода
var button_pass = document.getElementById('pass1');
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
var button_pass = document.getElementById('pass2');
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

// сдаться
var button_resign = document.getElementById('resign1');
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
var button_resign = document.getElementById('resign2');
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
// end of input!