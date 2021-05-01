import requests


def post_response(url, json=None, data=None):
    """Возвращает ответ на post запрос
    error_code - елси ответ не 200
    response - елси всё хорошо"""
    response = requests.post(url, data=data, json=json)
    if response.status_code == 200:
        return response
    print(response.text)
    return response.status_code


def get_response(url, json={}):
    """Возвращает ответ на get запрос
    error_code - елси ответ не 200
    response - елси всё хорошо"""
    response = requests.get(url, json)
    if response.status_code == 200:
        return response
    print("G", response.text, "G")
    return response.status_code


def get_session_id(response):
    """Возвращает id сесии
    None - если нет id сесии
    id - если id нашлось"""
    for key, val in response.cookies.items():
        if key == "JSESSIONID":
            return val
    return None


login = {
  "type": "LOGIN",
  "name": "AgentNiki",
  "password": "6fgi3f",
  "locale": "en_US"
}

url = "https://www.gokgs.com/json-cors/access"

response = post_response(url, json=login)

print(get_session_id(response))
print(get_response(url, {"type": "LOGIN"})) # , {"JSESSIONID": get_session_id(response)}))#  {"ID": get_session_id(response)}))  # {"versionMajor": 3, "versionMinor": 5, "versionBugfix": 0, "jsonClientBuild":  get_session_id(response)}))
