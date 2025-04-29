import numpy as np
from sklearn.model_selection import train_test_split, KFold

def split_data(X: np.ndarray, y: np.ndarray, test_size: float = 0.2, random_state: int | None = 42, shuffle: bool = True, stratify=None):
    """Splits data into training and testing sets."""
    return train_test_split(X, y, test_size=test_size, random_state=random_state, shuffle=shuffle, stratify=stratify)

def get_cv_indices(X: np.ndarray, n_splits: int = 5, random_state: int | None = 42, shuffle: bool = True):
    """Generates cross-validation indices using KFold."""
    kf = KFold(n_splits=n_splits, random_state=random_state, shuffle=shuffle)
    return kf.split(X)