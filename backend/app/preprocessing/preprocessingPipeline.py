import sys
import ast
from app.preprocessing.aligning import alignToTopLeft
from app.preprocessing.scaling import scaleTo256
from app.preprocessing.resampling import resampleDrawing
from app.preprocessing.simplify import simplifyDrawing
from app.preprocessing.sequence import convertStrokes
from app.preprocessing.padding import padStrokes

maxLen = 486

def preprocessDoodle(drawing):
    drawing_xy = [[stroke[0], stroke[1]] for stroke in drawing]
    aligned = alignToTopLeft(drawing_xy)
    scaled = scaleTo256(aligned)
    resampled = resampleDrawing(scaled)
    simplified = simplifyDrawing(resampled, epsilon=2.0)
    simplified = [
        [[int(round(x)) for x in stroke[0]], [int(round(y)) for y in stroke[1]]]
        for stroke in simplified
    ]
    sequence = convertStrokes(simplified)
    padded = padStrokes(sequence, maxLen)
    
    return padded

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    sequence = preprocessDoodle(drawing)
    print("\n", sequence)