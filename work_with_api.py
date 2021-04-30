import requests


class Api:
    def __init__(self):
        self.token = None  # token пользователя
        self.email = None  # email пользователя
        self.log = True  # Логирование программы
        self.game_code = None  # Код текущей игры пользователя

    def output(self, text):
        if self.log:
            print(text)

    def login_user(self, params_login):
        """Логин пользователя, Требует словарь, с параметрами: email и password пользователя"""
        json_login_user = requests.post(f"{link}user/login", params=params_login)
        result = False
        if json_login_user.status_code == 200:
            result = True
            self.output(json_login_user.json())
            self.email = params_login["email"]
            self.token = json_login_user.json()["token"]
        else:
            self.output(f"json_login_user выдал ошибку: {json_login_user.status_code}")
        return result

    def about_user(self, params_about_user):
        params_about_user["token"] = self.token
        json_about_user = requests.get(f"{link}user/profile", params=params_about_user)
        result = False
        if json_about_user.status_code == 200:
            result = True
            self.output(json_about_user.json())  # ["user"]["games_history"][-1]
        else:
            self.output(f"json_about_user выдал ошибку: {json_about_user.status_code}")
        return result

    def create_game_with_bot(self, params_create_game_with_bot):
        params_create_game_with_bot["token"] = self.token
        json_create_game_with_bot = requests.post(f"{link}game/create/bot", params=params_create_game_with_bot)
        result = False
        if json_create_game_with_bot.status_code == 200:
            result = True
            self.game_code = json_create_game_with_bot.json()["gameId"]
            self.output(json_create_game_with_bot.json())
        else:
            self.output(f"json_create_game_with_bot выдал ошибку: {json_create_game_with_bot.status_code}")
        return result

    def game_info(self, params_game_info):
        params_game_info["token"] = self.token
        json_game_info = requests.get(f"{link}game/info/{self.game_code}", params=params_game_info)
        result = False
        if json_game_info.status_code == 200:
            result = True
            self.output(json_game_info.json())
        else:
            self.output(f"json_game_info выдал ошибку: {json_game_info.status_code}")
        return result


# token = "92751338ba57ee15ae1e307fff734df9aec84bca"
email = "nikniksham@gmail.com"
password = "gohackaton"
nickname = "nikolausus"
link = "https://go-backend-denis.ambersoft.llc/"
token = ""
game_code = 0
api = Api()

# Работа с API

# Логин пользователя
params_login = {
    "email": email,
    "password": password
}
print("success" if api.login_user(params_login) else "error")

# Запрос информации о пользователе
params_about_user = {
    "token": token
}
print("success" if api.about_user(params_about_user) else "error")

# Создание игры с ботом
params_create_game_with_bot = {
    "token": token
}
print("success" if api.create_game_with_bot(params_create_game_with_bot) else "error")

# Запрос информации об игре
params_game_info = {
    "token": token
}
print("success" if api.game_info(params_create_game_with_bot) else "error")
