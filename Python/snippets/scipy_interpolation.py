import numpy as np # Import NumPy for numerical arrays.
from scipy.interpolate import interp1d # Import the 1D interpolation function from SciPy.

def interpolate_1d(x_known: np.ndarray, y_known: np.ndarray, x_new: np.ndarray, kind: str = 'linear') -> np.ndarray:
    """Performs 1D interpolation using scipy.interpolate.interp1d.

    Estimates values (y_new) at new points (x_new) based on known data points (x_known, y_known).

    Args:
        x_known: Array of known x-coordinates (must be monotonically increasing).
        y_known: Array of known y-coordinates corresponding to x_known.
        x_new: Array of new x-coordinates where y-values are to be estimated.
        kind: Specifies the kind of interpolation ('linear', 'nearest', 'zero', 'slinear', 
              'quadratic', 'cubic', 'previous', 'next', or an integer degree).
              Defaults to 'linear'.

    Returns:
        A NumPy array containing the interpolated y-values corresponding to x_new.
        Returns an array of NaNs if interpolation fails.
    """
    # interp1d requires x_known to be sorted (monotonically increasing).
    if not np.all(np.diff(x_known) > 0):
        # Raise an error if x_known is not strictly increasing.
        raise ValueError("Input array x_known must be monotonically increasing.")

    try:
        # Create the interpolation function.
        # interp1d returns a callable function that can be used to find interpolated values.
        # kind specifies the interpolation method.
        # fill_value="extrapolate": Allows estimation outside the range of x_known (extrapolation).
        #                          Use with caution as extrapolation can be inaccurate.
        #                          Alternatively, set fill_value=(y_known[0], y_known[-1]) to use boundary values,
        #                          or leave as default (raises error for points outside range).
        interpolation_function = interp1d(x_known, y_known, kind=kind, fill_value="extrapolate", bounds_error=False)
        
        # Call the interpolation function with the new x-coordinates to get the estimated y-values.
        y_new = interpolation_function(x_new)
        return y_new
        
    except ValueError as e:
        # Handle potential errors during interpolation function creation or calling.
        print(f"Interpolation ValueError: {e}")
        # Return an array of NaNs with the same shape as x_new on error.
        return np.full_like(x_new, np.nan, dtype=np.double)
    except Exception as e:
        # Handle other unexpected errors.
        print(f"An unexpected error occurred during interpolation: {e}")
        # Return an array of NaNs.
        return np.full_like(x_new, np.nan, dtype=np.double)