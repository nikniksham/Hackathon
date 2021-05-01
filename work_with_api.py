import requests


class Api:
    def __init__(self):
        self.token = None  # token пользователя
        self.email = None  # email пользователя
        self.log = True  # Логирование программы
        self.game_code = None  # Код текущей игры пользователя
        self.user_info = None  # Информация о пользователе
        self.link = "https://go-backend-denis.ambersoft.llc/"  # Ссылка на сайт
        self.img_profile = None

    def output(self, text):
        if self.log:
            print(text)

    def check_user(self):
        return True if self.token is not None else False

    def get_games(self):
        if self.check_user():
            if self.user_info is None:
                self.update_user_info()
            return self.user_info["user"]["games_history"]
        return None

    def check_active_game(self):
        result = False
        if self.check_user():
            json_active_games = requests.get(f"{self.link}game/current", params={"token": self.get_token()})
            if json_active_games.status_code == 200 and json_active_games.json()["gameId"] is not None:
                result = True
                self.output(f"активны игры: {json_active_games.json()}")
                self.game_code = json_active_games.json()["gameId"]
            else:
                self.output(f"json_active_games выдал ошибку: {json_active_games.status_code}")
        return result

    def get_token(self):
        return self.token

    def register_user(self, email, nickname):
        result = False
        if not self.check_user():
            params_register = {
                "email": email,
                "nickname": nickname
            }
            json_register_user = requests.post(f"{self.link}user/register", params=params_register)
            if json_register_user.status_code == 200:
                result = True
                self.token = json_register_user.json()["token"]
                self.email = email
                self.output(json_register_user.json())
            else:
                self.output(f"json_register_user выдал ошибку: {json_register_user.status_code}")
        return result

    def login_user(self, email, password):
        """Логин пользователя, Требует словарь, с параметрами: email и password пользователя"""
        result = False
        if not self.check_user():
            params_login = {
                "email": email,
                "password": password
            }
            json_login_user = requests.post(f"{self.link}user/login", params=params_login)
            if json_login_user.status_code == 200:
                result = True
                self.output(json_login_user.json())
                self.email = "email"
                self.token = json_login_user.json()["token"]
                self.update_user_info()
            else:
                self.output(f"json_login_user выдал ошибку: {json_login_user.status_code}")
        return result

    def update_user_info(self):
        result = False
        if self.check_user():
            json_about_user = requests.get(f"{self.link}user/profile", params={"token": self.get_token()})
            if json_about_user.status_code == 200:
                result = True
                self.img_profile = json_about_user.json()["user"]["avatar"]
                self.user_info = json_about_user.json()
                self.output(self.user_info)
            else:
                self.output(f"json_about_user выдал ошибку: {json_about_user.status_code}")
        return result

    def create_game_with_bot(self):
        result = False
        if self.check_user():
            if not self.check_active_game():
                json_create_game_with_bot = requests.post(f"{self.link}game/create/bot", params={"token": self.get_token()})
                if json_create_game_with_bot.status_code == 200:
                    result = True
                    self.game_code = json_create_game_with_bot.json()["gameId"]
                    self.output(json_create_game_with_bot.json())
                else:
                    self.output(f"json_create_game_with_bot выдал ошибку: {json_create_game_with_bot.status_code}")
        return result

    def game_info(self, game_code):
        result = False
        if self.check_user():
            if game_code is not None:
                json_game_info = requests.get(f"{self.link}game/info/{game_code}", params={"token": self.get_token()})
                if json_game_info.status_code == 200:
                    result = True
                    self.output(json_game_info.json())
                else:
                    self.output(f"json_game_info выдал ошибку: {json_game_info.status_code}")
        return result

    def logout(self):
        self.token = None
        self.email = None
        self.game_code = None
        self.user_info = None
        self.img_profile = None


# Работа с API
# Kf8darEBRsoJEiw0
# Необходимые данные для работы, а так же создание класса ООП
if __name__ == '__main__':
    email = "nikniksham@gmail.com"
    password = "gohackaton"
    nickname = "nikolausus"
    api = Api()

    # Логин пользователя
    print("success" if api.login_user(email, password) else "error")

    # Запрос информации о пользователе
    print("success" if api.update_user_info() else "error")

    # Создание игры с ботом
    print("success" if api.create_game_with_bot() else "error")

    # Запрос информации об игре
    print("success" if api.game_info(api.game_code) else "error")
