import json
from flask import Flask, render_template, url_for, request
from work_with_api import Api
from check_field import *


api = Api()
app = Flask(__name__)
email = "nikniksham@gmail.com"
password = "gohackaton"
nickname = "nikolausus"
api_func = {
    "get_best_move": api.get_best_move,
    "get_best_move_enemy": api.get_best_move_enemy,
    "get_future_moves": api.get_future_moves,
    "show_best_move": api.show_best_move,
    "show_best_move_enemy": api.show_best_move_enemy,
    "get_superiority": api.get_superiority,
    "get_heatmap": api.get_heatmap,
    "get_heatmap_quarter": api.get_heatmap_quarter,
    "get_heatmap_two_quarter": api.get_heatmap_two_quarter,
    "get_best_move_zone": api.get_best_move_zone,
    "get_heatmap_best_enemy_move_zone": api.get_heatmap_best_enemy_move_zone
}


def upload(req):
    board = []
    req = json.loads(req)
    for _ in range(13):
        board.append(req[:13])
        req = req[13:]
    return board


def dump(board):
    res = ""
    for i in range(13):
        for j in range(13):
            res += str(board[i][j]) + ";"
    return res


def main(port=8000):
    app.run(port=port)


@app.route('/check_matrix/', methods=["POST"])
def check_matrix_func():
    board = upload(request.form['canvas_data'])
    tips = check_matrix(board)
    print(json.dumps(tips))
    return json.dumps(tips)


@app.route('/call_func/', methods=["POST"])
def check_matrix_func():
    params = json.loads(request.form)
    res = None
    if params["func"] == "get_heatmap":
        res = api_func[params["func"]]()
    return json.dumps(res)


@app.route('/getmethod/<jsdata>')
def get_javascript_data(jsdata):
    return json.loads(jsdata)[0]


@app.route('/a/', methods=["POST"])
def get_post_javascript_data():
    board = upload(request.form['canvas_data'])
    # jsdata = request.form['javascript_data']
    # print(json.loads(jsdata)[0])
    # return json.loads(jsdata)[0]
    # print(*board, sep='\n')
    # test changes
    # board[0][0] = 0
    return dump(board)


@app.route('/getlogindata')
def get_python_data_2():
    print("success" if api.login_user(email, password) else "error")
    print("success" if api.update_user_info() else "error")
    print("success" if api.create_game_with_bot() else "error")
    print("success" if api.game_info(api.game_code) else "error")
    return json.dumps(api.get_json())


@app.route('/getpythondata')
def get_python_data():
    return json.dumps("СВАБОДУ ПАПУГАЯМ!!")


@app.route("/")
def website_main():
    return render_template('main.html', title='Главная страница', style=url_for('static', filename='css/style.css'),
                           navigation=False, user=api)


@app.route("/game/")
def game_page():
    return render_template('game.html', title='Здесь играть', style=url_for('static', filename='css/style.css'))


"""@socketio.on("i speak")
def vote(ponimanie):
    print(ponimanie)
    if ponimanie:
        print("Меня поняли!")
    emit("я живой", {"result": True}, broadcast=True)
    api.create_game_with_bot()
    api.check_active_game()
    return render_template('game.html', title='Здесь играть', style=url_for('static', filename='css/style.css'),
                           navigation=False, user=api)
"""

if __name__ == '__main__':
    main(port=8000)
