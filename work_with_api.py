import random

import requests


class Api:
    def __init__(self):
        self.token = None  # token пользователя
        self.email = None  # email пользователя
        self.log = False  # Логирование программы
        self.game_code = None  # Код текущей игры пользователя
        self.user_info = None  # Информация о пользователе
        self.link = "https://go-backend-denis.ambersoft.llc/"  # Ссылка на сайт
        self.img_profile = None
        self.centaur_token = "Kf8darEBRsoJEiw0"

    def output(self, text):
        if self.log:
            print(text)

    def convert_heatmap(self, map):
        m, result = 0, []
        for _ in map:
            _.append(m)
            m = max(_)
        for _ in map:
            t = []
            for e in _:
                t.append(round(e / m, 4))
            result.append(t)
        return result

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

    def get_best_move(self):
        result = None
        if self.check_user() and self.check_active_game():
            params_best_move = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "count": 1
            }
            json_tip_best_move = requests.get(f"{self.link}hints/best-moves", params=params_best_move)
            if json_tip_best_move.status_code == 200:
                result = json_tip_best_move.json()["hint"][0]["move"]
                self.output(json_tip_best_move.json())
            else:
                self.output(f"json_tip_best_move выдал ошибку: {json_tip_best_move.status_code}")
        return result

    def get_best_move_enemy(self):
        result = None
        if self.check_user() and self.check_active_game():
            params_best_move_enemy = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "count": 1
            }
            json_tip_best_move_enemy = requests.get(f"{self.link}hints/best-moves", params=params_best_move_enemy)
            if json_tip_best_move_enemy.status_code == 200:
                result = json_tip_best_move_enemy.json()["hint"][0]["move"]
                self.output(json_tip_best_move_enemy.json())
            else:
                self.output(f"json_tip_best_move_enemy выдал ошибку: {json_tip_best_move_enemy.status_code}")
        return result

    def show_best_move(self, variables):
        result = None
        if self.check_user() and self.check_active_game():
            params_show_best = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "moves": variables
            }
            json_show_best = requests.get(f"{self.link}hints/show-best", params=params_show_best)
            if json_show_best.status_code == 200:
                result = json_show_best.json()["hint"]
                self.output(json_show_best.json())
            else:
                self.output(f"json_show_best выдал ошибку: {json_show_best.status_code}")
        return result

    def show_best_move_enemy(self, move, variables):
        result = None
        if self.check_user() and self.check_active_game():
            params_show_best_enemy = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "move": move,
                "moves": variables
            }
            json_show_best_enemy = requests.get(f"{self.link}hints/show-best-enemy", params=params_show_best_enemy)
            if json_show_best_enemy.status_code == 200:
                result = json_show_best_enemy.json()["hint"]
                if result == '':
                    result = random.choice(variables)
                self.output(json_show_best_enemy.json())
            else:
                self.output(f"json_show_best_enemy выдал ошибку: {json_show_best_enemy.status_code}")
        return result

    def get_future_moves(self, count):
        result = None
        if self.check_user() and self.check_active_game():
            params_future_moves = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "count": count
            }
            json_future_moves = requests.get(f"{self.link}hints/future-moves", params=params_future_moves)
            if json_future_moves.status_code == 200:
                result = []
                for _ in json_future_moves.json()["hint"]:
                    result.append(_["move"])
                self.output(json_future_moves.json())
            else:
                self.output(f"json_future_moves выдал ошибку: {json_future_moves.status_code}")
        return result

    def get_superiority(self):
        result = None
        if self.check_user() and self.check_active_game():
            params_superiority = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
            }
            json_superiority = requests.get(f"{self.link}hints/superiority", params=params_superiority)
            if json_superiority.status_code == 200:
                result = json_superiority.json()
                self.output(json_superiority.json())
            else:
                self.output(f"json_superiority выдал ошибку: {json_superiority.status_code}")
        return result

    def get_heatmap(self):
        result = None
        if self.check_user() and self.check_active_game():
            params_heatmap = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
            }
            json_heatmap = requests.get(f"{self.link}hints/heatmap-full", params=params_heatmap)
            if json_heatmap.status_code == 200:
                result = self.convert_heatmap(json_heatmap.json()["hint"])
                self.output(json_heatmap.json())
            else:
                self.output(f"json_heatmap выдал ошибку: {json_heatmap.status_code}")
        return result

    def get_heatmap_quarter(self, quarter):
        result = None
        if self.check_user() and self.check_active_game():
            params_heatmap_quarter = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "quarter": quarter
            }
            json_heatmap_quarter = requests.get(f"{self.link}hints/heatmap-quarter", params=params_heatmap_quarter)
            if json_heatmap_quarter.status_code == 200:
                result = self.convert_heatmap(json_heatmap_quarter.json()["hint"])
                self.output(json_heatmap_quarter.json())
            else:
                self.output(f"json_heatmap_quarter выдал ошибку: {json_heatmap_quarter.status_code}")
        return result

    def get_heatmap_two_quarter(self, quarters):
        result = None
        if self.check_user() and self.check_active_game():
            params_heatmap_two_quarter = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "quarters": quarters
            }
            json_heatmap_two_quarter = requests.get(f"{self.link}hints/heatmap-two-quarters", params=params_heatmap_two_quarter)
            if json_heatmap_two_quarter.status_code == 200:
                result = self.convert_heatmap(json_heatmap_two_quarter.json()["hint"])
                self.output(json_heatmap_two_quarter.json())
            else:
                self.output(f"json_heatmap_two_quarter выдал ошибку: {json_heatmap_two_quarter.status_code}")
        return result

    def get_best_move_zone(self, is_quarter=False):
        result = None
        if self.check_user() and self.check_active_game():
            params_best_move_zone = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
                "is_quarter": is_quarter
            }
            json_best_move_zon = requests.get(f"{self.link}hints/heatmap-best-move-zone", params=params_best_move_zone)
            if json_best_move_zon.status_code == 200:
                result = json_best_move_zon.json()["hint"]
                self.output(json_best_move_zon.json())
            else:
                self.output(f"json_best_move_zon выдал ошибку: {json_best_move_zon.status_code}")
        return result

    def get_heatmap_best_enemy_move_zone(self):
        result = None
        if self.check_user() and self.check_active_game():
            params_heatmap_best_enemy_move_zone = {
                "game_id": self.game_code,
                "centaur_token": self.centaur_token,
                "token": self.token,
            }
            json_heatmap_best_enemy_move_zone = requests.get(f"{self.link}hints/heatmap-best-enemy-move-zone", params=params_heatmap_best_enemy_move_zone)
            if json_heatmap_best_enemy_move_zone.status_code == 200:
                result = json_heatmap_best_enemy_move_zone.json()["hint"]
                self.output(json_heatmap_best_enemy_move_zone.json())
            else:
                self.output(f"json_heatmap_best_enemy_move_zone выдал ошибку: {json_heatmap_best_enemy_move_zone.status_code}")
        return result




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

    # Запрос лучшего возможного хода
    print(api.get_best_move())
    
    # Запрос лучшего возможного хода противника
    print(api.get_best_move_enemy())
    
    # Запрос лучших ходов на будущее
    print(api.get_future_moves(5))

    # Запрос самого лучшего хода из выбранных

    print(api.show_best_move(["d12", "a1", "c6"]))
    # Запрос самого лучшего из выбранных ходов противника (с учётом своего будущего)
    print(api.show_best_move_enemy("b2", ["d12", "a1", "c6"]))

    # Показать вревосходящего по очнам игрока
    print(api.get_superiority())

    # Запрос heatmap
    print(api.get_heatmap())

    # Запрос heatmap выбранной четверти
    print(api.get_heatmap_quarter(1))

    # Запрос heatmap выбранных двух четвертей
    print(api.get_heatmap_two_quarter("1,2"))

    # Запрос лучшей четверти для игры
    print(api.get_best_move_zone(True))

    # Запрос лучшей четверти для игры противника
    print(api.get_heatmap_best_enemy_move_zone())
