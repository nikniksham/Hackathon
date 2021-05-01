from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


def main(port=8000):
    app.run(port=port)


@app.route("/")
def website_main():
    return render_template('main.html', title='Главная страница', style=url_for('static', filename='css/style.css'),
                           navigation=False)


@app.route("/game/")
def game_page():
    return render_template('game.html', title='Здесь играть', style=url_for('static', filename='css/style.css'))


@socketio.on("i speak")
def vote(ponimanie):
    print(ponimanie)
    if ponimanie:
        print("Меня поняли!")
    emit("я живой", {"result": True}, broadcast=True)


if __name__ == '__main__':
    main(port=8000)
