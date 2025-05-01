import numpy as np # Import NumPy for array handling.
from sklearn.model_selection import train_test_split, KFold # Import utilities for splitting data.

def split_data(X: np.ndarray, y: np.ndarray, test_size: float = 0.2, random_state: int | None = 42, shuffle: bool = True, stratify=None):
    """Splits features (X) and target (y) into training and testing sets.

    Wraps scikit-learn's train_test_split function.

    Args:
        X: Features array.
        y: Target array.
        test_size: Proportion of the dataset to include in the test split (0.0 to 1.0).
        random_state: Controls shuffling for reproducible output.
        shuffle: Whether or not to shuffle the data before splitting.
        stratify: If not None, data is split in a stratified fashion, using this as the class labels.
                  Ensures that the proportion of values in the sample produced will be the same as the proportion
                  of values provided to parameter stratify.

    Returns:
        A tuple containing: (X_train, X_test, y_train, y_test).
    """
    # Directly use train_test_split from scikit-learn.
    return train_test_split(X, y, test_size=test_size, random_state=random_state, shuffle=shuffle, stratify=stratify)

def get_cv_indices(X: np.ndarray, n_splits: int = 5, random_state: int | None = 42, shuffle: bool = True):
    """Generates cross-validation indices using KFold.

    Provides train/test indices to split data into train/test sets.
    Useful for evaluating a model using cross-validation.

    Args:
        X: The data to be split (can be features or just indices).
           Only used to determine the number of samples.
        n_splits: Number of folds (k).
        random_state: Controls shuffling for reproducible output.
        shuffle: Whether to shuffle the data before splitting into batches.

    Returns:
        An iterator yielding (train_indices, test_indices) tuples for each fold.
    """
    # Initialize KFold with the desired number of splits and shuffling options.
    kf = KFold(n_splits=n_splits, random_state=random_state, shuffle=shuffle)
    # Return the iterator produced by kf.split(X).
    # The iterator yields arrays of indices for training and testing in each fold.
    return kf.split(X)