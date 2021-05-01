from flask import Flask, render_template, url_for
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


@app.route("/")
def website_main():
    return render_template('main.html', title='Главная страница', style=url_for('static', filename='css/style.css'),
                           navigation=False, user=api)


@app.route("/game/")
def game_page():
    api.create_game_with_bot()
    api.check_active_game()
    return render_template('game.html', title='Здесь играть', style=url_for('static', filename='css/style.css'),
                           navigation=False, user=api)


if __name__ == '__main__':
    main(port=8000)
