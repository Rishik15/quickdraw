import ast
import sys

def alignToTopLeft(drawing):
    print("\nInput to alignToTopLeft:", drawing)
    
    if not drawing:
        raise ValueError("Empty drawing received")
        
    try:
        all_x = [x for stroke in drawing for x in stroke[0]]
        all_y = [y for stroke in drawing for y in stroke[1]]
        print("Extracted coordinates - X:", all_x[:5], "Y:", all_y[:5], "...")
        
        if not all_x or not all_y:
            raise ValueError("No coordinates found in drawing")
            
        min_x, min_y = min(all_x), min(all_y)
        print("Min values - X:", min_x, "Y:", min_y)

        newDrawing = []
    
        for x, y in drawing:
            shifted_x = [xi - min_x for xi in x]
            shifted_y = [yi - min_y for yi in y]
            newDrawing.append([shifted_x, shifted_y])
            
        print("Output from alignToTopLeft:", newDrawing)
        return newDrawing
            
    except Exception as e:
        print(f"Error in alignToTopLeft: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise

if __name__ == "__main__":
    argument = sys.argv[1]
    drawing = ast.literal_eval(argument)
    newDrawing = alignToTopLeft(drawing)
    print(newDrawing)
