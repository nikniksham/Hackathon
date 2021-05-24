import json
from flask import Flask, render_template, url_for, request, flash
from werkzeug.utils import redirect

from Forms import LoginForm
from work_with_api import Api
from check_field import *


api = Api()
app = Flask(__name__)
app.config['SECRET_KEY'] = '84da5b8a39a6d06bf8bc7a60cedcac83'
email = "nikniksham@gmail.com"
password = "gohackaton"
nickname = "nikolausus"
letters = "abcdefghjklmn"


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
def call_matrix_func():
    params = json.loads(request.form['canvas_data'])
    res = None
    if params["func"] is not None:
        if params["func"] == "get_heatmap":
            res = api.get_heatmap()
        if params["func"] == "get_best_move":
            res = api.get_best_move()
            res = [letters.index(res[0].lower()), 13 - int(res[1])]
        if params["func"] == "get_best_move_enemy":
            res = api.get_best_move_enemy()
            res = [letters.index(res[0].lower()), 13 - int(res[1])]
        if params["func"] == "get_best_move_zone":
            res = api.get_best_move_zone()
        if params["func"] == "get_superiority":
            res = api.get_superiority()
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
    # ("success" if api.login_user(email, password) else "error")
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


@app.route('/login/', methods=['post', 'get'])
def login():
    form = LoginForm()
    print(form.validate_on_submit())
    if form.validate_on_submit():
        print(form.email.data, " ", form.password.data)
        if api.login_user(form.email.data, form.password.data):
            print(12345678)
            return redirect('/game/')
        else:
            print(987654)
            return redirect(url_for('login'))
    return render_template('login.html', form=form)


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
    print("http://127.0.0.1:8000/login/")
    main(port=8000)
