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
    try:
        print("\nSTART PREPROCESSING")
        print("Input to preprocessDoodle:", drawing)
        
        drawing_xy = [[stroke[0], stroke[1]] for stroke in drawing]
        print("\nDrawing XY:", drawing_xy)
        
        try:
            aligned = alignToTopLeft(drawing_xy)
            print("\nAfter alignment:", aligned)
        except Exception as e:
            print("Error in alignment:", str(e))
            raise
            
        try:
            scaled = scaleTo256(aligned)
            print("\nAfter scaling:", scaled)
        except Exception as e:
            print("Error in scaling:", str(e))
            raise
            
        try:
            resampled = resampleDrawing(scaled)
            print("\nAfter resampling:", resampled)
        except Exception as e:
            print("Error in resampling:", str(e))
            raise
            
        try:
            simplified = simplifyDrawing(resampled, epsilon=2.0)
            print("\nAfter simplification:", simplified)
        except Exception as e:
            print("Error in simplification:", str(e))
            raise
    
        try:
            simplified = [
                [[int(round(x)) for x in stroke[0]], [int(round(y)) for y in stroke[1]]]
                for stroke in simplified
            ]
            print("\nAfter rounding:", simplified)
        except Exception as e:
            print("Error in rounding:", str(e))
            raise
            
        try:
            sequence = convertStrokes(simplified)
            print("\nAfter sequence conversion:", sequence)
        except Exception as e:
            print("Error in sequence conversion:", str(e))
            raise
            
        try:
            padded = padStrokes(sequence, maxLen)
            print("\nAfter padding:", padded)
            print("END PREPROCESSING\n")
            return padded
        except Exception as e:
            print("Error in padding:", str(e))
            raise
            
    except Exception as e:
        print(f"Error in preprocessing pipeline: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    sequence = preprocessDoodle(drawing)
    print("\n", sequence)
