import numpy as np
import sys
import ast

def predict(padded, model, le, exclude=[], confidence_threshold=0.15):
    # Convert padded sequence to numpy array and ensure float32 dtype
    padded_array = np.array(padded, dtype=np.float32)
    X = np.expand_dims(padded_array, axis=0)
    print("Input shape to model:", X.shape)
    print("Input data type:", X.dtype)
    pred = model.predict(X)[0]
    print("Raw predictions:", pred)

    # Create array of indices sorted by prediction confidence
    sorted_indices = pred.argsort()[::-1]  # Highest to lowest confidence
    all_classes = le.classes_

    # Filter out excluded classes
    exclude_set = set(exclude)
    filtered_indices = [idx for idx in sorted_indices 
                       if all_classes[idx] not in exclude_set]

    # Get top 3 predictions that meet confidence threshold
    top_indices = []
    min_confidence = confidence_threshold
    
    # First try to get high confidence predictions with no randomization
    high_confidence_indices = [idx for idx in filtered_indices 
                             if pred[idx] >= min_confidence][:3]
    top_indices.extend(high_confidence_indices)
    
    # If we need more predictions, try with lower threshold and some randomization
    if len(top_indices) < 3:
        remaining_indices = [idx for idx in filtered_indices 
                           if idx not in top_indices]
        
        while len(top_indices) < 3 and remaining_indices:
            min_confidence *= 0.7  # Reduce threshold more gradually
            
            current_indices = [idx for idx in remaining_indices 
                             if pred[idx] >= min_confidence]
            
            if current_indices:
                current_scores = pred[current_indices]
                # Only add randomization for lower confidence predictions
                noise = np.random.uniform(0, 0.01) * current_scores
                randomized_scores = current_scores + noise
                sorted_current = [current_indices[i] for i in randomized_scores.argsort()[::-1]]
                
                remaining = 3 - len(top_indices)
                top_indices.extend(sorted_current[:remaining])
            
            if len(top_indices) < 3 and min_confidence < 0.02:
                # If we still need more, take highest remaining
                remaining = 3 - len(top_indices)
                top_indices.extend(remaining_indices[:remaining])
                break

    # Ensure we have exactly 3 predictions
    top_indices = top_indices[:3]
    
    classNames = le.inverse_transform(top_indices)
    return classNames

if __name__ == "__main__":
    file_path = sys.argv[1]
    with open(file_path, 'r') as f:
        content = f.read()
    padded = ast.literal_eval(content)
    classNames = predict(padded)
    print(classNames)
