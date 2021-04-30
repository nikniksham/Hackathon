from flask import Flask, render_template, url_for

app = Flask(__name__)


def main(port=8000):
    app.run(port=port)


@app.route("/")
def website_main():
    return render_template('main.html', title='Главная страница', style=url_for('static', filename='css/style.css'),
                           navigation=False)


@app.route("/game/")
def game_page():
    return render_template('game.html', title='Здесь играть', style=url_for('static', filename='css/style.css'),
                           navigation=False)


if __name__ == '__main__':
    main(port=8000)
