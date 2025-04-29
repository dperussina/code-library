import numpy as np
from sklearn.preprocessing import StandardScaler

def scale_features(X_train: np.ndarray, X_test: np.ndarray | None = None):
    """Scales features using StandardScaler."""
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test) if X_test is not None else None
    return X_train_scaled, X_test_scaled, scaler