import numpy as np
from scipy.optimize import minimize

def objective_function(params: np.ndarray, *args) -> float:
    """Example objective function to minimize."""
    x, y = params
    return (1 - x)**2 + 100 * (y - x**2)**2

def find_minimum(func, initial_guess: np.ndarray, method: str = 'BFGS', func_args=()):
    """Finds the minimum of a scalar function of one or more variables."""
    try:
        result = minimize(func, initial_guess, args=func_args, method=method)
        if result.success:
            print(f"Optimization successful: {result.message}")
        else:
            print(f"Optimization failed: {result.message}")
        return result
    except Exception as e:
        print(f"Error during optimization: {e}")
        return None