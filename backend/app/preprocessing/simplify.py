from simplification.cutil import simplify_coords
import sys
import ast
import numpy as np

def simplifyDrawing(drawing, epsilon=2.0):
    simplified = []
    for x, y in drawing:
        points = np.array(list(zip(x, y)))
        simplified_pts = simplify_coords(points, epsilon)
        sx, sy = zip(*simplified_pts) if len(simplified_pts) > 0 else ([], [])
        simplified.append([list(sx), list(sy)])
    return simplified

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    newDrawing = simplifyDrawing(drawing)
    print(newDrawing)
