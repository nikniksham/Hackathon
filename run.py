import json
from flask import Flask, render_template, url_for, request
from work_with_api import Api


app = Flask(__name__)
api = Api()
email = "nikniksham@gmail.com"
password = "gohackaton"
nickname = "nikolausus"
print("success" if api.login_user(email, password) else "error")
print("success" if api.update_user_info() else "error")
print("success" if api.create_game_with_bot() else "error")
print("success" if api.game_info(api.game_code) else "error")


def main(port=8000):
    app.run(port=port)


@app.route('/getmethod/<jsdata>')
def get_javascript_data(jsdata):
    return json.loads(jsdata)[0]


@app.route('/a/', methods=["POST"])
def get_post_javascript_data():
    board = []
    try:
        req = json.loads(request.form['canvas_data'])
        for _ in range(13):
            board.append(req[:13])
            req = req[13:]
    except Exception:
        print("ERROR read data")
    # jsdata = request.form['javascript_data']
    # print(json.loads(jsdata)[0])
    # return json.loads(jsdata)[0]
    print(*board, sep='\n')
    return "HELLO"


@app.route('/getpythondata')
def get_python_data():
    return json.dumps("попка")


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
