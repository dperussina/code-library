import joblib
from pathlib import Path

def save_model(model, filepath: str | Path):
    """Saves a model using joblib."""
    try:
        joblib.dump(model, filepath)
        print(f"Model saved to {filepath}")
    except Exception as e:
        print(f"Error saving model to {filepath}: {e}")

def load_model(filepath: str | Path):
    """Loads a model using joblib."""
    try:
        model = joblib.load(filepath)
        print(f"Model loaded from {filepath}")
        return model
    except Exception as e:
        print(f"Error loading model from {filepath}: {e}")
        return None