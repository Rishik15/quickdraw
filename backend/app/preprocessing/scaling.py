import sys
import ast

def scaleTo256(drawing):
    all_x = [x for stroke in drawing for x in stroke[0]]
    all_y = [y for stroke in drawing for y in stroke[1]]
    max_val = max(max(all_x), max(all_y)) or 1  

    newDrawing = []
    for x, y in drawing:
        scaled_x = [round((xi / max_val) * 255) for xi in x]
        scaled_y = [round((yi / max_val) * 255) for yi in y]
        newDrawing.append([scaled_x, scaled_y])
    return newDrawing

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    newDrawing = scaleTo256(drawing)
    print(newDrawing)