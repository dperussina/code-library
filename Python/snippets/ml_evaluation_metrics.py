from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score # Import classification metrics.
from sklearn.metrics import mean_squared_error, r2_score # Import regression metrics.
import numpy as np # Import NumPy for array operations (like sqrt).

def classification_metrics(y_true: np.ndarray, y_pred: np.ndarray, average: str = 'binary') -> dict:
    """Calculates common classification metrics.

    Args:
        y_true: Ground truth (correct) target values.
        y_pred: Estimated targets as returned by a classifier.
        average: Averaging strategy for multiclass targets ('binary', 'micro', 'macro', 'weighted', 'samples').
                 Defaults to 'binary' for binary classification.

    Returns:
        A dictionary containing accuracy, precision, recall, and F1-score.
    """
    # Calculate Accuracy: Proportion of correct predictions.
    accuracy = accuracy_score(y_true, y_pred)
    # Calculate Precision: TP / (TP + FP). Ability of the classifier not to label as positive a sample that is negative.
    precision = precision_score(y_true, y_pred, average=average, zero_division=0)
    # Calculate Recall (Sensitivity): TP / (TP + FN). Ability of the classifier to find all the positive samples.
    recall = recall_score(y_true, y_pred, average=average, zero_division=0)
    # Calculate F1-Score: Harmonic mean of precision and recall. 2 * (precision * recall) / (precision + recall).
    f1 = f1_score(y_true, y_pred, average=average, zero_division=0)
    # Return metrics in a dictionary.
    # zero_division=0 prevents warnings when TP+FP or TP+FN is zero for a class.
    return {'accuracy': accuracy, 'precision': precision, 'recall': recall, 'f1': f1}

def regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculates common regression metrics.

    Args:
        y_true: Ground truth (correct) target values.
        y_pred: Estimated target values as returned by a regressor.

    Returns:
        A dictionary containing Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and R-squared (R2).
    """
    # Calculate Mean Squared Error (MSE): Average of the squares of the errors.
    mse = mean_squared_error(y_true, y_pred)
    # Calculate Root Mean Squared Error (RMSE): Square root of MSE.
    rmse = np.sqrt(mse)
    # Calculate R-squared (Coefficient of Determination): Proportion of the variance in the dependent variable predictable from the independent variable(s).
    r2 = r2_score(y_true, y_pred)
    # Return metrics in a dictionary.
    return {'mse': mse, 'rmse': rmse, 'r2': r2}