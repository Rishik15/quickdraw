from rdp import rdp
import sys
import ast

def simplifyDrawing(drawing, epsilon=2.0):
    simplified = []
    for x, y in drawing:
        points = list(zip(x, y))
        simplified_pts = rdp(points, epsilon=epsilon)
        sx, sy = zip(*simplified_pts) if simplified_pts else ([], [])
        simplified.append([list(sx), list(sy)])
    return simplified

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    newDrawing = simplifyDrawing(drawing)
    print(newDrawing)