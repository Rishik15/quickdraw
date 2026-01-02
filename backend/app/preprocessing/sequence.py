import sys
import ast

def convertStrokes(drawing):
    sequence = []
    prevx, prevy = 0, 0

    for stroke in drawing:
        xseq, yseq = stroke
        for i in range(len(xseq)):
            dx = xseq[i] - prevx
            dy = yseq[i] - prevy
            prevx, prevy = xseq[i], yseq[i]

            if i < len(xseq) - 1:
                pen_state = [1, 0, 0]
            else:
                pen_state = [0, 1, 0]

            sequence.append([dx, dy] + pen_state)

    sequence.append([0, 0, 0, 0, 1])
    return sequence

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    sequence = convertStrokes(drawing)
    print(sequence)