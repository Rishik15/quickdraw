import sys
import ast
import math

def resampleStroke(x, y, spacing=1.0):
    new_x, new_y = [x[0]], [y[0]]
    accumulated = 0

    for i in range(1, len(x)):
        x0, y0 = x[i - 1], y[i - 1]
        x1, y1 = x[i], y[i]
        dx, dy = x1 - x0, y1 - y0
        dist = math.hypot(dx, dy)

        if dist == 0:
            continue

        t = 0
        while accumulated + spacing <= dist:
            t += spacing / dist
            nx = x0 + t * dx
            ny = y0 + t * dy
            new_x.append(nx)
            new_y.append(ny)
            dist -= spacing
            x0, y0 = nx, ny
            dx, dy = x1 - x0, y1 - y0
            dist = math.hypot(dx, dy)
            t = 0

    if new_x[-1] != x[-1] or new_y[-1] != y[-1]:
        new_x.append(x[-1])
        new_y.append(y[-1])

    return new_x, new_y


def resampleDrawing(drawing):
   return [resampleStroke(stroke[0], stroke[1]) for stroke in drawing]

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    newDrawing = resampleDrawing(drawing)
    print(newDrawing)