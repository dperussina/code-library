import numpy as np # Import NumPy for numerical array operations.
from sklearn.preprocessing import StandardScaler # Import the scaler from scikit-learn.

def scale_features(X_train: np.ndarray, X_test: np.ndarray | None = None):
    """Scales features using StandardScaler (mean=0, variance=1).

    It fits the scaler on the training data and transforms both training and test data.

    Args:
        X_train: Training data features (NumPy array).
        X_test: Test data features (NumPy array, optional).

    Returns:
        A tuple containing:
        - X_train_scaled: Scaled training data.
        - X_test_scaled: Scaled test data (or None if X_test was None).
        - scaler: The fitted StandardScaler object.
    """
    # Initialize the StandardScaler.
    scaler = StandardScaler()
    # Fit the scaler to the training data (calculates mean and standard deviation) and
    # then transform the training data (applies the scaling).
    X_train_scaled = scaler.fit_transform(X_train)
    # Transform the test data using the *same* scaler fitted on the training data.
    # Only transform, do not fit again on the test data to prevent data leakage.
    X_test_scaled = scaler.transform(X_test) if X_test is not None else None
    # Return the scaled data and the fitted scaler object.
    return X_train_scaled, X_test_scaled, scaler