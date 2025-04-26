import ast
import sys

def alignToTopLeft(drawing):
    all_x = [x for stroke in drawing for x in stroke[0]]
    all_y = [y for stroke in drawing for y in stroke[1]]
    min_x, min_y = min(all_x), min(all_y)

    newDrawing = []

    for x, y in drawing:
        shifted_x = [xi - min_x for xi in x]
        shifted_y = [yi - min_y for yi in y]
        newDrawing.append([shifted_x, shifted_y])
    return newDrawing

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    newDrawing = alignToTopLeft(drawing)
    print(newDrawing)