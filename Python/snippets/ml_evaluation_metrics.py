from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

def classification_metrics(y_true: np.ndarray, y_pred: np.ndarray, average: str = 'binary') -> dict:
    """Calculates common classification metrics."""
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average=average)
    recall = recall_score(y_true, y_pred, average=average)
    f1 = f1_score(y_true, y_pred, average=average)
    return {'accuracy': accuracy, 'precision': precision, 'recall': recall, 'f1': f1}

def regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculates common regression metrics."""
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    return {'mse': mse, 'rmse': rmse, 'r2': r2}