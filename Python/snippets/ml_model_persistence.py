import joblib # Import joblib, efficient for saving/loading Python objects, especially those with large NumPy arrays.
from pathlib import Path # Import Path for object-oriented filesystem paths.

def save_model(model, filepath: str | Path):
    """Saves a trained machine learning model (or any Python object) using joblib.

    Args:
        model: The Python object (e.g., trained scikit-learn model) to save.
        filepath: The path (string or Path object) where the model should be saved.
    """
    try:
        # Use joblib.dump to serialize the model object and write it to the specified file.
        joblib.dump(model, filepath)
        # Confirm successful saving.
        print(f"Model saved to {filepath}")
    except Exception as e:
        # Handle potential errors during serialization or file writing.
        print(f"Error saving model to {filepath}: {e}")

def load_model(filepath: str | Path):
    """Loads a model (or any Python object) previously saved with joblib.

    Args:
        filepath: The path (string or Path object) from which to load the model.

    Returns:
        The loaded Python object (e.g., model), or None if loading fails.
    """
    try:
        # Use joblib.load to read the file and deserialize the object.
        model = joblib.load(filepath)
        # Confirm successful loading.
        print(f"Model loaded from {filepath}")
        # Return the loaded model object.
        return model
    except FileNotFoundError:
        # Specifically handle the case where the file doesn't exist.
        print(f"Error: Model file not found at {filepath}")
        return None
    except Exception as e:
        # Handle other potential errors during file reading or deserialization.
        print(f"Error loading model from {filepath}: {e}")
        return None