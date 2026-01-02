import sys
import ast

def padStrokes(seq, maxLen):
    if len(seq) >= maxLen:
        return seq[:maxLen]

    pad_len = maxLen - len(seq)
    padding = [[0, 0, 0, 0, 0]] * pad_len
    return seq + padding

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    paddedSequence = padStrokes(drawing)
    print(paddedSequence)