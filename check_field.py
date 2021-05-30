mat = [[1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1],
       [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
       [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
       [0, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
       [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
       [1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1]]
know_cells = []
letters = "abcdefghjklmn"


def warning(contacts, team_cells, color, tips, matrix):
    for elem in contacts["s"]:
        if elem not in contacts["e"]:
            print(f"WARNING! Обрати внимание на ---> {letters[elem[0]]}{13 - elem[1]}{elem}")
            tips["enemy"][0].append(elem)
            tips["enemy"][1].append(team_cells)
            cont = {"d": 0, "m": 0, "s": [], "e": []}
            check_contact(elem[0], elem[1], color, team_cells, cont, matrix)
            if cont["d"] <= 2:
                tips["stairs"][0].append(elem)
                tips["stairs"][1].append(team_cells)
                print(
                    f'CAUTION! Не советую играть в лестницу ---> {letters[elem[0]]}{13 - elem[1]}')
            break


def success(contacts, cells, tips):
    for elem in contacts["s"]:
        if elem not in contacts["e"]:
            tips["you"][0].append(elem)
            tips["you"][1].append(cells)
            print(f"SUCCESS! Обрати внимание на ---> {letters[elem[0]]}{13 - elem[1]}")


def check_cell(x, y, c, cells, di, matrix):
    if matrix[y][x] == c and [x, y] not in cells:
        return check_contact(x, y, c, cells, di, matrix)
    if [x, y] not in di["s"] and [x, y] not in cells:
        di["s"].append([x, y])
        di["m"] += 1
    if matrix[y][x] == 0:
        di["d"] += 1
    if matrix[y][x] == -c:
        if [x, y] not in di["e"]:
            di["e"].append([x, y])
        return False


def check_contact(x, y, c, cells, di, matrix):
    cells.append([x, y])
    if x > 0:
        check_cell(x - 1, y, c, cells, di, matrix)
    if x < 12:
        check_cell(x + 1, y, c, cells, di, matrix)
    if y > 0:
        check_cell(x, y - 1, c, cells, di, matrix)
    if y < 12:
        check_cell(x, y + 1, c, cells, di, matrix)


def check_matrix(matrix, color):
    tips = {"you": [[], []], "enemy": [[], []], "stairs": [[], []]}
    col = -1 if color == "white" else 1
    know_cells.clear()
    for y in range(len(matrix)):
        for x in range(len(matrix[0])):
            if matrix[y][x] == col and [x, y] not in know_cells:
                di = {"d": 0, "m": 0, "s": [], "e": []}
                cells = []
                check_cell(x, y, col, cells, di, matrix)
                for cell in cells:
                    if cell not in know_cells:
                        know_cells.append(cell)
                if di["d"] == col:
                    warning(di, cells, col, tips, matrix)
            if matrix[y][x] == -col and [x, y] not in know_cells:
                di = {"d": 0, "m": 0, "s": [], "e": []}
                cells = []
                check_cell(x, y, -col, cells, di, matrix)
                for cell in cells:
                    if cell not in know_cells:
                        know_cells.append(cell)
                if di["d"] == col:
                    success(di, cells, tips)
    return tips


if __name__ == '__main__':
    print(check_matrix(mat, 1))
