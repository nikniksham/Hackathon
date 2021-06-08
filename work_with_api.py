import random

import requests


class Api:
    def __init__(self):
        self.token = None  # token пользователя 4d2a6d934b1fecf4c5cf116f49b7e54174cd1dd4
        self.email = None  # email пользователя
        self.log = False  # Логирование программы
        self.nickname = None  # Nickname пользователя
        self.game_code = None  # Код текущей игры пользователя
        self.user_info = None  # Информация о пользователе
        self.link = "http://server.mindgamehack.ru/"  # Ссылка на сайт
        self.img_profile = None
        self.language = "en"
        self.game_code_close = ""
        self.centaur_token = "Kf8darEBRsoJEiw0"
        self.language_text = {
            "page": {
                "ru": {
                    1: "Добро пожаловать на сайт! Зарегистрируйся, добрый путник, или войди если ты уже ученик дракона",
                    2: "О, ты первый раз! Скажи мне как тебя звать и твою почту, чтобы стать частью клана дракона!",
                    3: "Припоминаю тебя, последователь дракона, но скажи мне пароль, чтобы войти в наш клан",
                    4: "Выбери свой путь, но выбирай с умом",
                    5: "Как ты хочешь начать свою игру?",
                    6: f"Код твоей игры ",
                    7: ", сообщи его своему противнику, чтобы начать бой",
                    8: "Скажи мне код своей игры, чтобы начать бой"
                },
                "en": {
                    1: "Welcome to the site! Register, kind traveler, or enter if you are already a dragon apprentice",
                    2: "Oh, you are the first time! Tell me your name and your email to become part of the dragon clan!",
                    3: "I remember you, follower of the dragon, but tell me the password to enter our clan",
                    4: "Choose your path, but choose wisely",
                    5: "How do you want to start your game?",
                    6: f"Your game code is ",
                    7: ", tell your opponent to start the fight",
                    8: "Tell me your game code to start the fight"
                }
            },
            "button": {
                "ru": {
                    1: "Зарегистрироваться",
                    2: "Войти",
                    3: "Далее",
                    4: "Продолжить игру",
                    5: "Игра с ИИ",
                    6: "Игра со случайным соперником",
                    7: "Закрытая игра",
                    8: "Выйти",
                    9: "Создать игру",
                    10: "Присоединиться по коду",
                    11: "Назад",
                    12: "Начать игру",
                    13: "Оценка ситуации",
                    14: "Тепловая карта (2)",
                    15: "Лучший ход (3)",
                    16: "Лучший ход противника (3)",
                    17: "Лучшая зона для игры (1)",
                    18: "Кто побеждает? (1)",
                    19: "Пас",
                    20: "Сдаться",
                    21: "В главное меню",
                    22: "Подсказки",
                    23: "Копировать код",
                    24: "Оценка моих камней",
                    25: "Оценка камней противника",
                    26: "Развитие игры на 3 хода (3)",
                    27: "Лучший ход из заданных (2)",
                    28: "Лучший ход противника из заданных (2)"
                },
                "en": {
                    1: "Register",
                    2: "Enter",
                    3: "Next",
                    4: "Continue the game",
                    5: "Game with AI",
                    6: "Play with a random opponent",
                    7: "Private game",
                    8: "Exit",
                    9: "Create a game",
                    10: "Join by code",
                    11: "Back",
                    12: "Start game",
                    13: "Evaluating of the situation (2)",
                    14: "Heat map (2)",
                    15: "Best move (3)",
                    16: "The opponent's best move (3)",
                    17: "Best play area (1)",
                    18: "Who wins? (1)",
                    19: "Pass",
                    20: "Resign",
                    21: "To the main menu",
                    22: "Hints",
                    23: "Copy code",
                    24: "Evaluating my stones (2)",
                    25: "Evaluating the opponent's stones (2)",
                    26: "Advancement of the game for 3 moves (3)",
                    27: "The best move of the given (2)",
                    28: "The opponent's best move of the given (2)"
                }
            },
            "tip": {
                "ru": {
                    1: "Удачной игры, юный последователь дракона.",
                    2: "Я отметил красным цветом твои камни, у которых одно дыхание, зелёный цветом вражеские камни,"
                       " которые ты можешь съесть, а жёлтым цветом отмечены камни в лестнице, не советую там играть",
                    3: "Отметь 3 позиции на доске, и я скажу, какая из них лучше",
                    4: "Отметь свой будущий ход, а потом 3 позиции для хода врага, и я скажу, который из них самый "
                       "вероятный",
                    5: "В данный момент тебе подскзка не нужна",
                    6: "Я оценил камни и выделил красным слабые, жёлтым средние, а зелёным сильные ",
                    7: "Поздравляю! Возвращайся и следующий раз приведи соперника еще сильнее, ведь мы становимся "
                       "лучше играя только с соперниками, которые сильнее нас!",
                    8: "Ты проиграл, сейчас начнется самое сложное - проанализируй игру, найди свои ошибки, продумай "
                       "как их избежать и стай сильнее своего соперника!",
                    9: "Выбери свою подсказку, но выбирай с умом, ведь каждая подсказка будет стоить тебе очков!",
                    10: "",
                    11: "",
                    12: ""
                },
                "en": {
                    1: "Happy play, dragon follower.",
                    2: "I marked in red your stones, which have one breath, in green are enemy stones that you can eat,"
                       " and stones in the stairs are marked in yellow, I do not advise playing there",
                    3: "Mark 3 positions on the board and I will tell you which one is better.",
                    4: "Mark your future move, and then 3 positions for the enemy's move, and I will tell you "
                       "which one is the most probable.",
                    5: "You don't need a hint at the moment",
                    6: "I evaluated stones and highlighted the weak ones in red, the medium ones in yellow, and "
                       "the strong ones in green.",
                    7: "Congratulations! Come back and next time bring your opponent even stronger, because we get "
                       "better playing only with opponents who are stronger than us!",
                    8: "You lost, now the most difficult thing will begin - analyze the game, find your mistakes, "
                       "think over how to avoid them and the pack is stronger than your opponent!",
                    9: "Choose your hint, but choose wisely, because every hint will cost you points!",
                    10: "",
                    11: "",
                    12: ""
                }
            },
            "forms": {
                "ru": {
                    1: "Почта",
                    2: "Никнейм",
                    3: "Код"
                },
                "en": {
                    1: "Email",
                    2: "Nickname",
                    3: "Code"
                }
            },
            "info": {
                "ru": {
                    1: "Твой ход",
                    2: "Ход противника",
                    3: "У вас осталось: ",
                    4: "У противника осталось: ",
                    5: "Загрузка игры",
                    6: "Игра завершена. Победил ",
                    7: "Ты съел камней: ",
                    8: "У тебя съедено камней: ",
                    9: "Потрачено очков на подсказки: ",
                    10: "Ход: ",
                    11: "Побеждает чёрный, у него очков: ",
                    12: "Побеждает белый, у него очков: ",
                    13: "Со счётом: ",
                    14: "На подсказки потрачено: "
                },
                "en": {
                    1: "You turn",
                    2: "Opponent's move",
                    3: "You still have: ",
                    4: "The opponent still has: ",
                    5: "Load game",
                    6: "The game is over. Won ",
                    7: "You ate stones: ",
                    8: "They ate your rocks: ",
                    9: "Points spent on hints: ",
                    10: "Move: ",
                    11: "Black wins, he has points: ",
                    12: "White wins, he has points: ",
                    13: "With the account: ",
                    14: "Spent on hints: "
                }
            }
        }

    def get_json(self):
        json_user = {
            "token": self.token,
            "nickname": self.nickname,
            "img_profile": self.img_profile,
            "game_code": self.game_code
        }
        return json_user

    def change_language(self, new_language):
        self.language = new_language

    def get_text(self, type, num):
        return self.language_text[type][self.language][num]

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
                self.output(
                    f"json_active_games выдал ошибку: {json_active_games.status_code} или уже есть созданная игра")
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
                # print(json_register_user.json()["token"])
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
                self.email = email
                # print(json_login_user.json())
                self.token = json_login_user.json()["token"]
                self.update_user_info()
            else:
                self.output(f"json_login_user выдал ошибку: {json_login_user.status_code}")
        return result

    def update_user_info(self):
        result = False
        if self.check_user():
            # print(self.get_token())
            json_about_user = requests.get(f"{self.link}user/profile", params={"token": self.get_token()})
            if json_about_user.status_code == 200:
                result = True
                # print(json_about_user.json())
                self.check_active_game()
                self.img_profile = json_about_user.json()["user"]["avatar"]
                self.user_info = json_about_user.json()
                self.nickname = json_about_user.json()["user"]["nickname"]
                self.output(self.user_info)
            else:
                self.output(f"json_about_user выдал ошибку: {json_about_user.status_code}")
        return result

    def create_game_with_bot(self):
        result = False
        if self.check_user():
            if not self.check_active_game():
                json_create_game_with_bot = requests.post(f"{self.link}game/create/bot",
                                                          params={"token": self.get_token()})
                if json_create_game_with_bot.status_code == 200:
                    result = True
                    self.game_code = json_create_game_with_bot.json()["gameId"]

                    self.output(json_create_game_with_bot.json())
                else:
                    self.output(f"json_create_game_with_bot выдал ошибку: {json_create_game_with_bot.status_code}")
        return result

    def create_game_by_code(self):
        result = False
        if self.check_user():
            json_create_game_by_code = requests.post(f"{self.link}game/create/code", params={"token": self.get_token()})
            if json_create_game_by_code.status_code == 200:
                result = True
                self.game_code = json_create_game_by_code.json()["gameId"]
                self.game_code_close = json_create_game_by_code.json()["code"]
                self.output(json_create_game_by_code.json()["code"])
            else:
                self.output(f"json_create_game_by_code выдал ошибку: {json_create_game_by_code.status_code}")
        return result

    def create_game_with_random(self):
        result = False
        if self.check_user():
            if not self.check_active_game():
                json_create_game_with_random = requests.post(f"{self.link}game/create/random",
                                                             params={"token": self.get_token()})
                if json_create_game_with_random.status_code == 200:
                    result = True
                    self.game_code = json_create_game_with_random.json()["gameId"]
                    self.output(json_create_game_with_random.json())
                else:
                    self.output(
                        f"json_create_game_with_random выдал ошибку: {json_create_game_with_random.status_code}")
        return result

    def join_game(self, code):
        result = False
        if self.check_user():
            json_join_game = requests.post(f"{self.link}game/join/{code}",
                                           params={"token": self.get_token(), "code": code})
            print(code, json_join_game.json())
            if json_join_game.status_code == 200:
                self.game_code_close = code
                self.game_code = json_join_game.json()["id"]
                result = True
                self.output(json_join_game.json())
            else:
                self.output(f"json_join_game выдал ошибку: {json_join_game.status_code}")
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

    def get_count_moves(self, game_code):
        result = False
        if self.check_user():
            if game_code is not None:
                json_get_count_moves = requests.get(f"{self.link}game/info/{game_code}",
                                                    params={"token": self.get_token()})
                if json_get_count_moves.status_code == 200:
                    result = len(json_get_count_moves.json()["moves"].split(";")) - 1
                    self.output(len(json_get_count_moves.json()["moves"].split(";")) - 1)
                else:
                    self.output(f"json_game_info выдал ошибку: {json_get_count_moves.status_code}")
        return result

    def get_who_win(self, game_code):
        result = False
        if self.check_user():
            if game_code is not None:
                json_get_who_win = requests.get(f"{self.link}game/info/{game_code}", params={"token": self.get_token()})
                if json_get_who_win.status_code == 200:
                    result = [json_get_who_win.json()["score_1"], json_get_who_win.json()["score_2"]]
                    self.output(result)
                else:
                    self.output(f"json_get_who_win выдал ошибку: {json_get_who_win.status_code}")
        return result

    def get_leader_board(self):
        result = False
        json_leaderboard = requests.get(f"{self.link}leader-board")
        if json_leaderboard.status_code == 200:
            result = json_leaderboard.json()
            self.output(result)
        else:
            self.output(f"json_leaderboard выдал ошибку: {json_leaderboard.status_code}")
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
                # print(json_tip_best_move.json()["hint"][0]["move"])
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
                result = json_superiority.json()["hint"]
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
            json_heatmap_two_quarter = requests.get(f"{self.link}hints/heatmap-two-quarters",
                                                    params=params_heatmap_two_quarter)
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
            json_heatmap_best_enemy_move_zone = requests.get(f"{self.link}hints/heatmap-best-enemy-move-zone",
                                                             params=params_heatmap_best_enemy_move_zone)
            if json_heatmap_best_enemy_move_zone.status_code == 200:
                result = json_heatmap_best_enemy_move_zone.json()["hint"]
                self.output(json_heatmap_best_enemy_move_zone.json())
            else:
                self.output(
                    f"json_heatmap_best_enemy_move_zone выдал ошибку: {json_heatmap_best_enemy_move_zone.status_code}")
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

    # print(111111, api.get_leader_board())
    # Запрос информации о пользователе
    print("success" if api.update_user_info() else "error")

    # Создание игры с ботом
    print("success" if api.create_game_with_bot() else "error")

    # Запрос информации об игре
    print("success" if api.game_info(api.game_code) else "error")

    print(api.get_count_moves(api.game_code))

    print(api.get_who_win(api.game_code))

    # Показать вревосходящего по очнам игрока
    print(api.get_superiority())

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
