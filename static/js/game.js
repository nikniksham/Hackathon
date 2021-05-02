/* console.log("start")

console.log("import websocket")
export const client = new WebSocket('ws://172.104.137.176:41239');

console.log("connect with server")
client.send(JSON.stringify([5, 'go/game']))
console.log("follow on the topic")
*/


score = 0
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
var user_token
var game_id
var outputData
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

function heat_map() {
    $.post( "/call_func/", {
         canvas_data: JSON.stringify({func: "get_heatmap",
                                      params: ""})
    }, function(err, req, resp){
        // board.loadBoard(resp.responseText)
        tmp_map = $.parseJSON(resp.responseText)
        console.log("get_heatmap")
        var tmp = new TempMap(tmp_map)
    });
}
/*
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
} */

function login_user() {
    console.log("1")
    $.get("/getlogindata", function(data) {
        user_data = $.parseJSON(data)
        console.log(user_data)
        var img = document.querySelector('.player_img')
        img.src = user_data.img_profile
        var nickname = document.querySelector('.player_nick')
        nickname.textContent = user_data.nickname
        user_token = user_data.token
        game_id = user_data.game_code
    })
    setTimeout(auth_client, 5000);}


function auth_client() {
    console.log("Авторизация пользователя")
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

var button_help = document.getElementById('help');
button_help.onclick = function help() {
     outputData = []
     for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 13; j++) {
            outputData.push(board.board[j][i]);
        }
     }
    $.post( "/check_matrix/", {
        canvas_data: JSON.stringify(outputData)
    }, function(err, req, resp) {
        // board.loadBoard(resp.responseText)
        tips = resp.responseText
        var dragon_info = document.getElementById('dragon_info');
        var text = ""
        if (tips["you"] && tips["you"].size() > 0) {text += "Твои камни под угрозой, обрати внимание на клетки ->"
            for (var i = 0; i < tips["you"].size(); ++i) {text += tips["you"][i]}
        }
        if (tips["enemy"] && tips["enemy"].size() > 0) {
            text += "Ты можешь захватить вражеские камни, обрати внимание на клетки ->"
            for (var i = 0; i < tips["enemy"].size(); ++i) {text += tips["enemy"][i]}
        }
        if (tips["stairs"] && tips["stairs"].size() > 0) {
            text += "Ты попал в ситуацию 'лестница', не стоит ходить на клетки ->"
            for (var i = 0; i < tips["stairs"].size(); ++i) {text += tips["stairs"][i]}
        }
        if (tips["you"] || tips["enemy"] || tips["stairs"]) {
            dragon_info.textContent = text
        } else {
            dragon_info.textContent = "На данный момент тебе помощь не требуется"
        }
    });
}

var button_pass = document.getElementById('pass');
button_pass.onclick = function send_pass() {
    console.log("pass")
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
    console.log("resign")
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
  // auth_client()
};

client.onmessage = function(event) {
  console.log("Полученны данные")
  data = $.parseJSON(event.data)
  console.log(data)
  if (data.payload.type == 'currentMap' || data.payload.type == "newTurn") {
        console.log("UPDATE MAP")
        if (data.payload.turn == 'black') {
            var info = document.getElementById('info').textContent = "Ход чёрного";
        } else {
            var info = document.getElementById('info').textContent = "Ход белого";
        }
      c.clearRect(0, 0, canvas.width, canvas.height);
      board.board = data.payload.currentMap
      board.update()
  } else if (data.payload.type == "endGame") {
        var info = document.getElementById('info').textContent = "Игра завершениа";

  }
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
        for (var i = 0; i < 13; i++) {
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

/*
var button_best_move = document.getElementById('get_best_move');
button_best_move.onclick = function(e) {
    console.log("loading best_move")
    get_best_move()
}

var button_best_move_enemy = document.getElementById('get_best_move_enemy');
button_map.onclick = function(e) {
    console.log("loading best_move_enemy")
    get_best_move_enemy()
}

var button_best_move_zone = document.getElementById('get_best_move_zone');
button_map.onclick = function(e) {
    console.log("loading best_move_zone")
    get_best_move_zone()
}

var button_superiority = document.getElementById('get_superiority');
button_map.onclick = function(e) {
    console.log("loading superiority")
    get_superiority()
    board.update()
} */
 //  get_superiority()
class Board {
    constructor () {
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

    add(x, y) {
        this.board[x][y] = 1
        c.clearRect(0, 0, canvas.width, canvas.height);
        this.update()
    }

    update() {
        console.log('UPDATE MAP')
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
        var myColor = 1
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
        } else if (this.board[x][y] == -1) {
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
        board = board.split(';')
        var res = []
        for (var i = 0; i < 169; i++) {
            res.push(parseInt(board[i]))
        }
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                this.board[j][i] = res[i * 13 + j]
            }
        }
        c.clearRect(0, 0, canvas.width, canvas.height);
        this.update()
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
        // console.log("fill: " + this.color)
    }
}


const board = new Board()
board.update()

addEventListener('click', (event) => {
    x = event.clientX - offset + r - startX
    y = event.clientY - offset + r - startY
    x = Math.floor(x/step)
    y = Math.floor(y/step)
    // console.log('tab At: ' + x + ':' + y+'\n'+board.board[x][y])
    if (board.board[x][y] == 0) {
        board.board[x][y] = -1
    }
    if (board.check(x, y)) {
        board.add(x, y)
        var abc = "abcdefghjklmn"
        console.log("AT:"+abc[x] + (y + 1).toString())
        const selection = true;
        // $.get( "/getmethod/<javascript_data>" );
         outputData = []
         for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                outputData.push(board.board[j][i]);
            }
         }
         $.post( "/a/", {
            canvas_data: JSON.stringify(outputData)
         }, function(err, req, resp){
            board.loadBoard(resp.responseText)
            console.log('LOADED FROM PYTHON');
         });
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
        $.get("/getpythondata", function(data) {
            console.log($.parseJSON(data))
        })
    } else if (board.board[x][y] == -1) {
        board.board[x][y] = 0
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
