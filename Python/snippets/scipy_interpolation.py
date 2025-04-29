import numpy as np
from scipy.interpolate import interp1d

def interpolate_1d(x_known: np.ndarray, y_known: np.ndarray, x_new: np.ndarray, kind: str = 'linear') -> np.ndarray:
    """Performs 1D interpolation."""
    if not np.all(np.diff(x_known) > 0):
        raise ValueError("x_known must be monotonically increasing.")
    try:
        interpolation_function = interp1d(x_known, y_known, kind=kind, fill_value="extrapolate")
        return interpolation_function(x_new)
    except ValueError as e:
        print(f"Interpolation error: {e}")
        return np.full_like(x_new, np.nan)
    except Exception as e:
        print(f"An unexpected error occurred during interpolation: {e}")
        return np.full_like(x_new, np.nan)