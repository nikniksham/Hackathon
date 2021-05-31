mat = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

mat2 = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
know_cells = []
letters = "abcdefghjklmn"


def warning(contacts, team_cells, color, tips, matrix):
    for elem in contacts["s"]:
        if elem not in contacts["e"]:
            print(f"WARNING! Обрати внимание на ---> {letters[elem[0]]}{13 - elem[1]}{elem}")
            tips["enemy"][0].append(elem)
            tips["enemy"][1].append(team_cells)
            cont = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
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
    if matrix[y][x] == 0 and [x, y] not in di["kd"]:
        di["d"] += 1
        di["kd"].append([x, y])
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
                di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
                cells = []
                check_cell(x, y, col, cells, di, matrix)
                for cell in cells:
                    if cell not in know_cells:
                        know_cells.append(cell)
                if di["d"] == col:
                    print(di)
                    warning(di, cells, col, tips, matrix)
            if matrix[y][x] == -col and [x, y] not in know_cells:
                di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
                cells = []
                check_cell(x, y, -col, cells, di, matrix)
                for cell in cells:
                    if cell not in know_cells:
                        know_cells.append(cell)
                if di["d"] == col:
                    success(di, cells, tips)
    return tips


def scan_matrix(matrix, color):
    result = {"weak": [], "middle": [], "strong": []}
    col = -1 if color == "white" else 1
    know_cells.clear()
    for y in range(len(matrix)):
        for x in range(len(matrix[y])):
            if [x, y] not in know_cells and matrix[y][x] == col:
                di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
                cells = []
                check_cell(x, y, col, cells, di, matrix)
                if di["d"] < 3:
                    key = "weak"
                elif di["d"] == 3:
                    key = "middle"
                else:
                    key = "strong"
                for cell in cells:
                    result[key].append(cell)
                    know_cells.append(cell)
    return result


def check_co(matrix_old, matrix_new, x, y, color):
    print(x, y, color)
    for elem in matrix_new:
        print(elem)
    print()
    for elem in matrix_old:
        print(elem)
    col = -1 if color == "white" else 1
    if matrix_old[y][x] != col:
        print(0)
        di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
        cells = []
        check_cell(x, y, col, cells, di, matrix_new)
        print(di)
        if di["d"] > 0:
            print(1)
            return True
        if x < 12:
            di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
            cells = []
            check_cell(x + 1, y, -col, cells, di, matrix_new)
            if di["d"] == 0:
                print(2)
                return True
        if x > 0:
            di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
            cells = []
            check_cell(x - 1, y, -col, cells, di, matrix_new)
            if di["d"] == 0:
                print(3)
                return True
        if y < 12:
            di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
            cells = []
            check_cell(x, y + 1, -col, cells, di, matrix_new)
            if di["d"] == 0:
                print(4)
                return True
        if y > 0:
            di = {"d": 0, "m": 0, "s": [], "e": [], "kd": []}
            cells = []
            check_cell(x, y - 1, -col, cells, di, matrix_new)
            if di["d"] == 0:
                print(5)
                return True
    return False


if __name__ == '__main__':
    print(check_co(mat2, mat, 4, 5, "white"))
