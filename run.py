import json
from flask import Flask, render_template, url_for, request, flash
from werkzeug.utils import redirect

from Forms import LoginForm, RegisterForm, JoinForm
from work_with_api import Api
from check_field import *

api = Api()
app = Flask(__name__)
abc = "abcdefghjklmn"
app.config['SECRET_KEY'] = '84da5b8a39a6d06bf8bc7a60cedcac83'
email = "nikniksham@gmail.com"
password = "gohackaton"
nickname = "nikolausus"
letters = "abcdefghjklmn"
api.login_user(email, password)


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
    res = json.loads(request.form['canvas_data'])
    tips = check_matrix(res["field"], res["color"])
    print(tips)
    return json.dumps(tips)


@app.route('/scan_matrix/', methods=["POST"])
def scan_matrix_func():
    res = json.loads(request.form['canvas_data'])
    tips = scan_matrix(res["field"], res["color"])
    print(tips)
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
        if params["func"] == "get_best_move_enemy":
            res = api.get_best_move_enemy()
        if params["func"] == "get_best_move_zone":
            res = api.get_best_move_zone()
        if params["func"] == "get_superiority":
            res = api.get_superiority()
        if params["func"] == "get_future_moves":
            res = api.get_future_moves(params["count"])
        if params["func"] == "show_best_move":
            res = api.show_best_move(params["moves"])
        if params["func"] == "show_best_move_enemy":
            res = api.show_best_move_enemy(params["move"], params["moves"])
    print(res)
    return json.dumps(res)


@app.route('/get_tip_text/', methods=["POST"])
def get_tip_text():
    res = {
        "standard": api.get_text("tip", 1),
        "tip1": api.get_text("tip", 2),
        "tip2": api.get_text("tip", 6),
        "tip3": api.get_text("tip", 3),
        "tip4": api.get_text("tip", 4),
        "you_turn": api.get_text("info", 1),
        "enemy_turn": api.get_text("info", 2),
        "end_game": api.get_text("info", 6)
    }
    return json.dumps(res)


@app.route('/getmethod/<jsdata>')
def get_javascript_data(jsdata):
    return json.loads(jsdata)[0]


@app.route('/check_cell/', methods=["POST"])
def get_post_javascript_data():
    data = json.loads(request.form['canvas_data'])
    # jsdata = request.form['javascript_data']
    # print(json.loads(jsdata)[0])
    # return json.loads(jsdata)[0]
    # print(*board, sep='\n')
    # test changes
    # board[0][0] = 0
    # print(data)
    di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
    check_contact(data["x"], data["y"], -1 if data["color"] == "white" else 1, [], di, data["map"])
    # print(di)
    return json.dumps({"answer": di["d"] > 0})


@app.route('/get_count_moves/', methods=["POST"])
def get_count_moves():
    params = json.loads(request.form['canvas_data'])
    print(api.get_count_moves(params["game_code"]))
    return json.dumps({"count": api.get_count_moves(params["game_code"])})


@app.route('/get_who_win/', methods=["POST"])
def get_who_win():
    params = json.loads(request.form['canvas_data'])
    print(api.get_who_win(params["game_code"]))
    return json.dumps({"result": api.get_who_win(params["game_code"])})


@app.route('/getLoginData/')
def get_login_data():
    if not api.check_user():
        return None
    api.update_user_info()
    return json.dumps(api.get_json())


@app.route('/test_modal_window/')  # В после тестов удалить
def test_modal_window():
    return render_template("test_modal_window.html", user=api, style=url_for('static', filename='css/style.css'))


@app.route('/updateUserInfo/')
def update_user_info():
    print("success" if api.update_user_info() else "error")
    return json.dumps(api.get_json())


@app.route('/createGameWithBot/')
def create_game_with_bot():
    print("success" if api.create_game_with_bot() else "error")
    return redirect("/game/")


@app.route('/createGameByCode/')
def create_game_by_code():
    print("success" if api.create_game_by_code() else "error")
    return redirect("/closedGame2/")


@app.route('/createGameWithRandom/')
def create_game_with_random():
    print("success" if api.create_game_with_random() else "error")
    return redirect("/game/")


@app.route('/joinGameViaCode/', methods=["GET", "POST"])
def join_game_via_code():
    form = JoinForm()
    if form.validate_on_submit():
        if api.join_game(form.game_code.data):
            return redirect('/game/')
        else:
            return redirect("/joinGameViaCode/")
    return render_template('joinForm.html', form=form, user=api, style=url_for('static', filename='css/style.css'))


@app.route('/getGameInfo/', methods=["POST"])
def get_game_info():
    params = json.loads(request.form['game_data'])
    print("success" if api.game_info(params["game_code"]) else "error")
    return json.dumps(api.get_json())


@app.route('/closedGame2/')
def closed_game2():
    return render_template('closedGame2.html', title='Закрытая игра', style=url_for('static', filename='css/style.css'),
                           user=api)


@app.route('/closedGame/')
def closed_game():
    return render_template('closedGame.html', title='Закрытая игра', user=api,
                           style=url_for('static', filename='css/style.css'))


@app.route('/getpythondata/')
def get_python_data():
    return json.dumps("СВАБОДУ ПАПУГАЯМ!!")


@app.route("/change_lang/")
def change_lang():
    if api.language == "ru":
        api.change_language("en")
    else:
        api.change_language("ru")
    return redirect("/")


@app.route("/")
def website_main():
    if api.check_user():
        return render_template('main.html', title='Главная страница', style=url_for('static', filename='css/style.css'),
                               user=api)
    else:
        return redirect("/start/")


@app.route('/joinGame/', methods=['post', 'get'])
def join_game():
    form = JoinForm()
    if form.validate_on_submit():
        if api.join_game(form.game_code.data):
            return redirect('/game/')
    return render_template('joinForm.html', form=form, user=api, style=url_for('static', filename='css/style.css'))


@app.route('/test/', methods=['post', 'get'])
def test():
    return render_template('test.html', user=api, title='Здесь играть',
                           style=url_for('static', filename='css/style.css'))


@app.route("/logout/")
def logout():
    api.logout()
    return redirect("/")


@app.route('/login/', methods=['post', 'get'])
def login():
    if not api.check_user():
        form = LoginForm()
        if form.validate_on_submit():
            if api.login_user(form.email.data, form.password.data):
                return redirect('/')
            else:
                return render_template('login.html', form=form, success=False, user=api,
                                       style=url_for('static', filename='css/style.css'))
        return render_template('login.html', user=api, form=form, style=url_for('static', filename='css/style.css'))
    return redirect("/")


@app.route('/start/', methods=['post', 'get'])
def start():
    """
    if api.token is not None:
        return redirect("/")
    """
    return render_template('start.html', title="логин или регитсрация", user=api,
                           style=url_for('static', filename='css/style.css'))


@app.route('/register/', methods=['post', 'get'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        if api.register_user(form.email.data, form.nickname.data):
            return redirect('/')
        else:
            return render_template('register.html', form=form, success=False, user=api,
                                   style=url_for('static', filename='css/style.css'))
    return render_template('register.html', user=api, form=form, style=url_for('static', filename='css/style.css'))


@app.route("/game/")
def game_page():
    return render_template('game.html', user=api, title='Здесь играть',
                           style=url_for('static', filename='css/style.css'))


"""@socketio.on("i speak")
def vote(ponimanie):
    print(ponimanie)
    if ponimanie:
    api.create_game_with_bot()
        print("Меня поняли!")
    emit("я живой", {"result": True}, broadcast=True)
    api.create_game_with_bot()
    api.check_active_game()
    return render_template('game.html', title='Здесь играть', style=url_for('static', filename='css/style.css'),
                           navigation=False, user=api)
"""

if __name__ == '__main__':
    main(port=8000)
