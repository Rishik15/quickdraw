import numpy as np
import sys
import ast

def predict(padded, model, le):
    X = np.expand_dims(padded, axis=0)
    pred = model.predict(X)

    index = []
    for i in range(len(pred[0])): 
        if pred[0][i] > 0.80:
            index.append(i)

    if len(index) == 0:
        index = [np.argmax(pred)]
        
    classNames = le.inverse_transform(index)

    return classNames

if __name__ == "__main__":
    file_path = sys.argv[1]
    with open(file_path, 'r') as f:
        content = f.read()
    padded = ast.literal_eval(content)
    classNames = predict(padded)
    print(classNames)

