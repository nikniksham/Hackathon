matrix = [[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
          [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, -1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]]


contacts = {"d": 0, "m": 0, "s": [], "e": []}
white_cell = []
black_cell = []


def warning():
    for elem in contacts["s"]:
        if elem not in contacts["e"]:
            print(f"WARNING!!!!!!! ТЕБЯ СЕЙЧАС СОЖРУТ ТУТ ---> {elem}")
            if contacts["m"] >= 7:
                print("Это похоже на лестницу, не советую там играть")
            break


def check_cell(x, y, c, cells):
    if matrix[y][x] == c and [x, y] not in cells:
        return check_contact(x, y, c, cells)
    if [x, y] not in contacts["s"] and [x, y] not in cells:
        contacts["s"].append([x, y])
        contacts["m"] += 1
    if matrix[y][x] == 0:
        contacts["d"] += 1
    if matrix[y][x] == c * -1:
        if [x, y] not in contacts["e"]:
            contacts["e"].append([x, y])
        return False


def check_contact(x, y, c, cells):
    cells.append([x, y])
    if x > 0:
        check_cell(x - 1, y, c, cells)
    if x < 13:
        check_cell(x + 1, y, c, cells)
    if y > 0:
        check_cell(x, y - 1, c, cells)
    if y < 13:
        check_cell(x, y + 1, c, cells)


check_contact(6, 6, -1, white_cell)
print(white_cell, contacts)
if contacts["d"] == 1:
    warning()